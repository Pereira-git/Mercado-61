# 🏪 Mercado Interno de Brasília

Marketplace de vendedores de Brasília com suporte a múltiplas Regiões Administrativas (RAs), setores e categorias.

## 🎯 Funcionalidades

✅ Cadastro de lojas por Região Administrativa (RA)  
✅ Cadastro de produtos com nome, preço e descrição  
✅ Filtro de produtos por RA específica  
✅ Categorização por setor (Comercial, Hoteleiro, etc.)  
✅ Gestão de estoque  
✅ Logística integrada (preparado para quilometragem no DF)  

## 📋 Regiões Administrativas Suportadas

Asa Sul, Asa Norte, Taguatinga, Ceilândia, Brazlândia, Sobradinho, Planaltina, Paranoá, Núcleo Bandeirante, Riacho Fundo, Guará, Cruzeiro, Samambaia, Santa Maria, São Sebastião, Recanto das Emas, Lago Sul, Lago Norte, Fraco, Lago, Candangolândia

## 🚀 Instalação

1. **Clone/Abra o projeto**
```bash
cd "mercado 61.js"
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

4. **Inicie o MongoDB**
```bash
# Windows (se tiver instalado localmente)
mongod

# Ou use MongoDB Atlas (cloud)
# Configure a URL em .env
```

5. **Inicie o servidor**
```bash
npm start

# Ou para desenvolvimento com nodemon
npm run dev
```

## 📡 API Endpoints

### 🏪 LOJAS

**Cadastrar nova loja**
```
POST /api/lojas
Content-Type: application/json

{
  "nome": "Loja do João",
  "ra": "Asa Sul",
  "categoria": "Comercial",
  "setor": "Comercial",
  "vendedor": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(61) 98765-4321",
    "cpf": "12345678900"
  },
  "endereco": {
    "rua": "SQS 302",
    "numero": "12",
    "complemento": "Loja 5",
    "cep": "70232-000",
    "latitude": -15.7942,
    "longitude": -47.8822
  }
}
```

**Listar todas as lojas**
```
GET /api/lojas
```

**Listar lojas de uma RA específica**
```
GET /api/lojas/ra/Asa%20Sul
```

### 📦 PRODUTOS

**Cadastrar novo produto**
```
POST /api/produtos
Content-Type: application/json

{
  "nome": "Camiseta Brasília",
  "preco": 49.90,
  "descricao": "Camiseta estampada com tema de Brasília",
  "categoria": "Vestuário",
  "lojaId": "ID_DA_LOJA",
  "estoque": 50,
  "imagem": "https://exemplo.com/camiseta.jpg"
}
```

**Listar produtos de uma RA**
```
GET /api/produtos/ra/Asa%20Sul
```

**Listar produtos de uma loja específica**
```
GET /api/loja/ID_DA_LOJA/produtos
```

**Deletar um produto**
```
DELETE /api/produtos/ID_DO_PRODUTO
```

## 💾 Estrutura do Banco de Dados

### Loja
```javascript
{
  _id: ObjectId,
  nome: String,
  ra: String,
  categoria: String,
  setor: String,
  vendedor: {
    nome: String,
    email: String,
    telefone: String,
    cpf: String
  },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    cep: String,
    latitude: Number,
    longitude: Number
  },
  ativo: Boolean,
  criadoEm: Date,
  atualizadoEm: Date
}
```

### Produto
```javascript
{
  _id: ObjectId,
  nome: String,
  preco: Number,
  descricao: String,
  categoria: String,
  loja: ObjectId (referência),
  estoque: Number,
  imagem: String,
  ativo: Boolean,
  criadoEm: Date,
  atualizadoEm: Date
}
```

## 🗂️ Estrutura do Projeto

```
mercado interno.js/
├── server.js              # Arquivo principal
├── package.json           # Dependências
├── .env.example           # Variáveis de ambiente (exemplo)
├── models/
│   ├── Loja.js           # Schema da Loja
│   └── Produto.js        # Schema do Produto
├── routes/
│   └── api.js            # Rotas da API
└── utils/
    └── produtoUtils.js   # Funções utilitárias
```

## 🔧 Próximos Passos

- [ ] Integração com mapa (Leaflet.js)
- [ ] Sistema de logística com cálculo de frete por quilometragem
- [ ] Autenticação de vendedores
- [ ] Sistema de avaliações
- [ ] Dashboard para vendedores
- [ ] Interface do cliente (frontend)

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no projeto.

---

**Desenvolvido com ❤️ para Brasília** 🏛️
