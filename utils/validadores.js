/**
 * 🔐 Validadores customizados para o Mercado Interno
 * Funções de validação reutilizáveis para lojas e produtos
 */

const { REGIOES_ADMINISTRATIVAS } = require('../config/regioes');

/**
 * ✅ Validar CPF (formato básico)
 * @param {string} cpf - CPF no formato 123.456.789-00
 * @returns {boolean}
 */
function validarCPF(cpf) {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
}

/**
 * ✅ Validar telefone (formato brasileiro)
 * @param {string} telefone - Telefone no formato (61) 98765-4321
 * @returns {boolean}
 */
function validarTelefone(telefone) {
  const regex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
  return regex.test(telefone);
}

/**
 * ✅ Validar WhatsApp
 * @param {string} whatsapp
 * @returns {boolean}
 */
function validarWhatsApp(whatsapp) {
  if (!whatsapp || typeof whatsapp !== 'string') {
    return false;
  }
  const numeros = whatsapp.replace(/\D/g, '');
  return numeros.length >= 10 && numeros.length <= 13;
}

/**
 * ✅ Validar email
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
}

/**
 * ✅ Validar CEP (formato brasileiro)
 * @param {string} cep - CEP no formato 70000-000 ou 70000000
 * @returns {boolean}
 */
function validarCEP(cep) {
  const regex = /^\d{5}-?\d{3}$/;
  return regex.test(cep);
}

/**
 * ✅ Validar RA (Região Administrativa)
 * @param {string} ra
 * @returns {boolean}
 */
function validarRA(ra) {
  return REGIOES_ADMINISTRATIVAS.includes(ra);
}

/**
 * ✅ Validar coordenadas de geolocalização
 * @param {number} latitude - Entre -90 e 90
 * @param {number} longitude - Entre -180 e 180
 * @returns {boolean}
 */
function validarCoordenadas(latitude, longitude) {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * ✅ Validar dados básicos de uma loja
 * @param {object} dados - Dados da loja
 * @returns {object} - { valido: boolean, erros: array }
 */
function validarDadosLoja(dados) {
  const erros = [];

  // Validar nome
  if (!dados.nome || dados.nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres');
  }

  // Validar RA
  if (!dados.ra || !validarRA(dados.ra)) {
    erros.push(`RA inválida. Escolha uma das 33 RAs de Brasília`);
  }

  // Validar categoria
  const categoriasValidas = ['Comercial', 'Hoteleiro', 'Alimentação', 'Vestuário', 'Serviços', 'Saúde', 'Tecnologia', 'Outros'];
  if (!dados.categoria || !categoriasValidas.includes(dados.categoria)) {
    erros.push('Categoria inválida');
  }

  // Validar vendedor
  if (!dados.vendedor) {
    erros.push('Dados do vendedor são obrigatórios');
  } else {
    if (!dados.vendedor.nome || dados.vendedor.nome.trim().length < 3) {
      erros.push('Nome do vendedor inválido');
    }
    if (!validarEmail(dados.vendedor.email)) {
      erros.push('Email do vendedor inválido');
    }
    if (!validarTelefone(dados.vendedor.telefone)) {
      erros.push('Telefone do vendedor inválido. Use formato: (61) 98765-4321');
    }
    if (!validarWhatsApp(dados.vendedor.whatsapp)) {
      erros.push('WhatsApp do vendedor inválido. Use um número válido com DDD, por exemplo: (61) 98765-4321 ou +5561987654321');
    }
    if (!validarCPF(dados.vendedor.cpf)) {
      erros.push('CPF do vendedor inválido. Use formato: 123.456.789-00');
    }
  }

  // Validar endereço
  if (!dados.endereco) {
    erros.push('Dados do endereço são obrigatórios');
  } else {
    if (!dados.endereco.rua || dados.endereco.rua.trim().length < 3) {
      erros.push('Rua deve ter pelo menos 3 caracteres');
    }
    if (!dados.endereco.numero) {
      erros.push('Número é obrigatório');
    }
    if (!dados.endereco.localizacao || dados.endereco.localizacao.trim().length < 5) {
      erros.push('Endereço/Localização inválido. Preencha o campo corretamente.');
    }
    if (!validarCEP(dados.endereco.cep)) {
      erros.push('CEP inválido. Use formato: 70000-000');
    }
    if (!validarCoordenadas(dados.endereco.latitude, dados.endereco.longitude)) {
      erros.push('Coordenadas de geolocalização inválidas');
    }
  }

  return {
    valido: erros.length === 0,
    erros: erros
  };
}

module.exports = {
  validarCPF,
  validarTelefone,
  validarWhatsApp,
  validarEmail,
  validarCEP,
  validarRA,
  validarCoordenadas,
  validarDadosLoja
};
