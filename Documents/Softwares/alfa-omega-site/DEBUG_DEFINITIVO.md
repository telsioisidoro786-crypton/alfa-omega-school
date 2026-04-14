# 🚨 DEBUG DEFINITIVO - 500 Error

O erro 500 quer dizer que há um erro no servidor Vercel.

**Vamos encontrar EXATAMENTE qual é.**

---

## 📊 PASSO 1: Ver o Erro na Consola Vercel

Este é o MAIS importante.

### A. Vai a Vercel Logs
👉 https://vercel.com/dashboard/alfa-omega-site/deployments

### B. Clica a **Deploy Mais Recente**
(A que diz "Ready" ou "Failed")

### C. Clica em "Functions" (lado esquerdo)

### D. Procura por **`subscribe`**
Deve aparecer:
- `/api/subscribe`
- `/api/subscribe-simple` (novo)

### E. Clica em `/api/subscribe`

### F. **VÊ O LOG COMPLETO**

Procura por linhas que começam com:
```
[API Subscribe]
```

**COPIA TODA A MENSAGEM DE ERRO** que aparece. Pode estar algo como:

```
[API Subscribe] ✗ INSERT FAILED
[API Subscribe] Error code: ...
[API Subscribe] Error message: ...
```

**ISTO É CRÍTICO** - sem isto não posso saber onde está o bug real.

---

## 🧪 PASSO 2: Testar API Simples Novo

A versão simplificada `/api/subscribe-simple` pode funcionar melhor.

### A. Abre Console do Browser (F12)

### B. Executa isto:

```javascript
// Testa o novo endpoint simples
const subscription = PushNotifications.state.subscription;

if (!subscription) {
  console.log('Nenhuma subscrição em active. Subscribe primeiro.');
} else {
  const response = await fetch('/api/subscribe-simple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }),
  });
  
  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
}
```

### C. Procura na resposta:
- ✅ Status 201 = Sucesso!
- ❌ Status 500 = Erro (mesmo problema)

---

## 📋 PASSO 3: Verificar Supabase Manualmente

Se API dá erro 500, pode ser Supabase falhando.

### A. Testa INSERT Direto

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
  'https://test-' || now()::text,
  'test-auth-' || now()::text,
  'test-p256dh-' || now()::text,
  true,
  now()
);
```

Clica ▶ Run

### ✅ Se vê "1 row inserted"
Supabase funciona. O problema é no código Vercel.

### ❌ Se vé erro (ex: "permission denied")
RLS está bloqueando. Faz isto:

```sql
ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;
```

Depois tenta INSERT novamente.

---

## 🔐 PASSO 4: Verificar Variáveis Vercel

### A. Vai a:
👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

### B. Procura CADA UMA:

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
```

### C. **Procura ERROR ou "undefined"**

Se vé algo vazio ou falta → Problema encontrado!

---

## 🎯 PASSO 5: Último Resort - Forçar Output Detalhado

Vai a Vercel Logs novamente e filtra:

```
[API Subscribe] Error
```

Copia **TUDO** que aparece relacionado com esse erro.

---

## 🚨 Responde Com Isto:

Depois de fazer os Passos 1-5, responde com:

1. **Qual foi o erro no log Vercel?** (Passo 1F)
   ```
   [API Subscribe] Error: _______________
   ```

2. **Teste /api/subscribe-simple funcionou?** (Passo 2)
   - ✅ 201 = Sim!
   - ❌ 500 = Não

3. **INSERT direto em Supabase funcionou?** (Passo 3)
   - ✅ Sim
   - ❌ Não (RLS bloqueando)

4. **Todas as 5 variáveis existem em Vercel?** (Passo 4)
   - ☑️ Sim
   - ❌ Faltam: ________

5. **Qual é o erro exato que encontrou?** (Passo 5)

---

## 💡 Dica

Se não consegues ver logs Vercel:
- Tenta outro browser (Chrome, Firefox, Edge)
- Tenta incógnito (sem cache)
- Verção pública pode estar em cache diferente

---

**Comença pelo PASSO 1. Qual é o erro exato que vês no log?**

