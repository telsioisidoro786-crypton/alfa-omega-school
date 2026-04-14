# ✅ Teste Final - Web Push Notifications

## 🎯 Setup Summary

Tens agora:
- ✅ VAPID Keys (geradas e em Vercel)
- ✅ Tabelas Supabase (push_subscriptions + notification_logs)
- ✅ Variáveis de ambiente configuradas
- ✅ APIs prontas para usar

Agora vamos **testar tudo**!

---

## 📋 Checklist Pré-Teste

Antes de testar, confirma:

- [ ] As 5 variáveis estão em Vercel ✓
- [ ] Deploy está "Ready" em Vercel ✓
- [ ] Tabelas criadas em Supabase ✓
- [ ] Fizeste hard reload (Ctrl+Shift+R) ✓

---

## 🚀 Teste 1: Carregar Dashboard

1. **Vai a:**
   https://www.colegioalfaeomega.com/dashboard-push.html

2. **Abre Console:**
   Clica F12 → Aba "Console"

3. **Verifica Status Inicial:**
   ```javascript
   diagnosePushNotifications()
   ```

4. **Procura por:**
   ```
   ✓ vapidPublicKey loaded: true
   ✓ swRegistration: [object...]
   ✓ isSupported: true
   ```

❌ Se algum é `false` → Vai para [Troubleshooting](#troubleshooting)

---

## 🔔 Teste 2: Ativar Notificações

### 2a. Clica "🔔 Ativar Notificações"

Esperado:
- ✅ Browser pede permissão (aparece popup)
- ✅ Clica "Permitir"
- ✅ Vê mensagem "Notificações ativadas! ✓"

❌ Se vê "Backend error: 500" → Vai para [Troubleshooting](#troubleshooting)

### 2b. Verifica Console

Deve ver logs como:
```
[Push] ✓ User subscribed successfully
```

---

## 📤 Teste 3: Enviar Notificação

### 3a. Preenche Formulário

- **Título:** `Teste de Notificações`
- **Mensagem:** `Esta é uma notificação de teste!`
- **URL:** (deixa em branco)

### 3b. Clica "📤 Enviar Agora"

Esperado:
- ✅ Vê "Notificação enviada a 1/1 utilizadores ✓"
- ✅ A notificação aparece no canto superior/inferior do ecrã

### 3c. Clica na Notificação

A notificação deve abrir (sem redirecionar pois URL estava vazia)

---

## 🆘 Troubleshooting

### ❌ Status: `isSupported: false`

**Problema:** Browser não suporta Service Workers

**Solução:**
- Testa em Chrome, Firefox, Edge (modernos)
- Não funciona em IE (outdated)
- Não funciona se site não é HTTPS (exceto localhost)

---

### ❌ Backend error: 500 em Subscrição

**Problema:** `/api/subscribe` está falhando

**Verificação 1 - Tabelas existem?**
```sql
SELECT COUNT(*) FROM push_subscriptions;
```

❌ Se dá erro → Executa [PUSH_NOTIFICATIONS.sql](PUSH_NOTIFICATIONS.sql)

**Verificação 2 - Variáveis Vercel?**
Confirma todas 5 em: https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

- NEXT_PUBLIC_VAPID_PUBLIC_KEY ✓
- VAPID_PRIVATE_KEY ✓
- SUPABASE_URL ✓
- SUPABASE_ANON_KEY ✓
- SUPABASE_SERVICE_ROLE_KEY ✓

❌ Se falta alguma → Adiciona em Vercel

**Verificação 3 - Vercel Logs**
1. https://vercel.com/dashboard/alfa-omega-site/deployments
2. Clica "Deployments" mais recente
3. Vai a "Functions"
4. Clica `/api/subscribe`
5. Vê a mensagem de erro completa

---

### ❌ "Notificação de teste" não aparece

**Problema:** Notificação não renderiza

**Verificação:**
- Nas **Settings → Notificações**, o site está "Permitido"?
  - Windows: Settings → Notifications → Permite colegioalfaeomega.com

- O browser está em **foco**?
  - Notificações só aparecem quando outra aba está no foco

**Solução:**
1. Clica noutra aba
2. Clica "📤 Teste de Notificação" no dashboard
3. A notificação deve aparecer no canto

---

## 📊 Teste 4: Verificar Tabela Supabase

Depois de testar, verifica se dados foram guardados:

**Em Supabase SQL Editor:**
```sql
SELECT id, endpoint, is_active, subscribed_at 
FROM push_subscriptions 
ORDER BY subscribed_at DESC;
```

✅ Deve aparecer **1+ linhas** com dados da tua subscrição

---

## 🎉 Sucesso!

Se tudo funciona, parabéns! 🎊

Agora tens:
- ✅ Web Push Notifications funcionando
- ✅ Service Worker registado
- ✅ Subscrições guardadas em Supabase
- ✅ Capacidade de enviar notificações em massa

---

## 📚 Próximos Passos

1. **Customizar Dashboard**
   - Adicionar botões/estilos
   - Integrar com painel admin real

2. **Enviar Notificações em Batch**
   - Script para enviar a grupos específicos
   - Agendamento automático

3. **Tracking & Analytics**
   - Ver quantas notificações chegaram
   - Taxa de cliques
   - Timing ótimo de envio

---

## 🔗 Documentação Completa

- Setup Rápido: [VAPID_SETUP_QUICK.md](VAPID_SETUP_QUICK.md)
- Vercel Env: [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
- Tabelas: [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md)
- API Reference: [API_REFERENCE.md](API_REFERENCE.md)
- Guia Visual: [PUSH_NOTIFICATIONS_GUIDE.html](PUSH_NOTIFICATIONS_GUIDE.html)

---

## 💬 Feedback?

Se encontres bugs ou tiveres dúvidas:
1. Executa `diagnosePushNotifications()`
2. Verifica os logs ([TROUBLESHOOTING](#troubleshooting))
3. Copia a mensagem de erro exacta

Boa sorte! 🚀

