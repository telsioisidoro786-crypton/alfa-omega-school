# ⚡ SUPER SIMPLES - 5 Minutos Fix

Se ainda vem **Backend Error 500**, faz isto (exatamente nesta ordem):

---

## ✅ AÇÃO 1: Verificar SERVICE_ROLE_KEY (1 min)

👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

**Procura na lista:**
- SUPABASE_SERVICE_ROLE_KEY

### ❌ NÃO EXISTE?

Clica **"+ Add New"**

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ
```

Seleciona todos os Environments: ☑️ Production ☑️ Preview ☑️ Development

Clica **"Save"**

⏳ **Aguarda 2 minutos** → Vercel redeploy automático

---

## ✅ AÇÃO 2: Desativar RLS Temporariamente (2 min)

👉 https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql

**New Query:**

```sql
ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs DISABLE ROW LEVEL SECURITY;
```

Clica ▶ **Run**

✅ RLS desativada

---

## ✅ AÇÃO 3: Teste Rápido (1 min)

👉 https://www.colegioalfaeomega.com/dashboard-push.html

Hard refresh: **Ctrl+Shift+R**

Clica: **"🔔 Ativar Notificações"**

### ✅ Se funciona agora ("Notificações ativadas! ✓")

Ótimo! O problema era RLS. Próximo passo: Re-ativar RLS com políticas corretas.

### ❌ Se AINDA dá erro

Significa que o problema é outro (não é RLS). Vai para a Ação Extra.

---

## ✅ AÇÃO 4: Re-ativar RLS Corretamente (1 min)

Se funcionou na Ação 3, agora re-ativa com políticas:

**New Query em Supabase:**

```sql
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_insert" ON push_subscriptions;
DROP POLICY IF EXISTS "allow_update" ON push_subscriptions;

CREATE POLICY "allow_insert" ON push_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_update" ON push_subscriptions
  FOR UPDATE USING (true);
```

Clica ▶ **Run**

---

## ✅ TESTE FINAL

1. Redeploy Vercel (se mudou variáveis):
   https://vercel.com/dashboard/alfa-omega-site/deployments → "Redeploy"

2. Hard reload UI (Ctrl+Shift+R):
   https://www.colegioalfaeomega.com/dashboard-push.html

3. Testa: **"🔔 Ativar Notificações"**

---

## 🆘 AÇÃO EXTRA: Se Não Funcionou

Se AINDA dá erro 500 **mesmo com RLS disabled**:

1. Abre: https://vercel.com/dashboard/alfa-omega-site/deployments
2. Clica deploy mais recente
3. Vai a: "Functions"
4. Clica: `/api/subscribe`
5. Procura no log: `[API Subscribe]`
6. **Copia a mensagem de erro**

---

## 📊 Summary

| Passo | Ação | Tempo |
|-------|------|-------|
| 1 | Adicionar SERVICE_ROLE_KEY em Vercel | 1 min |
| 2 | Desativar RLS em Supabase | 1 min |
| 3 | Testar UI | 1 min |
| 4 | Re-ativar RLS (se funcionou) | 1 min |
| **TOTAL** | | **~5 minutos** |

---

**Comença pelo PASSO 1 - Vercel. Depois avança.**

Qual foi o resultado do PASSO 1? SERVICE_ROLE_KEY existia? 

