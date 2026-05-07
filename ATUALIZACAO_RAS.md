# 📍 Documentação: Atualização do Sistema de RAs

## ✅ Mudanças Realizadas

### 1. **33 Regiões Administrativas Completas**
O campo `ra` agora contém TODAS as 33 Regiões Administrativas oficiais de Brasília:

```javascript
[
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
]
```

### 2. **Validações Obrigatórias Aprimoradas**

#### Nome da Loja
- ✅ Obrigatório
- ✅ Mínimo de 3 caracteres
- ✅ Máximo de 100 caracteres

#### Região Administrativa (RA)
- ✅ Obrigatório
- ✅ Deve ser uma das 33 RAs válidas
- ✅ Mensagem de erro customizada se inválida

#### Categoria
- ✅ Obrigatório
- ✅ Deve ser uma de: Comercial, Hoteleiro, Alimentação, Vestuário, Serviços, Saúde, Tecnologia, Outros

#### Vendedor
- ✅ Nome: Obrigatório e com trim
- ✅ Email: Obrigatório, validado e convertido para minúsculas
- ✅ Telefone: Obrigatório, validado no formato (61) 98765-4321
- ✅ CPF: Obrigatório, validado, unique e no formato 123.456.789-00

#### Endereço
- ✅ Rua: Obrigatória
- ✅ Número: Obrigatório
- ✅ CEP: Obrigatório e validado (70000-000)
- ✅ Latitude: Obrigatória
- ✅ Longitude: Obrigatória

### 3. **Novos Arquivos Criados**

#### `config/regioes.js`
Arquivo centralizado com:
- Lista de 33 RAs
- Coordenadas aproximadas de cada RA
- Métodos utilitários (validarRA, buscarRAs, etc.)

#### `utils/validadores.js`
Funções reutilizáveis de validação:
- `validarCPF(cpf)`
- `validarTelefone(telefone)`
- `validarEmail(email)`
- `validarCEP(cep)`
- `validarRA(ra)`
- `validarCoordenadas(lat, lon)`
- `validarDadosLoja(dados)` - Validação completa

### 4. **Novos Métodos no Schema**

#### Métodos Estáticos
```javascript
// Obter lista de RAs válidas
Loja.obterRAsValidas()

// Validar se uma RA é válida
Loja.validarRA('Asa Sul') // true
```

#### Métodos de Instância
```javascript
// Obter dados públicos (sem dados sensíveis)
const loja = await Loja.findById(id);
const dadosPublicos = loja.obterDadosPublicos();
```

### 5. **Middlewares Adicionados**

```javascript
// Atualiza automaticamente atualizadoEm ao salvar
lojaSchema.pre('save', function(next) { ... })

// Atualiza automaticamente atualizadoEm em findByIdAndUpdate
lojaSchema.pre('findByIdAndUpdate', function(next) { ... })
```

---

## 📝 Exemplos de Uso

### Cadastro Correto
```json
POST /api/lojas

{
  "nome": "Loja do João",
  "ra": "Asa Sul",
  "categoria": "Comercial",
  "setor": "Comercial",
  "vendedor": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(61) 98765-4321",
    "cpf": "123.456.789-00"
  },
  "endereco": {
    "rua": "SQS 302",
    "numero": "125",
    "complemento": "Bloco A, Loja 5",
    "cep": "70232-000",
    "latitude": -15.7942,
    "longitude": -47.8822
  }
}
```

### Erros de Validação

#### RA Inválida
```json
{
  "erro": "RA inválida. Escolha uma das 33 RAs de Brasília"
}
```

#### Email Inválido
```json
{
  "erro": "Email inválido"
}
```

#### Telefone Inválido
```json
{
  "erro": "Telefone deve estar no formato: (61) 98765-4321"
}
```

#### CPF Inválido
```json
{
  "erro": "CPF deve estar no formato: 123.456.789-00"
}
```

---

## 🔧 Como Usar no Frontend

### Com JavaScript/Fetch
```javascript
const validadores = require('./utils/validadores');

// Validar antes de enviar
const dados = {
  nome: 'Minha Loja',
  ra: 'Taguatinga',
  categoria: 'Alimentação',
  vendedor: { /* ... */ },
  endereco: { /* ... */ }
};

const { valido, erros } = validadores.validarDadosLoja(dados);

if (!valido) {
  console.error('Erros de validação:', erros);
} else {
  // Enviar para API
  fetch('/api/lojas', { method: 'POST', body: JSON.stringify(dados) })
}
```

### Buscar RAs por Termo
```javascript
const regioes = require('./config/regioes');

const resultados = regioes.buscarRAs('asa'); 
// Retorna: ['Asa Sul', 'Asa Norte']
```

### Obter Coordenadas de uma RA
```javascript
const regioes = require('./config/regioes');

const coords = regioes.obterCoordenadas('Taguatinga');
// Retorna: { latitude: -15.7975, longitude: -48.0397 }
```

---

## 🚀 Próximas Melhorias

- [ ] Integração com Geocoding API para validar coordenadas reais
- [ ] Geração automática de coordenadas a partir do endereço
- [ ] Sistema de distância entre RAs para cálculo de frete
- [ ] Cache de RAs no frontend para offline mode
- [ ] Dropdown de RAs no formulário com autocomplete

---

## 📞 Dúvidas?

Para implementar as validações nas rotas, use:
```javascript
const validadores = require('../utils/validadores');

// Antes de criar a loja
const { valido, erros } = validadores.validarDadosLoja(req.body);
if (!valido) {
  return res.status(400).json({ erros });
}
```
