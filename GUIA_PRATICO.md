# 🎯 GUIA PRÁTICO - Mercado Interno de Brasília

## 📌 Como Começar (Passo a Passo)

### Passo 1: Preparar o Ambiente
```bash
# Abra o terminal na pasta do projeto
cd "mercado interno.js"

# Instale todas as dependências
npm install

# Inicie o MongoDB (certifique-se que está rodando)
# Se usar MongoDB local:
mongod

# Se usar MongoDB Atlas (cloud):
# - Crie uma conta em https://www.mongodb.com/cloud/atlas
# - Copie a connection string
# - Cole em .env na variável MONGO_URI
```

### Passo 2: Iniciar o Servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Ou produção
npm start

# Você deve ver:
# ✅ Conectado ao MongoDB
# 🚀 Servidor rodando em http://localhost:3000
```

### Passo 3: Testar a API
Abra seu navegador ou Postman e teste:
```
http://localhost:3000
```

---

## 💡 Casos de Uso Práticos

### 📍 Caso 1: Você é um Vendedor de Asa Sul
Você quer cadastrar sua loja de eletrônicos em Asa Sul:

**Envie para:** `POST http://localhost:3000/api/lojas`
```json
{
  "nome": "Eletrônicos Silva",
  "ra": "Asa Sul",
  "categoria": "Tecnologia",
  "setor": "Comercial",
  "vendedor": {
    "nome": "Carlos Silva",
    "email": "carlos@eletrosilva.com.br",
    "telefone": "(61) 98765-4321",
    "cpf": "11122233344"
  },
  "endereco": {
    "rua": "SQS 302",
    "numero": "45",
    "complemento": "Loja 3",
    "cep": "70232-000",
    "latitude": -15.7942,
    "longitude": -47.8822
  }
}
```

**Resposta (guarde o ID):**
```json
{
  "sucesso": true,
  "mensagem": "Loja cadastrada com sucesso!",
  "loja": {
    "_id": "60d5ec49f1b2c72d8c8e4a1b",
    "nome": "Eletrônicos Silva",
    ...
  }
}
```

---

### 📦 Caso 2: Cadastrar Produtos na Sua Loja
Agora você quer adicionar alguns produtos:

**Envie para:** `POST http://localhost:3000/api/produtos`
```json
{
  "nome": "Monitor LG 24 polegadas",
  "preco": 799.90,
  "descricao": "Monitor Full HD com entrada HDMI",
  "categoria": "Monitores",
  "lojaId": "60d5ec49f1b2c72d8c8e4a1b",
  "estoque": 15,
  "imagem": "https://exemplo.com/monitor.jpg"
}
```

**Adicione mais produtos:**
```json
{
  "nome": "Teclado Mecânico RGB",
  "preco": 350.00,
  "descricao": "Teclado gamer com switch mecânico",
  "categoria": "Periféricos",
  "lojaId": "60d5ec49f1b2c72d8c8e4a1b",
  "estoque": 30
}
```

---

### 🔍 Caso 3: Cliente quer ver Lojas de Taguatinga
Cliente quer conhecer as lojas em Taguatinga:

**Acesse:** `GET http://localhost:3000/api/lojas/ra/Taguatinga`

**Resposta:**
```json
{
  "sucesso": true,
  "ra": "Taguatinga",
  "total": 3,
  "lojas": [
    {
      "_id": "...",
      "nome": "Loja A",
      "categoria": "Alimentação",
      "vendedor": { "nome": "João", "telefone": "..." }
    },
    ...
  ]
}
```

---

### 🛍️ Caso 4: Ver Produtos Disponíveis em Asa Sul
Cliente quer ver todos os produtos disponíveis em Asa Sul:

**Acesse:** `GET http://localhost:3000/api/produtos/ra/Asa%20Sul`

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "45 produtos encontrados em Asa Sul",
  "ra": "Asa Sul",
  "produtos": [
    {
      "_id": "...",
      "nome": "Monitor LG 24 polegadas",
      "preco": 799.90,
      "estoque": 15,
      "loja": {
        "nome": "Eletrônicos Silva"
      }
    },
    ...
  ]
}
```

---

## 🛠️ Usando com Postman

1. **Baixe o Postman:** https://www.postman.com/downloads/
2. **Crie uma nova collection** chamada "Mercado Interno"
3. **Adicione requests:**

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `http://localhost:3000/api/lojas` | Listar todas as lojas |
| GET | `http://localhost:3000/api/lojas/ra/Asa%20Sul` | Lojas de Asa Sul |
| POST | `http://localhost:3000/api/lojas` | Cadastrar loja |
| POST | `http://localhost:3000/api/produtos` | Cadastrar produto |
| GET | `http://localhost:3000/api/produtos/ra/Asa%20Sul` | Produtos de Asa Sul |
| GET | `http://localhost:3000/api/loja/{id}/produtos` | Produtos de uma loja |

---

## 🚀 Próximos Passos Avançados

### 1️⃣ Adicionar Mapa de Brasília
```bash
npm install leaflet leaflet-react
```

### 2️⃣ Calcular Frete por Quilometragem
Adicione em `utils/freteUtils.js`:
```javascript
const FRETE_POR_KM = 2.50; // R$ 2,50 por km

function calcularFrete(km) {
  return km * FRETE_POR_KM;
}
```

### 3️⃣ Sistema de Autenticação
```bash
npm install jsonwebtoken bcryptjs
```

### 4️⃣ Criar Frontend em React/Vue
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios
```

---

## 📝 Dúvidas Frequentes

**P: Como mudo a porta do servidor?**  
R: Edite `.env` e altere `PORT=3000` para `PORT=5000` (exemplo)

**P: MongoDB não conecta. O que fazer?**  
R: Verifique se:
- MongoDB está instalado: `mongod --version`
- MongoDB está rodando: `mongod`
- A URL está correta em `.env`

**P: Como adicionar mais RAs?**  
R: Abra `models/Loja.js` e adicione na lista `enum` de RAs

**P: Como fazer deploy?**  
R: Use Heroku, Railway ou Vercel com MongoDB Atlas

---

## 📞 Contatos Úteis

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Postman:** https://www.postman.com
- **Node.js:** https://nodejs.org
- **Express Docs:** https://expressjs.com

---

**Bom proveito com o seu Marketplace Brasiliense! 🏛️✨**
