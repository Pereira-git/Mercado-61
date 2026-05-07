const mongoose = require('mongoose');

// Schema do Produto
const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  descricao: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    default: 'Geral'
  },
  loja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja',
    required: true
  },
  estoque: {
    type: Number,
    default: 0
  },
  freteGratis: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Produto', produtoSchema);
