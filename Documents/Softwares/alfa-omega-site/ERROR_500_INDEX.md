# 🆘 ERROR 500 - Índice Completo de Soluções

Se tem erro 500 em `/api/subscribe`, comece por aqui.

---

## 🎯 TL;DR (Muito Rápido)

Se quer resolver em **5 minutos**:

1. Vai a Vercel Logs: https://vercel.com/dashboard/alfa-omega-site/deployments
2. Clica deploy recente → "Functions" → `/api/subscribe`
3. **Procura por `[API Subscribe]` nos logs**
4. **Copia a mensagem de erro EXATA**
5. Mostra essa mensagem (quer ajuda com o erro específico)

---

## 📚 Documentos de Debug

| Documento | Para Que | Tempo |
|-----------|----------|-------|
| **[DEBUG_DEFINITIVO.md](DEBUG_DEFINITIVO.md)** | 🔴 **COMEÇA AQUI** - Passos estruturados | 10 min |
| [QUICK_5MIN_FIX.md](QUICK_5MIN_FIX.md) | Teste rápido (desativar RLS) | 5 min |
| [VERCEL_ENV_CHECKLIST.md](VERCEL_ENV_CHECKLIST.md) | Verificar variáveis Vercel | 2 min |
| [BACKEND_ERROR_500_FIX.md](BACKEND_ERROR_500_FIX.md) | Soluções alternativas | 15 min |

---

## 🚀 Fluxo Recomendado

### **Cenário 1: Não vês logs Vercel**
1. Lê [VERCEL_ENV_CHECKLIST.md](VERCEL_ENV_CHECKLIST.md) - verifica variáveis
2. Se faltam variáveis, adiciona e redeploy
3. Volta a testar

### **Cenário 2: Vês erro "permission denied"**
1. Lê [QUICK_5MIN_FIX.md](QUICK_5MIN_FIX.md) - Passo 2 (desativar RLS)
2. Testa se funciona
3. Se sim, re-ativa RLS corretamente

### **Cenário 3: Erro bem específico (ex: "table not found")**
1. Executa [DEBUG_DEFINITIVO.md](DEBUG_DEFINITIVO.md) - Passo 3 (teste Supabase)
2. Se Supabase OK, problema é código
3. Se Supabase KO, problema é tabelas

### **Cenário 4: Sem ideia do que é**
1. **Lê TODO [DEBUG_DEFINITIVO.md](DEBUG_DEFINITIVO.md)** - Passos 1-5
2. Com resultado dos 5 passos, vem pedir ajuda

---

## 🔍 Checklist Geral

- [ ] Viu os logs Vercel (Deployments → Deploy → Functions)
- [ ] Tentou `/api/subscribe-simple` (novo endpoint)
- [ ] Testou INSERT direto em Supabase
- [ ] Verificou as 5 variáveis em Vercel
- [ ] Tentou com RLS desativada
- [ ] Se nada funciona, tem a mensagem de erro exacta para me mostrar

---

## 🎯 O Que Fazer Agora

**Escolhe una das opções:**

### ✅ Opção A: Quero resolver Rápido (5 min)
→ Lê: [QUICK_5MIN_FIX.md](QUICK_5MIN_FIX.md)
→ Faz: Passo A (verifica SERVICE_ROLE_KEY)
→ Depois: Faz o teste

### ✅ Opção B: Quero Debug Estruturado (10 min)
→ Lê: [DEBUG_DEFINITIVO.md](DEBUG_DEFINITIVO.md)
→ Faz: Passos 1-5 completamente
→ Depois: Mostra-me os resultados

### ✅ Opção C: Quero Saber Tudo (20 min)
→ Lê tudo nesta ordem:
1. [VERCEL_ENV_CHECKLIST.md](VERCEL_ENV_CHECKLIST.md)
2. [QUICK_5MIN_FIX.md](QUICK_5MIN_FIX.md)
3. [DEBUG_DEFINITIVO.md](DEBUG_DEFINITIVO.md)
4. [BACKEND_ERROR_500_FIX.md](BACKEND_ERROR_500_FIX.md)

---

## 🆘 Precisa de Ajuda?

Se depois de ler os docs ainda não resolve:

1. **Mostra a mensagem de erro EXATA** do Vercel Logs
2. **Diz qual passo falhou** (Passo 1, 2, 3, etc)
3. **Mostra o output/resultado** que obtiveste

Com isto posso ajudar muito mais rápido!

---

## 📝 Última Dica

O erro 500 significa "servidor com erro". Pode ser:

1. ❌ Variáveis de ambiente não configuradas
2. ❌ RLS policy bloqueando INSERT
3. ❌ Tabela não existe
4. ❌ Supabase fora (improvável)
5. ❌ Código com bug

Pelo menos uma destas documentos acima vai resolver!

---

**Qual documento vais ler? Começa agora!** 👈

