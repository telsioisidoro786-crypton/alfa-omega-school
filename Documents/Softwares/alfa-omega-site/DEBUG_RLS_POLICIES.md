# 🔍 Debug RLS Policies - Script Supabase

## ⚠️ PROBLEMA: `/api/subscribe` retorna 500

Isso pode ser:
1. ❌ Policies bloqueando INSERT
2. ❌ Tabela não existe
3. ❌ SERVICE_ROLE_KEY não em Vercel
4. ❌ SQL antigo ainda em cache

---

## 🧪 Teste 1: Ver Estado Atual das Policies

👉 https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql

**New Query:**
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'push_subscriptions'
ORDER BY policyname;
```

**Clica ▶ Run**

---

## 📋 Resultado Esperado

Deve ver **3 policies:**

```
policyname          | permissive | qual | with_check
─────────────────────────────────────────────────────
allow_delete        | PERMISSIVE | true | N/A
allow_update        | PERMISSIVE | true | N/A
insert_own_subscription | PERMISSIVE | N/A  | true
no_access           | RESTRICTIVE| false| (notification_logs)
no_select           | RESTRICTIVE| false| (push_subscriptions)
```

### ✅ Se Vês `allow_insert` OU `insert_own_subscription` = OK
Policies estão certas

### ❌ Se Vês `no_insert` OU `no_update` OU `no_delete`
Policies antigas ainda estão lá! → Vai para Teste 2

---

## 🛠️ Teste 2: Limpar Policies (Se necessário)

Se viste policies antigas, executa isto:

**New Query:**
```sql
DROP POLICY IF EXISTS "no_insert" ON push_subscriptions;
DROP POLICY IF EXISTS "no_update" ON push_subscriptions;
DROP POLICY IF EXISTS "no_delete" ON push_subscriptions;
```

**Clica ▶ Run**

✅ Tudo what dropped

---

## 🛠️ Teste 3: Adicionar Policies Corretas

**New Query:**
```sql
-- 1. INSERT público (qualquer um pode subscrever)
CREATE POLICY IF NOT EXISTS "allow_insert" ON push_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- 2. SELECT bloqueado (dados privados)
CREATE POLICY IF NOT EXISTS "no_select" ON push_subscriptions
  FOR SELECT
  USING (false);

-- 3. UPDATE permitido (backend via SERVICE_ROLE_KEY)
CREATE POLICY IF NOT EXISTS "allow_update" ON push_subscriptions
  FOR UPDATE
  USING (true);

-- 4. DELETE permitido (backend via SERVICE_ROLE_KEY)
CREATE POLICY IF NOT EXISTS "allow_delete" ON push_subscriptions
  FOR DELETE
  USING (true);
```

**Clica ▶ Run**

✅ Policies (re)criadas

---

## 🧪 Teste 4: Testar INSERT Manualmente

**New Query:**
```sql
-- Testar inserção direta
INSERT INTO push_subscriptions (
  endpoint, 
  auth_key, 
  p256dh_key, 
  is_active,
  subscribed_at
) VALUES (
  'https://fcm.googleapis.com/fcm/send/test-endpoint-123',
  'test-auth-key',
  'test-p256dh-key',
  true,
  NOW()
);
```

**Clica ▶ Run**

### ✅ Se vê "1 row"
INSERT funciona! Problema é no código/vercel

### ❌ Se vê erro (ex: "permission denied")
RLS policy ainda bloqueia

---

## 📊 Teste 5: Conta Subscrições

**New Query:**
```sql
SELECT COUNT(*) as total, 
       COUNT(*) FILTER (WHERE is_active = true) as active
FROM push_subscriptions;
```

**Clica ▶ Run**

Deve ver pelo menos `1` na coluna `total` (do teste anterior)

---

## 🔑 Teste 6: Verificar Variáveis Vercel

👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

Confirma **TODAS** 5:
- ☑️ NEXT_PUBLIC_VAPID_PUBLIC_KEY
- ☑️ VAPID_PRIVATE_KEY
- ☑️ SUPABASE_URL
- ☑️ SUPABASE_ANON_KEY
- ☑️ SUPABASE_SERVICE_ROLE_KEY ← **CRÍTICO**

❌ Se falta a 5ª → Adiciona **agora**

---

## 🚀 Teste 7: Re-deploy Vercel

1. Vai a: https://vercel.com/dashboard/alfa-omega-site/deployments
2. Clica "..." na deploy mais recente
3. Clica "Redeploy"
4. Aguarda "Ready"

⏳ 2-3 minutos

---

## 🧪 Teste 8: Reload e Testa UI

1. https://www.colegioalfaeomega.com/dashboard-push.html
2. Hard reload: Ctrl+Shift+R
3. Abre Console (F12)
4. Clica "🔔 Ativar Notificações"
5. Procura por erro no console

---

## 📋 Checklist Completo

- [ ] Executei Teste 1 (Ver policies)
- [ ] Vi `allow_insert` OU `insert_own_subscription`
- [ ] Se não vi, executei Teste 2 (DROP)
- [ ] Executei Teste 3 (Criar policies)
- [ ] Teste 4 (INSERT manual) funcionou
- [ ] Teste 5 (COUNT) mostra dados
- [ ] Vercel tem todas 5 variáveis ✓
- [ ] Re-deploy completado
- [ ] Hard reload na UI
- [ ] Teste UI funciona ✓

---

## 🆘 Se Ainda Falhar

**Executa isto em Supabase (procura por erros):**
```sql
-- Ver definição da tabela
\d+ push_subscriptions

-- Ver RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'push_subscriptions';

-- Ver todos os triggers
SELECT * FROM pg_trigger WHERE tgrelname = 'push_subscriptions';
```

E mostra-me o resultado exato dos erros.

