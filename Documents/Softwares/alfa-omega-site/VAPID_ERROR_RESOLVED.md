# 🚀 Resolução: VAPID Keys Não Configuradas

## 🔍 O Problema

```
Erro: Failed to load VAPID key
Status: 500
```

**Causa:** As variáveis de ambiente `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY` não estão configuradas no Vercel.

**Impacto:** Service Worker não consegue registar-se → Notificações push não funcionam.

---

## ✅ Soluções Implementadas

### 1. **Fallback Inteligente** 
O código agora tenta múltiplas fontes para VAPID key:
- ✅ Servidor (`/api/vapid-key`)
- ✅ LocalStorage (modo DEV)
- ✅ Mensagem de erro clara com instruções

### 2. **Função Dev Mode**
Novo método para testing sem esperar Vercel:
```javascript
setDevVapidKey('B4_sua_public_key_aqui')
PushNotifications.initialize()
```

### 3. **Aviso Visual no Dashboard**
O `/dashboard-push.html` agora mostra:
- ⚠️ Banner vermelho se VAPID faltar
- 📖 Instruções de setup (expandível)
- 🔗 Link para o guia completo

### 4. **Diagnóstico Integrado**
Nova função para debugging:
```javascript
diagnosePushNotifications()
```
Mostra status completo + verificações

---

## 🎯 Próximos Passos (Teu Lado)

### Opção A: Setup Produção (Recomendado)
Siga [VAPID_SETUP_QUICK.md](VAPID_SETUP_QUICK.md) — 10 minutos

### Opção B: Testar Localmente (Rápido)
1. **Gera VAPID localmente:**
   ```powershell
   npm install -g web-push
   web-push generate-vapid-keys
   ```

2. **Abre o browser console (F12)**

3. **Executa:**
   ```javascript
   setDevVapidKey('B4_...') // cola a public key aqui
   PushNotifications.initialize()
   ```

4. **Diagnotico:**
   ```javascript
   diagnosePushNotifications()
   ```

---

## 📋 Checklist Rápido

- [ ] Gerou VAPID keys localmente (`web-push generate-vapid-keys`)
- [ ] Adicionou `NEXT_PUBLIC_VAPID_PUBLIC_KEY` em Vercel
- [ ] Adicionou `VAPID_PRIVATE_KEY` em Vercel  
- [ ] Esperou 2+ minutos pela redeploy
- [ ] Fez hard reload (Ctrl+Shift+R)
- [ ] Executou `diagnosePushNotifications()` com sucesso ✓

---

## 🔧 Ficheiros Modificados

| Ficheiro | Mudança |
|----------|---------|
| `assets/js/push-notifications.js` | Fallback VAPID + Dev Mode + Diagnóstico |
| `dashboard-push.html` | Aviso visual + Instruções integradas |
| `VAPID_SETUP_QUICK.md` | **NOVO** — Guia passo-a-passo |

---

## 🆘 Se Ainda Tiver Erros

1. **Executa o diagnóstico:**
   ```javascript
   diagnosePushNotifications()
   ```

2. **Procura por erros nos fields:**
   - `vapidPublicKey loaded: false` → Ainda falta VAPID
   - `swRegistration: null` → SW não registou
   - `Notification.permission: denied` → Notificações bloqueadas

3. **Verifica Vercel:**
   - https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables
   - Confirma que ambas as variáveis estão presentes
   - Verifica se o valor não está vazio

---

## 📚 Documentação

- **Setup Rápido:** [VAPID_SETUP_QUICK.md](VAPID_SETUP_QUICK.md)
- **Guia Completo:** [PUSH_NOTIFICATIONS_SETUP.md](PUSH_NOTIFICATIONS_SETUP.md)
- **API Reference:** [API_REFERENCE.md](API_REFERENCE.md)
- **Visual Guide:** [PUSH_NOTIFICATIONS_GUIDE.html](PUSH_NOTIFICATIONS_GUIDE.html)

---

## 💡 Dica

Se estiver a testar localmente (DEV MODE), pode deixar as VAPID keys fora do Vercel por enquanto. Apenas quando quiser deploy production é que precisa configurar em Vercel.

**Próxima semana:** Quando tiver os VAPID keys prontos, segue o Setup Produção e deploy.

