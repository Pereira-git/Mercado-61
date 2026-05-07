const Produto = require('../models/Produto');
const Loja = require('../models/Loja');

// 📦 Cadastrar novo produto
async function cadastrarProduto(dadosProduto) {
  try {
    // Validar se a loja existe
    const loja = await Loja.findById(dadosProduto.lojaId);
    if (!loja) {
      throw new Error('Loja não encontrada');
    }

    // Validar dados obrigatórios
    if (!dadosProduto.nome || !dadosProduto.preco || !dadosProduto.descricao) {
      throw new Error('Nome, preço e descrição são obrigatórios');
    }

    // Criar novo produto
    const novoProduto = new Produto({
      nome: dadosProduto.nome,
      preco: dadosProduto.preco,
      descricao: dadosProduto.descricao,
      categoria: dadosProduto.categoria || 'Geral',
      loja: dadosProduto.lojaId,
      estoque: dadosProduto.estoque || 0,
      imagem: dadosProduto.imagem || null,
      freteGratis: dadosProduto.freteGratis || false
    });

    await novoProduto.save();
    return {
      sucesso: true,
      mensagem: 'Produto cadastrado com sucesso!',
      produto: novoProduto
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: erro.message
    };
  }
}

// 🔍 Filtrar produtos por RA (Região Administrativa)
async function listarProdutosPorRA(ra) {
  try {
    // Encontrar todas as lojas da RA especificada
    const lojas = await Loja.find({ ra: ra, ativo: true });
    
    if (lojas.length === 0) {
      return {
        sucesso: false,
        mensagem: `Nenhuma loja encontrada em ${ra}`,
        produtos: []
      };
    }

    // Pegar IDs das lojas
    const lojaIds = lojas.map(loja => loja._id);

    // Encontrar produtos dessas lojas
    const produtos = await Produto.find({ 
      loja: { $in: lojaIds }, 
      ativo: true 
    }).populate('loja', 'nome ra categoria');

    return {
      sucesso: true,
      mensagem: `${produtos.length} produtos encontrados em ${ra}`,
      ra: ra,
      produtos: produtos
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: erro.message,
      produtos: []
    };
  }
}

// 🏪 Listar todas as lojas de uma RA
async function listarLojasPorRA(ra) {
  try {
    const lojas = await Loja.find({ ra: ra, ativo: true });
    
    return {
      sucesso: true,
      ra: ra,
      total: lojas.length,
      lojas: lojas
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: erro.message
    };
  }
}

// 📊 Listar produtos de uma loja específica
async function listarProdutosDaLoja(lojaId) {
  try {
    const produtos = await Produto.find({ loja: lojaId, ativo: true });
    const loja = await Loja.findById(lojaId);

    return {
      sucesso: true,
      loja: loja.nome,
      total: produtos.length,
      produtos: produtos
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: erro.message
    };
  }
}

// 🗑️ Deletar produto
async function deletarProduto(produtoId) {
  try {
    await Produto.findByIdAndUpdate(produtoId, { ativo: false });
    return {
      sucesso: true,
      mensagem: 'Produto deletado com sucesso!'
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: erro.message
    };
  }
}

// 🔍 Buscar produtos por termo (nome ou descrição)
async function buscarProdutos(termo, raFiltro = null) {
  try {
    // Criar filtro de busca
    const filtro = {
      ativo: true,
      $or: [
        { nome: { $regex: termo, $options: 'i' } },
        { descricao: { $regex: termo, $options: 'i' } }
      ]
    };

    // Adicionar filtro por RA se especificado
    if (raFiltro) {
      filtro['loja.ra'] = raFiltro;
    }

    // Buscar produtos com dados da loja populados
    const produtos = await Produto.find(filtro)
      .populate('loja', 'nome ra endereco vendedor')
      .sort({ criadoEm: -1 }); // Mais recentes primeiro

    return {
      sucesso: true,
      termo: termo,
      raFiltro: raFiltro,
      total: produtos.length,
      produtos: produtos
    };
  } catch (erro) {
    return {
      sucesso: false,
      mensagem: erro.message,
      produtos: []
    };
  }
}

module.exports = {
  cadastrarProduto,
  listarProdutosPorRA,
  listarLojasPorRA,
  listarProdutosDaLoja,
  deletarProduto,
  buscarProdutos
};
