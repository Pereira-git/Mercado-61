require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ⚙️ Middleware
app.use(express.json());
app.use(cors());

// 📁 Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// 🔗 Conexão com MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERRO: Link do MongoDB não encontrado no .env');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('🚀 Mercado 61 Conectado com Sucesso!'))
    .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));
}

// 📍 Rotas externas — toda a lógica fica em routes/api.js
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 🏠 Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ❌ Middleware 404 — deve ser o último
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ erro: 'Rota da API não encontrada' });
  } else {
    res.status(404).sendFile(path.join(__dirname, '404.html'), (err) => {
      if (err) {
        res.status(404).send('<h1>404 - Página não encontrada</h1><a href="/">Voltar</a>');
      }
    });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 Mercado 61 ativado!\n`);
});

module.exports = app;
