// 📚 EXEMPLOS DE USO DA API MERCADO INTERNO

// ============================================
// 1️⃣ CADASTRAR UMA LOJA
// ============================================

const cadastrarLoja = async () => {
  const novaLoja = {
    nome: "Padaria do Centro",
    ra: "Asa Sul",
    categoria: "Alimentação",
    setor: "Comercial",
    vendedor: {
      nome: "Maria Santos",
      email: "maria@padaria.com",
      telefone: "(61) 3555-1234",
      cpf: "12345678900"
    },
    endereco: {
      rua: "SQS 302",
      numero: "125",
      complemento: "Bloco A",
      cep: "70232-000",
      latitude: -15.7942,
      longitude: -47.8822
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/lojas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaLoja)
    });

    const data = await response.json();
    console.log('✅ Loja cadastrada:', data.loja._id);
    return data.loja._id;
  } catch (erro) {
    console.error('❌ Erro ao cadastrar loja:', erro);
  }
};

// ============================================
// 2️⃣ CADASTRAR UM PRODUTO
// ============================================

const cadastrarProduto = async (lojaId) => {
  const novoProduto = {
    nome: "Pão Francês",
    preco: 0.80,
    descricao: "Pão francês quente e crocante, feito diariamente",
    categoria: "Pão",
    lojaId: lojaId,
    estoque: 100,
    imagem: "https://exemplo.com/pao.jpg"
  };

  try {
    const response = await fetch('http://localhost:3000/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoProduto)
    });

    const data = await response.json();
    if (data.sucesso) {
      console.log('✅ Produto cadastrado:', data.produto.nome);
      return data.produto._id;
    } else {
      console.error('❌ Erro:', data.mensagem);
    }
  } catch (erro) {
    console.error('❌ Erro ao cadastrar produto:', erro);
  }
};

// ============================================
// 3️⃣ LISTAR LOJAS DE UMA RA
// ============================================

const listarLojasPorRA = async (ra) => {
  try {
    const response = await fetch(`http://localhost:3000/api/lojas/ra/${encodeURIComponent(ra)}`);
    const data = await response.json();
    console.log(`📍 Lojas em ${ra}:`, data.lojas);
    return data.lojas;
  } catch (erro) {
    console.error('❌ Erro ao listar lojas:', erro);
  }
};

// ============================================
// 4️⃣ LISTAR PRODUTOS DE UMA RA
// ============================================

const listarProdutosPorRA = async (ra) => {
  try {
    const response = await fetch(`http://localhost:3000/api/produtos/ra/${encodeURIComponent(ra)}`);
    const data = await response.json();
    console.log(`📦 Produtos em ${ra}:`, data.produtos);
    return data.produtos;
  } catch (erro) {
    console.error('❌ Erro ao listar produtos:', erro);
  }
};

// ============================================
// 5️⃣ LISTAR PRODUTOS DE UMA LOJA
// ============================================

const listarProdutosDaLoja = async (lojaId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/loja/${lojaId}/produtos`);
    const data = await response.json();
    console.log(`📦 Produtos da loja:`, data.produtos);
    return data.produtos;
  } catch (erro) {
    console.error('❌ Erro ao listar produtos:', erro);
  }
};

// ============================================
// 6️⃣ DELETAR UM PRODUTO
// ============================================

const deletarProduto = async (produtoId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/produtos/${produtoId}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    if (data.sucesso) {
      console.log('✅ Produto deletado');
    }
  } catch (erro) {
    console.error('❌ Erro ao deletar produto:', erro);
  }
};

// ============================================
// 🧪 EXECUTAR EXEMPLO COMPLETO
// ============================================

const executarExemplo = async () => {
  console.log('🚀 Iniciando exemplo do Mercado Interno Brasília\n');

  // 1. Cadastrar loja
  const lojaId = await cadastrarLoja();

  // 2. Cadastrar alguns produtos
  if (lojaId) {
    await cadastrarProduto(lojaId);
  }

  // 3. Listar lojas da RA
  await listarLojasPorRA('Asa Sul');

  // 4. Listar produtos da RA
  await listarProdutosPorRA('Asa Sul');

  // 5. Listar produtos da loja específica
  if (lojaId) {
    await listarProdutosDaLoja(lojaId);
  }
};

// Descomente para executar no navegador/Node.js
// executarExemplo();

// ============================================
// 🔗 EXEMPLOS COM CURL (Terminal)
// ============================================

/*

# 1. Cadastrar loja
curl -X POST http://localhost:3000/api/lojas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja de Roupas",
    "ra": "Taguatinga",
    "categoria": "Vestuário",
    "setor": "Comercial",
    "vendedor": {
      "nome": "Carlos Silva",
      "email": "carlos@roupa.com",
      "telefone": "(61) 99999-8888"
    }
  }'

# 2. Listar todas as lojas
curl http://localhost:3000/api/lojas

# 3. Listar lojas de uma RA
curl http://localhost:3000/api/lojas/ra/Taguatinga

# 4. Cadastrar produto
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Camiseta",
    "preco": 49.90,
    "descricao": "Camiseta de qualidade",
    "lojaId": "ID_DA_LOJA",
    "estoque": 50
  }'

# 5. Listar produtos de uma RA
curl http://localhost:3000/api/produtos/ra/Taguatinga

# 6. Listar produtos de uma loja
curl http://localhost:3000/api/loja/ID_DA_LOJA/produtos

# 7. Deletar produto
curl -X DELETE http://localhost:3000/api/produtos/ID_DO_PRODUTO

*/

module.exports = {
  cadastrarLoja,
  cadastrarProduto,
  listarLojasPorRA,
  listarProdutosPorRA,
  listarProdutosDaLoja,
  deletarProduto,
  executarExemplo
};
