/**
 * 📍 EXEMPLOS: Como usar as 33 RAs de Brasília no seu código
 */

// ============================================
// 1️⃣ USAR NO SERVIDOR (Node.js)
// ============================================

// Importar o arquivo de regiões
const regioes = require('./config/regioes');
const Loja = require('./models/Loja');

// Obter lista completa de RAs
console.log('📍 RAs disponíveis:', regioes.REGIOES_ADMINISTRATIVAS);
console.log(`Total de RAs: ${regioes.REGIOES_ADMINISTRATIVAS.length}`);

// Validar se uma RA é válida
console.log(regioes.validarRA('Asa Sul'));        // true
console.log(regioes.validarRA('Brasília Fake'));  // false

// Buscar RAs por termo
const resultatosAsas = regioes.buscarRAs('asa');  // ['Asa Sul', 'Asa Norte']
const resultadosLagos = regioes.buscarRAs('lago'); // ['Lago Sul', 'Lago Norte']

// Obter coordenadas de uma RA
const coordAsaSul = regioes.obterCoordenadas('Asa Sul');
console.log('📍 Asa Sul:', coordAsaSul);

// ============================================
// 2️⃣ USAR NO CONTROLLER/ROTA
// ============================================

async function cadastrarLojaComValidacao(req, res) {
  const { nome, ra, categoria, setor, vendedor, endereco } = req.body;

  // Método 1: Validar RA usando o arquivo de regiões
  if (!regioes.validarRA(ra)) {
    return res.status(400).json({
      erro: `RA '${ra}' inválida`,
      rasValidas: regioes.REGIOES_ADMINISTRATIVAS
    });
  }

  try {
    const novaLoja = new Loja({
      nome,
      ra,
      categoria,
      setor,
      vendedor,
      endereco
    });

    await novaLoja.save();

    res.status(201).json({
      sucesso: true,
      mensagem: 'Loja cadastrada em ' + ra,
      loja: novaLoja.obterDadosPublicos() // Retorna dados sem sensíveis
    });
  } catch (erro) {
    res.status(400).json({
      erro: erro.message,
      erros: erro.errors // Erros de validação do Mongoose
    });
  }
}

// ============================================
// 3️⃣ USAR NAS ROTAS - LISTAR RAS
// ============================================

// Rota para retornar lista de RAs (útil para frontend)
async function obterRAsDisponiveis(req, res) {
  res.json({
    total: regioes.REGIOES_ADMINISTRATIVAS.length,
    ras: regioes.REGIOES_ADMINISTRATIVAS
  });
}

// Rota para buscar RAs por termo
async function buscarRAs(req, res) {
  const { termo } = req.query;

  if (!termo) {
    return res.status(400).json({
      erro: 'Parâmetro "termo" é obrigatório'
    });
  }

  const resultados = regioes.buscarRAs(termo);

  res.json({
    termo: termo,
    encontrados: resultados.length,
    resultados: resultados
  });
}

// ============================================
// 4️⃣ USAR NAS ROTAS - ADICIONAR AO API.JS
// ============================================

/*
No arquivo routes/api.js, adicione:

const regioes = require('../config/regioes');

// Listar todas as RAs disponíveis
router.get('/regioes', async (req, res) => {
  res.json({
    total: regioes.REGIOES_ADMINISTRATIVAS.length,
    ras: regioes.REGIOES_ADMINISTRATIVAS,
    coordenadas: regioes.COORDENADAS_RAS
  });
});

// Buscar RAs por termo
router.get('/regioes/buscar', async (req, res) => {
  const { termo } = req.query;

  if (!termo) {
    return res.status(400).json({ erro: 'Termo é obrigatório' });
  }

  const resultados = regioes.buscarRAs(termo);
  res.json({
    termo: termo,
    encontrados: resultados.length,
    resultados: resultados
  });
});

// Obter coordenadas de uma RA
router.get('/regioes/:ra/coordenadas', async (req, res) => {
  const { ra } = req.params;
  const coords = regioes.obterCoordenadas(decodeURIComponent(ra));

  if (!coords) {
    return res.status(404).json({ erro: 'RA não encontrada' });
  }

  res.json({ ra: ra, coordenadas: coords });
});
*/

// ============================================
// 5️⃣ USAR NO FRONTEND (JavaScript/React)
// ============================================

/*
// Fetch para obter lista de RAs
async function carregarRAs() {
  try {
    const response = await fetch('http://localhost:3000/api/regioes');
    const data = await response.json();
    
    // Criar dropdown
    const select = document.getElementById('selectRA');
    data.ras.forEach(ra => {
      const option = document.createElement('option');
      option.value = ra;
      option.textContent = ra;
      select.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar RAs:', erro);
  }
}

// Buscar RAs enquanto digita
async function buscarRAsComAutocomplete(termo) {
  const response = await fetch(`http://localhost:3000/api/regioes/buscar?termo=${termo}`);
  const data = await response.json();
  return data.resultados;
}

// Validar RA e obter coordenadas
async function validarRAeObterCoordenadas(ra) {
  const response = await fetch(`http://localhost:3000/api/regioes/${encodeURIComponent(ra)}/coordenadas`);
  if (response.ok) {
    const data = await response.json();
    return { valida: true, coordenadas: data.coordenadas };
  } else {
    return { valida: false, coordenadas: null };
  }
}
*/

// ============================================
// 6️⃣ TESTES COM CURL
// ============================================

/*
# Listar todas as RAs
curl http://localhost:3000/api/regioes

# Buscar RAs por termo
curl "http://localhost:3000/api/regioes/buscar?termo=asa"

# Obter coordenadas
curl "http://localhost:3000/api/regioes/Asa%20Sul/coordenadas"

# Cadastrar loja (com RA válida)
curl -X POST http://localhost:3000/api/lojas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja teste",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João",
      "email": "joao@teste.com",
      "telefone": "(61) 98765-4321",
      "cpf": "123.456.789-00"
    },
    "endereco": {
      "rua": "SQS 302",
      "numero": "125",
      "cep": "70232-000",
      "latitude": -15.7942,
      "longitude": -47.8822
    }
  }'

# Cadastrar loja com RA inválida (vai retornar erro)
curl -X POST http://localhost:3000/api/lojas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja teste",
    "ra": "Brasília Fake",
    "categoria": "Comercial",
    ...
  }'
*/

// ============================================
// 7️⃣ MÉTODOS DO SCHEMA
// ============================================

/*
// Obter RAs válidas
const rasValidas = await Loja.obterRAsValidas();
console.log(rasValidas);

// Validar uma RA
const ehValida = Loja.validarRA('Asa Sul');
console.log(ehValida); // true

// Obter dados públicos de uma loja (sem CPF, email, etc)
const loja = await Loja.findById(id);
const dadosPublicos = loja.obterDadosPublicos();
console.log(dadosPublicos);
*/

module.exports = {
  cadastrarLojaComValidacao,
  obterRAsDisponiveis,
  buscarRAs
};
