# 🧪 GUIA DE TESTES - Sistema de Validação de RAs

## 🚀 Como Testar as Validações

### 1️⃣ Obter Lista de Dados de Teste Pré-preenchidos

**Sem especificar RA (padrão: Asa Sul)**
```bash
curl http://localhost:3000/api/teste/dados-loja
```

**Com RA específica (Taguatinga)**
```bash
curl "http://localhost:3000/api/teste/dados-loja?ra=Taguatinga"
```

**Resposta:**
```json
{
  "mensagem": "Dados de teste pré-preenchidos",
  "dados": {
    "nome": "Loja Teste Brasília",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João da Silva",
      "email": "joao.teste@email.com",
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
  }
}
```

---

### 2️⃣ Validar Dados SEM Salvar no Banco

Teste se os dados são válidos antes de enviar para cadastro:

```bash
curl -X POST http://localhost:3000/api/teste/validar-loja \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja Teste",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "setor": "Comercial",
    "vendedor": {
      "nome": "João Silva",
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
```

**Resposta (Válido):**
```json
{
  "sucesso": true,
  "mensagem": "✅ Todos os dados são válidos!",
  "dados": { ... }
}
```

---

### 3️⃣ Cadastrar Loja de Teste (Com Dados Pré-preenchidos)

**Teste básico (com padrão Asa Sul):**
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Teste com RA específica:**
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "ra": "Taguatinga"
  }'
```

**Teste sobrescrevendo alguns campos:**
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "ra": "Ceilândia",
    "categoria": "Alimentação",
    "vendedor": {
      "nome": "Maria Santos",
      "email": "maria@email.com",
      "telefone": "(61) 99999-8888",
      "cpf": "987.654.321-00"
    }
  }'
```

**Resposta (Sucesso):**
```json
{
  "sucesso": true,
  "mensagem": "✅ Loja de teste cadastrada com sucesso!",
  "loja": {
    "_id": "60d5ec49f1b2c72d8c8e4a1b",
    "nome": "Loja Teste Brasília",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João da Silva",
      "telefone": "(61) 98765-4321"
    }
  }
}
```

---

## ❌ Testes de Erro (Validações)

### Erro 1: RA Inválida
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "ra": "Brasília Fake"
  }'
```

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação dos dados",
  "erros": [
    "RA inválida. Escolha uma das 33 RAs de Brasília"
  ]
}
```

---

### Erro 2: Email Inválido
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "vendedor": {
      "email": "email-sem-arroba"
    }
  }'
```

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação dos dados",
  "erros": [
    "Email inválido"
  ]
}
```

---

### Erro 3: Telefone em Formato Errado
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "vendedor": {
      "telefone": "61987654321"
    }
  }'
```

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação dos dados",
  "erros": [
    "Telefone deve estar no formato: (61) 98765-4321"
  ]
}
```

---

### Erro 4: CPF Inválido
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "vendedor": {
      "cpf": "12345678900"
    }
  }'
```

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação dos dados",
  "erros": [
    "CPF deve estar no formato: 123.456.789-00"
  ]
}
```

---

### Erro 5: CPF Duplicado
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "vendedor": {
      "cpf": "123.456.789-00"
    }
  }'
```

Se este CPF já foi registrado:

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Este CPF já está registrado no sistema"
}
```

---

### Erro 6: CEP Inválido
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "endereco": {
      "cep": "12345"
    }
  }'
```

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação dos dados",
  "erros": [
    "CEP deve estar no formato: 70000-000"
  ]
}
```

---

### Erro 7: Coordenadas Inválidas
```bash
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{
    "endereco": {
      "latitude": 200,
      "longitude": 500
    }
  }'
```

**Resposta:**
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação dos dados",
  "erros": [
    "Coordenadas de geolocalização inválidas"
  ]
}
```

---

## 📍 Rotas de Regiões

### Listar Todas as RAs
```bash
curl http://localhost:3000/api/regioes
```

**Resposta:**
```json
{
  "total": 33,
  "ras": [
    "Plano Piloto",
    "Asa Sul",
    "Asa Norte",
    ...
  ],
  "coordenadas": {
    "Asa Sul": { "latitude": -15.8267, "longitude": -47.8761 },
    ...
  }
}
```

---

### Buscar RAs por Termo
```bash
curl http://localhost:3000/api/regioes/buscar/asa
curl http://localhost:3000/api/regioes/buscar/lago
curl http://localhost:3000/api/regioes/buscar/taguatinga
```

**Resposta:**
```json
{
  "termo": "asa",
  "encontrados": 2,
  "resultados": ["Asa Sul", "Asa Norte"]
}
```

---

### Obter Coordenadas de uma RA
```bash
curl http://localhost:3000/api/regioes/Asa%20Sul/coordenadas
curl http://localhost:3000/api/regioes/Taguatinga/coordenadas
```

**Resposta:**
```json
{
  "ra": "Asa Sul",
  "coordenadas": {
    "latitude": -15.8267,
    "longitude": -47.8761
  }
}
```

---

## 🧪 Script de Teste Completo (bash/sh)

```bash
#!/bin/bash

echo "🧪 TESTE 1: Obter dados de teste"
curl http://localhost:3000/api/teste/dados-loja?ra=Taguatinga

echo -e "\n\n🧪 TESTE 2: Validar dados (SEM salvar)"
curl -X POST http://localhost:3000/api/teste/validar-loja \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Loja",
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

echo -e "\n\n🧪 TESTE 3: Cadastrar loja de teste"
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{"ra": "Ceilândia"}'

echo -e "\n\n🧪 TESTE 4: Testar erro de RA inválida"
curl -X POST http://localhost:3000/api/teste/loja \
  -H "Content-Type: application/json" \
  -d '{"ra": "Brasília Fake"}'

echo -e "\n\n✅ Testes concluídos!"
```

Salve este script como `teste.sh` e execute com `bash teste.sh`.

---

## 📝 Checklist de Validação

- [ ] RA válida (uma das 33)
- [ ] Nome da loja (mín 3 caracteres)
- [ ] Categoria válida
- [ ] Vendedor nome (mín 3 caracteres)
- [ ] Vendedor email (formato válido)
- [ ] Vendedor telefone (formato: (61) XXXXX-XXXX)
- [ ] Vendedor CPF (formato: 123.456.789-00, único)
- [ ] Endereço rua (preenchido)
- [ ] Endereço número (preenchido)
- [ ] Endereço CEP (formato: 70000-000)
- [ ] Endereço latitude (entre -90 e 90)
- [ ] Endereço longitude (entre -180 e 180)

---

**🎯 Status: Pronto para testes!**
