# 🚀 INÍCIO RÁPIDO - Testando as Validações

## ✅ O que foi implementado

Você agora tem **4 novas rotas de teste** para validar o sistema de 33 RAs de Brasília:

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/regioes` | GET | Lista todas as 33 RAs |
| `/api/regioes/buscar/:termo` | GET | Busca RAs por termo |
| `/api/regioes/:ra/coordenadas` | GET | Obtém coordenadas de uma RA |
| `/api/teste/dados-loja` | GET | Dados de teste pré-preenchidos |
| `/api/teste/validar-loja` | POST | Valida dados SEM salvar |
| `/api/teste/loja` | POST | Cadastra loja de teste COM dados pré-preenchidos |

---

## 🧪 3 Maneiras de Testar

### Opção 1: Terminal com cURL (Windows PowerShell)

```powershell
# 1. Obter dados de teste
curl http://localhost:3000/api/teste/dados-loja

# 2. Cadastrar loja de teste
curl -X POST http://localhost:3000/api/teste/loja `
  -H "Content-Type: application/json" `
  -d '{}'
```

### Opção 2: Node.js

```bash
# Execute o script de testes Node.js
node teste-validacoes-nodejs.js
```

### Opção 3: Postman

1. Abra o Postman
2. Crie uma nova request:
   - **Method:** POST
   - **URL:** http://localhost:3000/api/teste/loja
   - **Body (raw JSON):**
   ```json
   {
     "ra": "Asa Sul"
   }
   ```
3. Clique em **Send**

---

## 📋 Exemplo Prático: Teste Completo em 5 Passos

### Passo 1: Iniciar o Servidor
```bash
cd "mercado interno.js"
npm run dev
```

### Passo 2: Em outro terminal, listar RAs
```powershell
curl http://localhost:3000/api/regioes | jq '.ras | length'
# Deve retornar: 33
```

### Passo 3: Testar com RA específica
```powershell
curl -X POST http://localhost:3000/api/teste/loja `
  -H "Content-Type: application/json" `
  -d '{"ra": "Taguatinga"}'
```

### Passo 4: Testar validação (deve falhar)
```powershell
curl -X POST http://localhost:3000/api/teste/validar-loja `
  -H "Content-Type: application/json" `
  -d '{
    "ra": "Brasília Fake"
  }' | jq '.'
```

### Passo 5: Listar lojas cadastradas
```powershell
curl http://localhost:3000/api/lojas | jq '.'
```

---

## 🎯 O que Testar

### ✅ Testes Que Devem Passar (Sucesso)

```bash
# 1. RA válida
POST /api/teste/loja
{"ra": "Asa Sul"}

# 2. Email válido
POST /api/teste/validar-loja
{"vendedor": {"email": "joao@teste.com"}}

# 3. Telefone válido
POST /api/teste/validar-loja
{"vendedor": {"telefone": "(61) 98765-4321"}}

# 4. CPF válido
POST /api/teste/validar-loja
{"vendedor": {"cpf": "123.456.789-00"}}

# 5. CEP válido
POST /api/teste/validar-loja
{"endereco": {"cep": "70232-000"}}
```

### ❌ Testes Que Devem Falhar (Erro)

```bash
# 1. RA inválida
POST /api/teste/loja
{"ra": "Brasília Fake"}

# 2. Email inválido
POST /api/teste/validar-loja
{"vendedor": {"email": "email-sem-arroba"}}

# 3. Telefone inválido
POST /api/teste/validar-loja
{"vendedor": {"telefone": "61987654321"}}

# 4. CPF inválido
POST /api/teste/validar-loja
{"vendedor": {"cpf": "12345678900"}}

# 5. CEP inválido
POST /api/teste/validar-loja
{"endereco": {"cep": "12345"}}
```

---

## 📊 Checklist de Testes

- [ ] Listar 33 RAs com sucesso
- [ ] Buscar RAs por termo (ex: "asa")
- [ ] Obter coordenadas de uma RA
- [ ] Obter dados de teste pré-preenchidos
- [ ] Validar dados corretos (passa)
- [ ] Rejeitar RA inválida
- [ ] Rejeitar email inválido
- [ ] Rejeitar telefone inválido
- [ ] Rejeitar CPF inválido
- [ ] Rejeitar CEP inválido
- [ ] Cadastrar loja de teste
- [ ] Listar lojas cadastradas

---

## 🔧 Dica de Produção

Para usar em produção, substitua:
```javascript
// ❌ Remova antes de produção
router.post('/teste/loja', ...)
router.post('/teste/validar-loja', ...)
router.get('/teste/dados-loja', ...)
```

Por um middleware de autenticação:
```javascript
const verificarAutenticacao = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado' });
  }
  next();
};

router.post('/teste/loja', verificarAutenticacao, ...)
```

---

## 📝 Arquivos de Documentação

| Arquivo | Descrição |
|---------|-----------|
| `RESUMO_ATUALIZACOES.md` | Resumo completo das mudanças |
| `ATUALIZACAO_RAS.md` | Documentação detalhada das RAs |
| `TESTE_VALIDACOES.md` | Exemplos de testes com cURL |
| `exemplos-ras.js` | Exemplos de código JavaScript |
| `teste-validacoes.sh` | Script bash com 11 testes |
| `teste-validacoes-nodejs.js` | Script Node.js com testes |

---

## 🎉 Próximo Passo

Você está pronto para:
1. ✅ Testar as validações
2. ✅ Criar um frontend para cadastro
3. ✅ Integrar com banco de dados real
4. ✅ Deploy em produção

**Bom proveito! 🚀**
