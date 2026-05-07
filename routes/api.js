const express = require('express');
const router = express.Router();
const Loja = require('../models/Loja');

// ❗ CORREÇÃO: Produto estava sendo usado mas nunca importado
const Produto = require('../models/Produto');

const produtoUtils = require('../utils/produtoUtils');
const validadores = require('../utils/validadores');
const regioes = require('../config/regioes');

// 🏪 ROTAS DE LOJAS

// Cadastrar nova loja
router.post('/lojas', async (req, res) => {
  try {
    const { nome, slogan, ra, categoria, setor, vendedor, endereco } = req.body;

    const { valido, erros } = validadores.validarDadosLoja(req.body);
    
    if (!valido) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro na validação dos dados',
        erros: erros
      });
    }

    const novaLoja = new Loja({ nome, slogan, ra, categoria, setor, vendedor, endereco });
    await novaLoja.save();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Loja cadastrada com sucesso!',
      loja: novaLoja.obterDadosPublicos()
    });
  } catch (erro) {
    if (erro.name === 'ValidationError') {
      const errosValidacao = Object.values(erro.errors).map(e => e.message);
      return res.status(400).json({ sucesso: false, mensagem: 'Erro de validação', erros: errosValidacao });
    }

    if (erro.code === 11000) {
      return res.status(400).json({ sucesso: false, mensagem: 'Este CPF já está registrado no sistema' });
    }

    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// Listar todas as lojas
router.get('/lojas', async (req, res) => {
  try {
    const lojas = await Loja.find({ ativo: true });
    res.json({ total: lojas.length, lojas: lojas });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Filtrar lojas por RA
router.get('/lojas/ra/:ra', async (req, res) => {
  try {
    const resultado = await produtoUtils.listarLojasPorRA(req.params.ra);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Obter detalhes de uma loja
router.get('/lojas/:id', async (req, res) => {
  try {
    const loja = await Loja.findById(req.params.id);
    if (!loja) return res.status(404).json({ erro: 'Loja não encontrada' });
    res.json(loja);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Excluir uma loja pelo ID
router.delete('/lojas/:id', async (req, res) => {
  try {
    const loja = await Loja.findByIdAndDelete(req.params.id);
    if (!loja) return res.status(404).json({ sucesso: false, mensagem: 'Loja não encontrada' });
    res.json({ sucesso: true, mensagem: 'Loja removida com sucesso!' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// 📦 ROTAS DE PRODUTOS

// Cadastrar novo produto
router.post('/produtos', async (req, res) => {
  try {
    const resultado = await produtoUtils.cadastrarProduto(req.body);
    if (resultado.sucesso) {
      res.status(201).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// ⚠️ ATENÇÃO: Rotas específicas SEMPRE antes de rotas com parâmetro (:id, :ra, :termo)
// Se colocar /:id antes de /destaques, o Express interpreta "destaques" como um ID e quebra.

// 🌟 Listar produtos em destaque (mais recentes)
router.get('/produtos/destaques', async (req, res) => {
  try {
    const limiteNum = req.query.limite ? parseInt(req.query.limite) : 12;

    const produtos = await Produto.find({ ativo: true })
      .populate('loja', 'nome ra endereco')
      .sort({ criadoEm: -1 })
      .limit(limiteNum);

    res.json({ sucesso: true, total: produtos.length, produtos: produtos });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// 🔍 Buscar produtos por termo (nome ou descrição)
router.get('/produtos/buscar/:termo', async (req, res) => {
  try {
    const resultado = await produtoUtils.buscarProdutos(req.params.termo, req.query.ra);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Listar produtos por RA
router.get('/produtos/ra/:ra', async (req, res) => {
  try {
    const resultado = await produtoUtils.listarProdutosPorRA(req.params.ra);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Listar produtos de uma loja
router.get('/loja/:lojaId/produtos', async (req, res) => {
  try {
    const resultado = await produtoUtils.listarProdutosDaLoja(req.params.lojaId);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// Deletar (desativar) produto
router.delete('/produtos/:id', async (req, res) => {
  try {
    const resultado = await produtoUtils.deletarProduto(req.params.id);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// ============================================
// 📍 ROTAS DE REGIÕES ADMINISTRATIVAS
// ============================================

router.get('/regioes', (req, res) => {
  res.json({
    total: regioes.REGIOES_ADMINISTRATIVAS.length,
    ras: regioes.REGIOES_ADMINISTRATIVAS,
    coordenadas: regioes.COORDENADAS_RAS
  });
});

router.get('/regioes/buscar/:termo', (req, res) => {
  const resultados = regioes.buscarRAs(req.params.termo);
  res.json({ termo: req.params.termo, encontrados: resultados.length, resultados });
});

router.get('/regioes/:ra/coordenadas', (req, res) => {
  const ra = req.params.ra;
  const coords = regioes.obterCoordenadas(decodeURIComponent(ra));

  if (!coords) {
    return res.status(404).json({
      erro: `RA '${ra}' não encontrada`,
      rasDisponiveis: regioes.REGIOES_ADMINISTRATIVAS
    });
  }

  res.json({ ra, coordenadas: coords });
});

// ============================================
// 🧪 ROTAS DE TESTE
// ============================================

router.post('/teste/loja', async (req, res) => {
  try {
    const lojaTestePadrao = {
      nome: 'Loja Teste Brasília',
      ra: req.body.ra || 'Asa Sul',
      categoria: req.body.categoria || 'Comercial',
      setor: req.body.setor || 'Comercial',
      vendedor: {
        nome: req.body.vendedor?.nome || 'João da Silva',
        email: req.body.vendedor?.email || 'joao.teste@email.com',
        telefone: req.body.vendedor?.telefone || '(61) 98765-4321',
        cpf: req.body.vendedor?.cpf || '123.456.789-00'
      },
      endereco: {
        rua: req.body.endereco?.rua || 'SQS 302',
        numero: req.body.endereco?.numero || '125',
        complemento: req.body.endereco?.complemento || 'Bloco A, Loja 5',
        cep: req.body.endereco?.cep || '70232-000',
        latitude: req.body.endereco?.latitude || -15.7942,
        longitude: req.body.endereco?.longitude || -47.8822
      }
    };

    const { valido, erros } = validadores.validarDadosLoja(lojaTestePadrao);

    if (!valido) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação nos dados de teste',
        erros,
        dadosEnviados: lojaTestePadrao
      });
    }

    const novaLoja = new Loja(lojaTestePadrao);
    await novaLoja.save();

    res.status(201).json({
      sucesso: true,
      mensagem: '✅ Loja de teste cadastrada com sucesso!',
      loja: novaLoja.obterDadosPublicos(),
      dica: 'Para testar com dados diferentes, envie um POST com os campos que deseja sobrescrever'
    });
  } catch (erro) {
    if (erro.name === 'ValidationError') {
      return res.status(400).json({
        sucesso: false,
        mensagem: '❌ Erro de validação do Mongoose',
        erros: Object.values(erro.errors).map(e => e.message)
      });
    }

    if (erro.code === 11000) {
      return res.status(400).json({
        sucesso: false,
        mensagem: '❌ Este CPF já está registrado. Mude o CPF nos dados de teste.'
      });
    }

    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

router.post('/teste/validar-loja', (req, res) => {
  const { valido, erros } = validadores.validarDadosLoja(req.body);

  if (valido) {
    res.json({ sucesso: true, mensagem: '✅ Todos os dados são válidos!', dados: req.body });
  } else {
    res.status(400).json({
      sucesso: false,
      mensagem: '❌ Erros na validação encontrados',
      erros,
      dica: 'Corrija os erros acima e tente novamente'
    });
  }
});

router.get('/teste/dados-loja', (req, res) => {
  const { ra } = req.query;
  const coordenadas = ra ? regioes.obterCoordenadas(ra) : regioes.obterCoordenadas('Asa Sul');

  const dadosTeste = {
    nome: 'Loja Teste Brasília',
    ra: ra || 'Asa Sul',
    categoria: 'Comercial',
    setor: 'Comercial',
    vendedor: {
      nome: 'João da Silva',
      email: 'joao.teste@email.com',
      telefone: '(61) 98765-4321',
      cpf: '123.456.789-00'
    },
    endereco: {
      rua: 'SQS 302',
      numero: '125',
      complemento: 'Bloco A, Loja 5',
      cep: '70232-000',
      latitude: coordenadas?.latitude || -15.7942,
      longitude: coordenadas?.longitude || -47.8822
    }
  };

  res.json({
    mensagem: 'Dados de teste pré-preenchidos',
    dados: dadosTeste,
    rasDisponiveis: regioes.REGIOES_ADMINISTRATIVAS,
    instrucoes: {
      passo1: 'Use estes dados como base para seus testes',
      passo2: 'Para testar com RA diferente, adicione ?ra=NomeDaRA na URL',
      passo3: 'Você pode modificar campos individuais conforme necessário',
      passo4: 'Envie um POST para /api/teste/loja com os dados'
    }
  });
});

module.exports = router;