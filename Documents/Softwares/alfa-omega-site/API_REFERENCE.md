# 📡 Web Push Notifications API — Endpoints Reference

## Sumário Rápido

### Cliente (Frontend)

```javascript
// Inicializar
await PushNotifications.initialize({
  vapidPublicKey: 'BJOU...Md0=',
  supabaseUrl: 'https://xxxxx.supabase.co',
  supabaseAnonKey: 'eyJhbc...'
});

// Subscrever
await PushNotifications.subscribeUser();

// Desinscrever
await PushNotifications.unsubscribeUser();

// Status
PushNotifications.getStatus();

// Teste
await PushNotifications.sendTestNotification();
```

---

## 🔌 API Endpoints (Backend)

### 1. **GET `/api/vapid-key`**

Retorna a VAPID Public Key (público)

**Request:**
```bash
GET /api/vapid-key
```

**Response (200):**
```json
{
  "vapidPublicKey": "BJOU...Md0="
}
```

**Error (500):**
```json
{
  "error": "VAPID key not configured"
}
```

---

### 2. **POST `/api/subscribe`**

Registar uma nova subscrição ou atualizar existente

**Request:**
```bash
POST /api/subscribe
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "auth": "...",
      "p256dh": "..."
    }
  },
  "userAgent": "Mozilla/5.0 ...",
  "timestamp": "2026-04-14T10:30:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "action": "created",
  "subscriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Subscription saved successfully"
}
```

**Response (200 OK — Updated):**
```json
{
  "success": true,
  "action": "updated",
  "subscriptionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error (400):**
```json
{
  "error": "Invalid subscription data"
}
```

**Error (500):**
```json
{
  "error": "Failed to save subscription",
  "details": "Supabase error message"
}
```

---

### 3. **POST `/api/unsubscribe`**

Remover uma subscrição

**Request:**
```bash
POST /api/unsubscribe
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Unsubscribed successfully"
}
```

**Error (400):**
```json
{
  "error": "Endpoint required"
}
```

---

### 4. **POST `/api/send-notification`** ⚠️ **ADMIN ONLY**

Enviar notificação a todos ou recipients específicos

**Request:**
```bash
POST /api/send-notification
Content-Type: application/json

{
  "title": "Reunião de Pais",
  "body": "Convidamos para a reunião mensal de pais...",
  "data": {
    "url": "/eventos/reuniao-pais",
    "custom_field": "value"
  },
  "recipients": []  // Array de user_ids ou [] para todos
}
```

**Response (200):**
```json
{
  "success": true,
  "sent": 156,
  "failed": 3,
  "total": 159,
  "removed": 3,
  "message": "Notification sent to 156/159 users"
}
```

**Breakdown:**
- `sent` = notificações enviadas com sucesso
- `failed` = erros ao enviar
- `total` = subscrições ativas quando requisição chegou
- `removed` = subscrições 410/404 removidas automaticamente

**Error (400):**
```json
{
  "error": "Missing required fields: title, body"
}
```

**Error (500):**
```json
{
  "error": "Failed to fetch subscriptions",
  "details": "Supabase error"
}
```

---

## 📊 Database Schema

### Tabela: `push_subscriptions`

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  auth_key TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP,
  last_updated TIMESTAMP,
  unsubscribed_at TIMESTAMP
);
```

**Campos:**
- `id` — ID único
- `endpoint` — URL do serviço de push (ex: FCM, APNs)
- `auth_key` — Chave de autenticação
- `p256dh_key` — Chave de encriptação
- `user_agent` — Identificação do dispositivo/browser
- `is_active` — Se está subscrito (TRUE) ou não (FALSE)
- `subscribed_at` — Data de subscrição
- `last_updated` — Última atualização
- `unsubscribed_at` — Data de desinscrição (se aplicável)

### Tabela: `notification_logs`

```sql
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY,
  title TEXT,
  body TEXT,
  recipients_count INTEGER,
  sent_count INTEGER,
  failed_count INTEGER,
  sent_at TIMESTAMP
);
```

---

## 🔄 Error Handling

### Código HTTP + Web-Push Status

| HTTP | Web-Push | Significado | Ação |
|------|----------|-------------|------|
| 201 | — | Nova subscrição | ✓ Criar |
| 200 | 201 | Notificação enviada | ✓ OK |
| 400 | — | Bad request | ✗ Validar input |
| 404 | 404 | Subscrição não encontrada | ✗ Remover BD |
| 410 | 410 | Subscription expirada | ✗ Remover BD |
| 500 | — | Server error | ✗ Retry depois |

### Lógica de Retry

```javascript
// No send-notification.js
const maxRetries = 3;
let retries = 0;

while (retries < maxRetries) {
  try {
    await webpush.sendNotification(subscription, payload);
    break; // Sucesso
  } catch (error) {
    if (error.statusCode === 500 || error.statusCode === 503) {
      retries++;
      await sleep(1000 * retries); // Backoff exponencial
    } else {
      throw error; // Erro não-retryable
    }
  }
}
```

---

## 🧪 Exemplos de Request (cURL)

### Teste de Notificação

```bash
curl -X POST https://seu-site.vercel.app/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste de Sistema",
    "body": "Se vê isto, tudo está funcionando ✓",
    "data": {
      "url": "/tempo.html"
    }
  }'
```

### Enviar a Grupo Específico

```bash
curl -X POST https://seu-site.vercel.app/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunião de Pais",
    "body": "Apenas para pais matriculados",
    "recipients": [
      "user-id-1",
      "user-id-2",
      "user-id-3"
    ]
  }'
```

---

## 📱 Fluxo de Dados

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. subscribeUser()
       │ (urlBase64ToUint8Array)
       ↓
┌──────────────────┐
│ /api/subscribe   │
│ (POST)           │
└──────┬───────────┘
       │ 2. Guarda em Supabase
       │ push_subscriptions
       ↓
┌──────────────────────────┐
│ Supabase Database        │
│ push_subscriptions ✓     │
└──────────────────────────┘

┌─────────────────────────┐
│ /dashboard-push.html    │
│ (Admin Interface)       │
└──────┬──────────────────┘
       │ 3. Envia formulário
       │ POST /api/send-notification
       ↓
┌──────────────────────────────┐
│ /api/send-notification       │
│ (Node.js - Vercel Function)  │
└──────┬───────────────────────┘
       │ 4. Lê subscriptions
       │ do Supabase
       ↓
┌──────────────────────────┐
│ web-push.sendNotification│
│ (com VAPID keys)        │
└──────┬───────────────────┘
       │ 5. Envia para:
       │ FCM, APNs, etc.
       ↓
┌─────────────────┐
│ Browser/Device  │
│ Service Worker  │
│ 'push' event    │
└──────┬──────────┘
       │ 6. showNotification()
       ↓
┌──────────────────┐
│ Notificação!     │
│ (mesmo offline)  │
└──────────────────┘
```

---

## ⚙️ Environment Variables Necessárias

**Em Vercel → Settings → Environment Variables:**

```
# Public (acessível no frontend)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJOU...Md0=

# Private (apenas no servidor)
VAPID_PRIVATE_KEY=R4nC...h5w=
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbc...xxx
```

---

## 🔐 Segurança: HTTPS & Origin

- ✅ **Vercel:** Automático HTTPS para `*.vercel.app` e domínios custom
- ✅ **Localhost:** Funciona em `http://localhost:3000` para dev
- ❌ **HTTP em produção:** Bloqueado por browsers (CORS)

---

## 📞 Support

Se encontrar erros ou tiver dúvidas:

1. Verificar logs em **Vercel → Deployments → Function Logs**
2. Aceder ao **Supabase → Logs** para SQL errors
3. Abrir DevTools no browser: **F12 → Console → Network**
4. Procurar por patterns `[API]` ou `[Push]` nos logs

---

**Última Atualização:** 14 Abril 2026 | **Versão:** 1.0 | **Status:** Production Ready ✓
