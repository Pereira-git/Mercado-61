/**
 * 🧪 TESTES DE VALIDAÇÃO - Node.js
 * Execute: node teste-validacoes-nodejs.js
 */

const API_URL = 'http://localhost:3000/api';

// 🎨 Cores para console
const cores = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// ✏️ Função para imprimir com cores
function log(tipo, mensagem) {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  
  switch(tipo) {
    case 'titulo':
      console.log(`\n${cores.bright}${cores.blue}${'='.repeat(50)}${cores.reset}`);
      console.log(`${cores.bright}${cores.blue}${mensagem}${cores.reset}`);
      console.log(`${cores.bright}${cores.blue}${'='.repeat(50)}${cores.reset}\n`);
      break;
    case 'teste':
      console.log(`${cores.yellow}[TESTE] ${mensagem}${cores.reset}`);
      break;
    case 'sucesso':
      console.log(`${cores.green}[✅] ${mensagem}${cores.reset}`);
      break;
    case 'erro':
      console.log(`${cores.red}[❌] ${mensagem}${cores.reset}`);
      break;
    case 'info':
      console.log(`${cores.cyan}[ℹ️] ${mensagem}${cores.reset}`);
      break;
    case 'resposta':
      console.log(`${cores.dim}${mensagem}${cores.reset}`);
      break;
    default:
      console.log(mensagem);
  }
}

// 📡 Função para fazer requisição
async function fazer(metodo, endpoint, dados = null) {
  try {
    const opcoes = {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (dados) {
      opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);
    const json = await resposta.json();
    
    return {
      status: resposta.status,
      ok: resposta.ok,
      dados: json
    };
  } catch (erro) {
    return {
      status: 0,
      ok: false,
      erro: erro.message
    };
  }
}

// 🧪 Suite de testes
async function executarTestes() {
  log('titulo', '🧪 TESTES DE VALIDAÇÃO - MERCADO INTERNO');
  
  // TESTE 1: Listar RAs
  log('teste', 'Listar todas as 33 RAs');
  let resultado = await fazer('GET', '/regioes');
  if (resultado.ok) {
    log('sucesso', `${resultado.dados.total} RAs encontradas`);
    log('resposta', `RAs: ${resultado.dados.ras.join(', ')}`);
  } else {
    log('erro', 'Falha ao listar RAs');
  }

  // TESTE 2: Buscar RAs
  log('teste', 'Buscar RAs por termo (asa)');
  resultado = await fazer('GET', '/regioes/buscar/asa');
  if (resultado.ok) {
    log('sucesso', `${resultado.dados.encontrados} RAs encontradas para "asa"`);
    log('resposta', `Resultados: ${resultado.dados.resultados.join(', ')}`);
  } else {
    log('erro', 'Falha ao buscar RAs');
  }

  // TESTE 3: Obter coordenadas
  log('teste', 'Obter coordenadas de Taguatinga');
  resultado = await fazer('GET', '/regioes/Taguatinga/coordenadas');
  if (resultado.ok) {
    const { latitude, longitude } = resultado.dados.coordenadas;
    log('sucesso', `Coordenadas: ${latitude}, ${longitude}`);
  } else {
    log('erro', 'Falha ao obter coordenadas');
  }

  // TESTE 4: Obter dados de teste
  log('teste', 'Obter dados de teste pré-preenchidos para Asa Sul');
  resultado = await fazer('GET', '/teste/dados-loja?ra=Asa%20Sul');
  if (resultado.ok) {
    log('sucesso', 'Dados de teste obtidos');
    log('resposta', JSON.stringify(resultado.dados.dados, null, 2));
  } else {
    log('erro', 'Falha ao obter dados de teste');
  }

  // TESTE 5: Validar dados válidos
  log('teste', 'Validar dados VÁLIDOS');
  const dadosValidos = {
    nome: 'Loja Válida',
    ra: 'Asa Sul',
    categoria: 'Comercial',
    setor: 'Comercial',
    vendedor: {
      nome: 'João Silva',
      email: 'joao@teste.com',
      telefone: '(61) 98765-4321',
      cpf: '111.222.333-44'
    },
    endereco: {
      rua: 'SQS 302',
      numero: '125',
      cep: '70232-000',
      latitude: -15.7942,
      longitude: -47.8822
    }
  };
  resultado = await fazer('POST', '/teste/validar-loja', dadosValidos);
  if (resultado.ok && resultado.dados.sucesso) {
    log('sucesso', 'Dados validados com sucesso!');
  } else {
    log('erro', `Validação falhou: ${JSON.stringify(resultado.dados.erros)}`);
  }

  // TESTE 6: RA inválida
  log('teste', 'Validar RA INVÁLIDA (Brasília Fake)');
  const dadosRAInvalida = {
    ...dadosValidos,
    ra: 'Brasília Fake'
  };
  resultado = await fazer('POST', '/teste/validar-loja', dadosRAInvalida);
  if (!resultado.dados.sucesso) {
    log('sucesso', 'Erro capturado corretamente:');
    log('resposta', resultado.dados.erros[0]);
  } else {
    log('erro', 'Deveria ter falhado com RA inválida');
  }

  // TESTE 7: Email inválido
  log('teste', 'Validar EMAIL INVÁLIDO (sem @)');
  const dadosEmailInvalido = {
    ...dadosValidos,
    vendedor: {
      ...dadosValidos.vendedor,
      email: 'email-sem-arroba'
    }
  };
  resultado = await fazer('POST', '/teste/validar-loja', dadosEmailInvalido);
  if (!resultado.dados.sucesso) {
    log('sucesso', 'Erro capturado corretamente:');
    log('resposta', resultado.dados.erros[0]);
  } else {
    log('erro', 'Deveria ter falhado com email inválido');
  }

  // TESTE 8: Telefone inválido
  log('teste', 'Validar TELEFONE INVÁLIDO (sem formatação)');
  const dadosTelefoneInvalido = {
    ...dadosValidos,
    vendedor: {
      ...dadosValidos.vendedor,
      telefone: '61987654321'
    }
  };
  resultado = await fazer('POST', '/teste/validar-loja', dadosTelefoneInvalido);
  if (!resultado.dados.sucesso) {
    log('sucesso', 'Erro capturado corretamente:');
    log('resposta', resultado.dados.erros[0]);
  } else {
    log('erro', 'Deveria ter falhado com telefone inválido');
  }

  // TESTE 9: CPF inválido
  log('teste', 'Validar CPF INVÁLIDO (sem pontuação)');
  const dadosCPFInvalido = {
    ...dadosValidos,
    vendedor: {
      ...dadosValidos.vendedor,
      cpf: '12345678900'
    }
  };
  resultado = await fazer('POST', '/teste/validar-loja', dadosCPFInvalido);
  if (!resultado.dados.sucesso) {
    log('sucesso', 'Erro capturado corretamente:');
    log('resposta', resultado.dados.erros[0]);
  } else {
    log('erro', 'Deveria ter falhado com CPF inválido');
  }

  // TESTE 10: CEP inválido
  log('teste', 'Validar CEP INVÁLIDO');
  const dadosCEPInvalido = {
    ...dadosValidos,
    endereco: {
      ...dadosValidos.endereco,
      cep: '12345'
    }
  };
  resultado = await fazer('POST', '/teste/validar-loja', dadosCEPInvalido);
  if (!resultado.dados.sucesso) {
    log('sucesso', 'Erro capturado corretamente:');
    log('resposta', resultado.dados.erros[0]);
  } else {
    log('erro', 'Deveria ter falhado com CEP inválido');
  }

  // TESTE 11: Cadastrar loja de teste
  log('teste', 'Cadastrar LOJA DE TESTE (com dados pré-preenchidos)');
  const timestamp = Date.now();
  const cpfUnico = `${111 + Math.floor(Math.random() * 888)}.${222 + Math.floor(Math.random() * 777)}.${333 + Math.floor(Math.random() * 666)}-${String(timestamp).slice(-2)}`;
  
  resultado = await fazer('POST', '/teste/loja', {
    ra: 'Asa Sul',
    vendedor: {
      cpf: cpfUnico
    }
  });

  if (resultado.ok && resultado.dados.sucesso) {
    log('sucesso', 'Loja cadastrada com sucesso!');
    log('resposta', `ID da loja: ${resultado.dados.loja._id}`);
    log('resposta', `Nome: ${resultado.dados.loja.nome}`);
    log('resposta', `RA: ${resultado.dados.loja.ra}`);
  } else {
    log('erro', `Falha ao cadastrar loja: ${resultado.dados.mensagem}`);
  }

  // TESTE 12: Cadastrar loja com RA específica
  log('teste', 'Cadastrar loja com RA=Ceilândia');
  const cpfUnico2 = `${111 + Math.floor(Math.random() * 888)}.${222 + Math.floor(Math.random() * 777)}.${333 + Math.floor(Math.random() * 666)}-${String(timestamp + 1).slice(-2)}`;
  
  resultado = await fazer('POST', '/teste/loja', {
    ra: 'Ceilândia',
    categoria: 'Alimentação',
    vendedor: {
      cpf: cpfUnico2
    }
  });

  if (resultado.ok && resultado.dados.sucesso) {
    log('sucesso', 'Loja em Ceilândia cadastrada!');
    log('resposta', `RA: ${resultado.dados.loja.ra}`);
  } else {
    log('erro', `Falha ao cadastrar loja em Ceilândia`);
  }

  // TESTE 13: Listar lojas cadastradas
  log('teste', 'Listar todas as lojas cadastradas');
  resultado = await fazer('GET', '/lojas');
  if (resultado.ok) {
    log('sucesso', `${resultado.dados.total} loja(s) cadastrada(s)`);
  } else {
    log('erro', 'Falha ao listar lojas');
  }

  log('titulo', '✅ TESTES CONCLUÍDOS!');
  log('info', 'Próximos passos:');
  log('info', '1. Verifique o arquivo RESUMO_ATUALIZACOES.md para documentação');
  log('info', '2. Verifique o arquivo TESTE_VALIDACOES.md para mais exemplos');
  log('info', '3. Use Postman para testar interativamente');
}

// 🚀 Executar testes
if (typeof fetch === 'undefined') {
  console.error('❌ Este script requer Node.js 18+ (com fetch nativo) ou node-fetch');
  console.error('💡 Dica: Use "node teste-validacoes-nodejs.js" com Node.js 18+');
  process.exit(1);
}

log('info', 'Iniciando testes...');
log('info', `Conectando em: ${API_URL}`);

executarTestes().catch(erro => {
  log('erro', `Erro ao executar testes: ${erro.message}`);
  process.exit(1);
});
