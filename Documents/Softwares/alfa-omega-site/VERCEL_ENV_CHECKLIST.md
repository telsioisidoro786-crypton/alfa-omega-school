# 🔑 Checklist Vercel Environment Variables

## 📍 Localização Exata

👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

---

## 📋 Verifica CADA UMA Destas 5 Variáveis

Copia o **nome exato** e procura na tua lista:

### 1️⃣ NEXT_PUBLIC_VAPID_PUBLIC_KEY

- **Value começa com:** `BAlRMWBPr4w...`
- **Status:** ☑️ Production ☑️ Preview ☑️ Development

❌ Se não existe → **Adiciona agora** (mesmo que já tenha adicionado antes, verifica!)

---

### 2️⃣ VAPID_PRIVATE_KEY

- **Value:** `h91pPi8RhDyCpz5b5GLbL3gQ_FHuNOguI9czCTGibaQ`
- **Status:** ☑️ Production ☑️ Preview ☑️ Development

❌ Se não existe → **Adiciona agora**

---

### 3️⃣ SUPABASE_URL

- **Value:** `https://xpoysdrwvmamrtybiflj.supabase.co`
- **Status:** ☑️ Production ☑️ Preview ☑️ Development

❌ Se não existe → **Adiciona agora**

---

### 4️⃣ SUPABASE_ANON_KEY

- **Value começa com:** `sb_publishable_f5TrSsgbVRptK1...`
- **Status:** ☑️ Production ☑️ Preview ☑️ Development

❌ Se não existe → **Adiciona agora**

---

### 5️⃣ SUPABASE_SERVICE_ROLE_KEY ⚠️ **CRÍTICA**

- **Value começa com:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (longa)
- **Status:** ☑️ Production ☑️ Preview ☑️ Development

**ESTA É A MAIS IMPORTANTE!**

❌ Se não existe → **Adiciona AGORA!**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ
```

---

## ✅ Checklist

- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY existe
- [ ] VAPID_PRIVATE_KEY existe
- [ ] SUPABASE_URL existe
- [ ] SUPABASE_ANON_KEY existe
- [ ] **SUPABASE_SERVICE_ROLE_KEY existe** ← Mais importante!
- [ ] **TODAS** têm ☑️ Production ☑️ Preview ☑️ Development

---

## 🚀 Se Adicionou/Mudou Algo

Depois de guardar:

1. Vai a: https://vercel.com/dashboard/alfa-omega-site/deployments
2. Verifica que aparece nova deploy
3. Aguarda status mudar para "Ready"
4. Depois testa: https://www.colegioalfaeomega.com/dashboard-push.html

---

## 🆘 Se Ainda Não Funciona

Executa isto no **Console do browser (F12):**

```javascript
// Ver o que o código tem
console.log('VAPID carregada?', PushNotifications.config.vapidPublicKey ? 'SIM' : 'NÃO');
console.log('SW registado?', PushNotifications.state.swRegistration ? 'SIM' : 'NÃO');

// Testar API subscribe
if (PushNotifications.state.subscription) {
  testSubscribeAPI(PushNotifications.state.subscription);
}
```

---

**Verifica as 5 variáveis agora. Qual delas está faltando?**

