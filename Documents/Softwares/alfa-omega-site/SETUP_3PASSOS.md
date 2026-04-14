# 🚀 Setup Completo em 3 Passos

## Teus VAPID Keys (14 Abril 2026)

```
Public:  BAlRMWBPr4wNIyn8UuGaJAcwmamMUIXk5EywUs4EhkaB1pxahdJRLjIVv30_aXalGIKCVt4xPwo-r2aIasuZMVs
Private: h91pPi8RhDyCpz5b5GLbL3gQ_FHuNOguI9czCTGibaQ
```

---

## 1️⃣ Adicionar VAPID Keys ao Vercel (5 min)

👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

**Variable 1:**
- Name: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Value: `BAlRMWBPr4w...` (cola acima)
- Environments: ☑️ Todos

**Variable 2:**
- Name: `VAPID_PRIVATE_KEY`
- Value: `h91pPi8RhDyCpz5b5GLbL3gQ_FHuNOguI9czCTGibaQ`
- Environments: ☑️ Todos

**Verifica também:**
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

✅ Clica "Save" cada uma

⏳ **Espera 2 minutos** → Vercel redeploy automático

---

## 2️⃣ Criar Tabelas Supabase (5 min)

👉 https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql

**Nova Query → Cola isto:**
```
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

**Clica ▶ Run**

### Se vê `push_subscriptions` + `notification_logs`
✅ Pronto! Vai para Passo 3

### Se **NÃO** vê
1. Nova Query
2. Cola todo o conteúdo de: [PUSH_NOTIFICATIONS.sql](PUSH_NOTIFICATIONS.sql)
3. Clica ▶ Run
4. Aguarda "Completed"

✅ Pronto! Vai para Passo 3

---

## 3️⃣ Teste Final (2 min)

1. **Hard reload:**
   https://www.colegioalfaeomega.com/dashboard-push.html (Ctrl+Shift+R)

2. **Abre Console** (F12)

3. **Executa:**
   ```javascript
   diagnosePushNotifications()
   ```

4. **Procura por:**
   ```
   vapidPublicKey loaded: true ✓
   swRegistration: [object] ✓
   isSupported: true ✓
   ```

5. **Clica "🔔 Ativar Notificações"**
   - Permite permissão
   - Deve ver "Notificações ativadas! ✓"

6. **Envia um teste:**
   - Preenche formulário
   - Clica "📤 Enviar"
   - Notificação deve aparecer no ecrã

---

## ✅ Pronto!

Se tudo funciona → **Web Push está operacional!** 🎉

---

## 🆘 Se Há Erros

| Erro | Solução |
|------|---------|
| `vapidPublicKey loaded: false` | Vercel env vars não replicadas → Aguarda 2min + reload |
| `swRegistration: null` | Redeploy falhou → Force nova deploy em Vercel |
| `Backend error: 500` | Tabelas não criadas → Executa [PUSH_NOTIFICATIONS.sql](PUSH_NOTIFICATIONS.sql) |
| Notificação não aparece | Browser bloqueou → Settings → Notificações → Permitir |

---

## 📚 Documentação

- Detalhado Vercel: [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
- Detalhado Supabase: [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md)
- Teste Completo: [TESTE_FINAL.md](TESTE_FINAL.md)
- APIs: [API_REFERENCE.md](API_REFERENCE.md)

---

**Duração Total:** ~15 minutos (+ 2 minutos de redeploy)

Boa sorte! 🚀

