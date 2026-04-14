# 🔴 Backend Error 500 - Diagnóstico Completo

## 🎯 O Problema Persiste?

Vamos encontrar **exatamente** onde está a falha.

---

## 📊 PASSO 1: Ver o Erro Exacto (Vercel Logs)

1. **Vai a:** https://vercel.com/dashboard/alfa-omega-site/deployments
2. **Clica** a deploy mais recente
3. **Vai a:** "Functions" (lado esquerdo)
4. **Procura:** `/api/subscribe` 
5. **Clica** nele
6. **Procura** Logs que dizem `[API Subscribe] Error`
7. **Copia** a **mensagem de erro EXATA**

---

## 🧪 PASSO 2: Testar INSERT Diretamente em Supabase

Se não consegues ver logs Vercel, testa isto:

👉 https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql

**New Query:**
```sql
INSERT INTO push_subscriptions (
  endpoint,
  auth_key,
  p256dh_key,
  is_active,
  subscribed_at
) VALUES (
  'https://test-endpoint-' || now()::text,
  'test-auth',
  'test-p256dh',
  true,
  now()
);
```

**Clica ▶ Run**

### ✅ Se funciona
INSERT é capaz → Problema é no API `/api/subscribe`

### ❌ Se dá erro (ex: "permission denied")
RLS policy bloqueia → Problema é as políticas

---

## 🔧 PASSO 3: Verificar SERVICE_ROLE_KEY em Vercel

👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

**Procura:**
- `SUPABASE_SERVICE_ROLE_KEY`

### ❌ Se NÃO existe
**Adiciona agora:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ
```

Clica "Save"

⏳ Vercel vai redeploy automaticamente (2 minutos)

---

## 🧹 PASSO 4: Limpar Todas as Policies (Nuclear)

Se ainda com erro 500, faz "reset total":

**New Query em Supabase:**

```sql
-- DROP tudo
DROP POLICY IF EXISTS "allow_insert_for_all" ON push_subscriptions;
DROP POLICY IF EXISTS "allow_update_via_service_role" ON push_subscriptions;
DROP POLICY IF EXISTS "allow_delete_via_service_role" ON push_subscriptions;
DROP POLICY IF EXISTS "block_select_push_subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "no_insert" ON push_subscriptions;
DROP POLICY IF EXISTS "no_update" ON push_subscriptions;
DROP POLICY IF EXISTS "no_delete" ON push_subscriptions;
DROP POLICY IF EXISTS "no_select" ON push_subscriptions;
DROP POLICY IF EXISTS "insert_own_subscription" ON push_subscriptions;
DROP POLICY IF EXISTS "block_all_notification_logs" ON notification_logs;
DROP POLICY IF EXISTS "no_access" ON notification_logs;
```

**Clica ▶ Run**

---

## ✅ PASSO 5: Criar UMA Única Policy Simples

**New Query:**

```sql
-- Delete RLS (permitir tudo, sem restrições)
ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs DISABLE ROW LEVEL SECURITY;

-- Re-ativar com policies simples
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Permitir INSERT para todos
CREATE POLICY "allow_insert" ON push_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Permitir UPDATE para todos
CREATE POLICY "allow_update" ON push_subscriptions
  FOR UPDATE
  USING (true);
```

**Clica ▶ Run**

✅ Policies recriadas de forma super simples

---

## 🚀 PASSO 6: Redeploy Vercel

1. https://vercel.com/dashboard/alfa-omega-site/deployments
2. Clica "..." no deploy mais recente
3. Clica "Redeploy"
4. Aguarda "Ready" ✓

**Tempo:** 2-3 minutos

---

## 🧪 PASSO 7: Teste Final

1. **Hard reload** (Ctrl+Shift+R):
   https://www.colegioalfaeomega.com/dashboard-push.html

2. **Abre Console** (F12)

3. **Clica "🔔 Ativar Notificações"**

4. **Procura no console:**
   - ✅ Se vê "Notificações ativadas! ✓" → **SUCESSO!**
   - ❌ Se vê "Backend error: 500" → Próximo passo

---

## 🔍 Se AINDA der erro 500

**Executa isto no Console do browser (F12):**

```javascript
diagnosePushNotifications()
```

**E copia o output COMPLETO**

Depois **vai a Vercel Logs** e procura por:
```
[API Subscribe] Error inserting subscription:
```

**Copia a mensagem EXATA de erro**

---

## 📋 Checklist Rápido

- [ ] Verificou SERVICE_ROLE_KEY em Vercel (existe?)
- [ ] Se não existia, adicionou
- [ ] Executou PASSO 4 (DROP tudo)
- [ ] Executou PASSO 5 (Criar policies simples)
- [ ] Redeploy Vercel completado
- [ ] Hard reload na UI (Ctrl+Shift+R)
- [ ] Testou UI

---

## 🚨 Se Nada Funciona

Por favor executa **TODOS** estes comandos na sequência:

**Em Supabase SQL:**

```sql
-- Ver o que existe
SELECT tablename FROM information_schema.tables 
WHERE table_schema = 'public' AND tablename LIKE 'push%';

-- Ver estatísticas da tabela
\d+ push_subscriptions;

-- Ver status de RLS
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'push_subscriptions';

-- Ver todas as políticas
SELECT policyname, permissive FROM pg_policies 
WHERE tablename = 'push_subscriptions';
```

E **copia toda a resposta** → mostra-me exatamente o que está lá.

