# 🔑 VAPID Keys - Setup Rápido

## ⚠️ Problema Atual
```
Erro: Failed to load VAPID key
Status: 500 — NEXT_PUBLIC_VAPID_PUBLIC_KEY não configurada
```

---

## ✅ Solução (3 passos)

### 1️⃣ Gerar VAPID Keys Localmente

Abre o **PowerShell** e executa:

```powershell
npm install -g web-push
web-push generate-vapid-keys
```

**Resultado:** Recebes 2 chaves:
```
Public Key:  B4_... (começa com B)
Private Key: Abc... (longo)
```

**Copia AMBAS as chaves!** ⭐

---

### 2️⃣ Adicionar ao Vercel

1. Vai a https://vercel.com/dashboard
2. Seleciona o projeto **alfa-omega-site**
3. Clica em **Settings**
4. Vai a **Environment Variables**
5. Clica **+ Add New**

**Primeira Variável:**
- Name: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Value: *(cola a Public Key gerada)*
- Environments: ☑️ Production ☑️ Preview ☑️ Development

6. Clica **Save**

**Segunda Variável:**
- Name: `VAPID_PRIVATE_KEY`
- Value: *(cola a Private Key gerada)*
- Environments: ☑️ Production ☑️ Preview ☑️ Development

7. Clica **Save**

✅ **Depois Vercel vai redeploy automático** (vê em Deployments)

---

### 3️⃣ Testar

1. **Espera ~2 minutos** pela redeploy (vê em Vercel → Deployments)
2. **Reload** do site (Ctrl+Shift+R) 
3. **Abre DevTools** (F12 → Console)
4. **Executa:**
   ```javascript
   diagnosePushNotifications()
   ```

**Resultado esperado:**
```
✓ vapidPublicKey loaded: true
✓ swRegistration: [object...]
✓ isSupported: true
```

**Se vires erros:** Volta ao passo 2, verifica se as keys foram copiadas corretamente (não há espaços extras)

---

## 🆘 Se Ainda Não Funcionar

### Opção A: Usar DEV MODE (Temporário)

Na **Console do browser**, executa:
```javascript
setDevVapidKey('B4_...') // cola a public key aqui
```

Depois:
```javascript
PushNotifications.initialize()
```

Isto permite testar localmente **sem esperar pelo Vercel**.

### Opção B: Verificar Vercel

1. Vai a https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables
2. Confirma que BOTH variáveis estão listadas
3. Clica em cada uma e verifica que o value não está vazio
4. Se algo está errado, **Delete e cria de novo**

### Opção C: Verificar Deploy

1. Vai a https://vercel.com/dashboard/alfa-omega-site/deployments
2. Procura pela mensagem "Deployed" mais recente
3. Se vires "Error" ou o status não é "Ready", clica para ver o log

---

## 📋 Checklist

- [ ] Executei `web-push generate-vapid-keys`
- [ ] Copiei a **Public Key** corretamente
- [ ] Copiei a **Private Key** corretamente
- [ ] Criei `NEXT_PUBLIC_VAPID_PUBLIC_KEY` em Vercel
- [ ] Criei `VAPID_PRIVATE_KEY` em Vercel
- [ ] Ambas as variáveis têm o **Production** environment checked
- [ ] Esperei 2+ minutos pela redeploy
- [ ] Fiz hard reload (Ctrl+Shift+R)
- [ ] Testei com `diagnosePushNotifications()`

---

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Environment Variables:** https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables
- **Deployments:** https://vercel.com/dashboard/alfa-omega-site/deployments
- **Web Push Gen Tool:** `web-push generate-vapid-keys` (CLI)

---

**Problemas?** Executa `diagnosePushNotifications()` na Console e mostra-me o output!
