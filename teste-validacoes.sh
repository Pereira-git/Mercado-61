#!/bin/bash

# 🧪 SCRIPT DE TESTES RÁPIDOS
# Execute este script para testar o sistema de validação

echo "======================================"
echo "🧪 MERCADO INTERNO - TESTES RÁPIDOS"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API="http://localhost:3000/api"

echo -e "${BLUE}ℹ️  Certifique-se de que o servidor está rodando em http://localhost:3000${NC}"
echo ""

# TESTE 1: Listar RAs
echo -e "${YELLOW}[TESTE 1] Listar todas as 33 RAs${NC}"
echo "GET $API/regioes"
curl -s $API/regioes | jq '.' 
echo ""

# TESTE 2: Buscar RAs por termo
echo -e "${YELLOW}[TESTE 2] Buscar RAs por termo (asa)${NC}"
echo "GET $API/regioes/buscar/asa"
curl -s "$API/regioes/buscar/asa" | jq '.'
echo ""

# TESTE 3: Obter dados de teste
echo -e "${YELLOW}[TESTE 3] Obter dados de teste pré-preenchidos${NC}"
echo "GET $API/teste/dados-loja?ra=Taguatinga"
curl -s "$API/teste/dados-loja?ra=Taguatinga" | jq '.'
echo ""

# TESTE 4: Validar dados válidos
echo -e "${YELLOW}[TESTE 4] Validar dados VÁLIDOS (sem salvar)${NC}"
echo "POST $API/teste/validar-loja"
curl -s -X POST "$API/teste/validar-loja" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja Teste Valida",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João Silva",
      "email": "joao@teste.com",
      "telefone": "(61) 98765-4321",
      "cpf": "111.222.333-44"
    },
    "endereco": {
      "rua": "SQS 302",
      "numero": "125",
      "cep": "70232-000",
      "latitude": -15.7942,
      "longitude": -47.8822
    }
  }' | jq '.'
echo ""

# TESTE 5: Validar RA inválida
echo -e "${YELLOW}[TESTE 5] Validar RA INVÁLIDA${NC}"
echo "POST $API/teste/validar-loja (com RA=Brasília Fake)"
curl -s -X POST "$API/teste/validar-loja" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja Teste",
    "ra": "Brasília Fake",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João",
      "email": "joao@teste.com",
      "telefone": "(61) 98765-4321",
      "cpf": "111.222.333-44"
    },
    "endereco": {
      "rua": "SQS 302",
      "numero": "125",
      "cep": "70232-000",
      "latitude": -15.7942,
      "longitude": -47.8822
    }
  }' | jq '.'
echo ""

# TESTE 6: Validar email inválido
echo -e "${YELLOW}[TESTE 6] Validar EMAIL INVÁLIDO${NC}"
echo "POST $API/teste/validar-loja (com email=sem-arroba)"
curl -s -X POST "$API/teste/validar-loja" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja Teste",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "name": "João",
      "email": "email-sem-arroba",
      "telefone": "(61) 98765-4321",
      "cpf": "111.222.333-44"
    },
    "endereco": {
      "rua": "SQS 302",
      "numero": "125",
      "cep": "70232-000",
      "latitude": -15.7942,
      "longitude": -47.8822
    }
  }' | jq '.'
echo ""

# TESTE 7: Validar telefone inválido
echo -e "${YELLOW}[TESTE 7] Validar TELEFONE INVÁLIDO${NC}"
echo "POST $API/teste/validar-loja (com telefone=61987654321)"
curl -s -X POST "$API/teste/validar-loja" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja Teste",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João",
      "email": "joao@teste.com",
      "telefone": "61987654321",
      "cpf": "111.222.333-44"
    },
    "endereco": {
      "rua": "SQS 302",
      "numero": "125",
      "cep": "70232-000",
      "latitude": -15.7942,
      "longitude": -47.8822
    }
  }' | jq '.'
echo ""

# TESTE 8: Validar CPF inválido
echo -e "${YELLOW}[TESTE 8] Validar CPF INVÁLIDO${NC}"
echo "POST $API/teste/validar-loja (com cpf=12345678900)"
curl -s -X POST "$API/teste/validar-loja" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Loja Teste",
    "ra": "Asa Sul",
    "categoria": "Comercial",
    "vendedor": {
      "nome": "João",
      "email": "joao@teste.com",
      "telefone": "(61) 98765-4321",
      "cpf": "12345678900"
    },
    "endereco": {
      "rua": "SQS 302",
      "numero": "125",
      "cep": "70232-000",
      "latitude": -15.7942,
      "longitude": -47.8822
    }
  }' | jq '.'
echo ""

# TESTE 9: Cadastrar loja de teste (com dados pré-preenchidos)
echo -e "${YELLOW}[TESTE 9] Cadastrar LOJA DE TESTE (com padrão Asa Sul)${NC}"
echo "POST $API/teste/loja"
TIMESTAMP=$(date +%s)
curl -s -X POST "$API/teste/loja" \
  -H "Content-Type: application/json" \
  -d "{
    \"vendedor\": {
      \"cpf\": \"555.666.777-${TIMESTAMP: -2}\"
    }
  }" | jq '.'
echo ""

# TESTE 10: Cadastrar loja com RA específica
echo -e "${YELLOW}[TESTE 10] Cadastrar loja com RA=Ceilândia${NC}"
echo "POST $API/teste/loja (com RA=Ceilândia)"
TIMESTAMP=$(date +%s)
curl -s -X POST "$API/teste/loja" \
  -H "Content-Type: application/json" \
  -d "{
    \"ra\": \"Ceilândia\",
    \"categoria\": \"Alimentação\",
    \"vendedor\": {
      \"cpf\": \"777.888.999-${TIMESTAMP: -2}\"
    }
  }" | jq '.'
echo ""

# TESTE 11: Listar lojas cadastradas
echo -e "${YELLOW}[TESTE 11] Listar todas as lojas cadastradas${NC}"
echo "GET $API/lojas"
curl -s $API/lojas | jq '.'
echo ""

echo -e "${GREEN}======================================"
echo "✅ TESTES CONCLUÍDOS!"
echo "======================================${NC}"
echo ""
echo -e "${BLUE}Dicas:${NC}"
echo "1. Verifique o RESUMO_ATUALIZACOES.md para documentação"
echo "2. Verifique o TESTE_VALIDACOES.md para exemplos detalhados"
echo "3. Use 'jq .' para formatar a saída JSON"
echo ""
