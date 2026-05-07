const mongoose = require('mongoose');

// 📍 Lista oficial das 33 Regiões Administrativas de Brasília
const REGIOES_ADMINISTRATIVAS = [
  'Plano Piloto',
  'Asa Sul',
  'Asa Norte',
  'Lago Sul',
  'Lago Norte',
  'Taguatinga',
  'Brazlândia',
  'Sobradinho',
  'Planaltina',
  'Paranoá',
  'Núcleo Bandeirante',
  'Ceilândia',
  'Guará',
  'Cruzeiro',
  'Samambaia',
  'Santa Maria',
  'São Sebastião',
  'Recanto das Emas',
  'Riacho Fundo',
  'Riacho Fundo II',
  'Sudoeste/Octogonal',
  'Varjão',
  'Park Way',
  'SCIA (Estrutural)',
  'Sobradinho II',
  'Jardim Botânico',
  'Itapoã',
  'SIA',
  'Vincúlus',
  'Fercal',
  'Arapoanga',
  'Águas Claras',
  'Arniqueira'
];

// Schema da Loja
const lojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da loja é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  slogan: {
    type: String,
    trim: true,
    maxlength: [150, 'Slogan não pode exceder 150 caracteres'],
    default: ''
  },
  ra: {
    type: String,
    required: [true, 'Região Administrativa (RA) é obrigatória'],
    enum: {
      values: REGIOES_ADMINISTRATIVAS,
      message: `RA inválida. Escolha uma das 33 RAs de Brasília: ${REGIOES_ADMINISTRATIVAS.join(', ')}`
    }
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: {
      values: ['Comercial', 'Hoteleiro', 'Alimentação', 'Vestuário', 'Serviços', 'Saúde', 'Tecnologia', 'Outros'],
      message: 'Categoria inválida. Escolha entre: Comercial, Hoteleiro, Alimentação, Vestuário, Serviços, Saúde, Tecnologia ou Outros'
    }
  },
  setor: {
    type: String,
    enum: {
      values: ['Comercial', 'Hoteleiro', 'Residencial', 'Misto'],
      message: 'Setor inválido. Escolha entre: Comercial, Hoteleiro, Residencial ou Misto'
    },
    default: 'Comercial'
  },
  vendedor: {
    nome: {
      type: String,
      required: [true, 'Nome do vendedor é obrigatório'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email do vendedor é obrigatório'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    telefone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      match: [/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Telefone deve estar no formato: (61) 98765-4321']
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp é obrigatório'],
      trim: true,
      match: [/^\+?[0-9\s\(\)-]{10,20}$/, 'WhatsApp inválido. Use o formato brasileiro, por exemplo: (61) 98765-4321 ou +5561987654321']
    },
    cpf: {
      type: String,
      required: [true, 'CPF é obrigatório'],
      match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato: 123.456.789-00'],
      unique: [true, 'Este CPF já está registrado'],
      sparse: true
    }
  },
  endereco: {
    rua: {
      type: String,
      required: [true, 'Rua é obrigatória'],
      trim: true
    },
    numero: {
      type: String,
      required: [true, 'Número é obrigatório']
    },
    complemento: String,
    localizacao: {
      type: String,
      required: [true, 'Endereço/Localização é obrigatório'],
      trim: true,
      minlength: [5, 'Endereço/Localização deve ter pelo menos 5 caracteres']
    },
    cep: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      match: [/^\d{5}-?\d{3}$/, 'CEP deve estar no formato: 70000-000']
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude é obrigatória para geolocalização']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude é obrigatória para geolocalização']
    }
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

// 🔄 Middleware: Atualizar data de modificação antes de salvar
lojaSchema.pre('save', function(next) {
  this.atualizadoEm = Date.now();
  next();
});

// 🔄 Middleware: Atualizar data de modificação em atualizações
lojaSchema.pre('findByIdAndUpdate', function(next) {
  this.set({ atualizadoEm: Date.now() });
  next();
});

// 📍 Método estático: Retornar lista de RAs válidas
lojaSchema.statics.obterRAsValidas = function() {
  return REGIOES_ADMINISTRATIVAS;
};

// 🔍 Método estático: Validar se RA é válida
lojaSchema.statics.validarRA = function(ra) {
  return REGIOES_ADMINISTRATIVAS.includes(ra);
};

// 📊 Método para retornar dados públicos da loja (sem dados sensíveis)
lojaSchema.methods.obterDadosPublicos = function() {
  return {
    _id: this._id,
    nome: this.nome,
    slogan: this.slogan,
    ra: this.ra,
    categoria: this.categoria,
    setor: this.setor,
    vendedor: {
      nome: this.vendedor.nome,
      telefone: this.vendedor.telefone,
      whatsapp: this.vendedor.whatsapp
    },
    endereco: {
      rua: this.endereco.rua,
      numero: this.endereco.numero,
      complemento: this.endereco.complemento,
      latitude: this.endereco.latitude,
      longitude: this.endereco.longitude
    },
    ativo: this.ativo,
    criadoEm: this.criadoEm
  };
};

module.exports = mongoose.model('Loja', lojaSchema);
