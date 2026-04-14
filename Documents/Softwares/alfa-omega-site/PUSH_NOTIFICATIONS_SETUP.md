# 🔔 Web Push Notifications — Setup & Implementação

> Guia completo para implementar Web Push Notifications no Colégio Alfa e Omega usando Vercel + Supabase.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Gerar VAPID Keys](#gerar-vapid-keys)
3. [Configurar Supabase](#configurar-supabase)
4. [Configurar Vercel](#configurar-vercel)
5. [Integrar no Website](#integrar-no-website)
6. [Testar](#testar)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

- **Node.js 16+** (para ferramentas de geração de keys)
- **Conta Vercel** com projeto configurado
- **Conta Supabase** com projeto ativo
- **Git** para clonar e fazer push
- **Browser moderno** com suporte a Web Push (Chrome, Firefox, Edge, etc.)

---

## 🔐 Gerar VAPID Keys

VAPID (Voluntary Application Server Identification) é um padrão para identificar seu servidor na web push.

⏸️ **STATUS ATUAL:** 
- ✅ Supabase configurado
- ⏳ Aguardando VAPID keys (próximo passo)

### Opção 1: Usar CLI (Recomendado)

```bash
# Instalar ferramentas globais
npm install -g web-push

# Gerar keys
web-push generate-vapid-keys

# Output:
# Public Key: BJOU...Md0=
# Private Key: R4nC...h5w=
```

**Após gerar:**
1. Copiar a Public Key
2. Copiar a Private Key
3. Adicionar a Vercel Environment Variables
4. Fazer git push para deploy

### Opção 2: Usar Node.js Diretamente

```bash
# Criar ficheiro gerar-keys.js
cat > gerar-keys.js << 'EOF'
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();

console.log('=== VAPID Keys ===');
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
console.log('\nGuarde estes valores de forma segura!');
EOF

# Executar
node gerar-keys.js

# Limpar ficheiro
rm gerar-keys.js
```

⚠️ **IMPORTANTE: Guarde as keys num local seguro. A Private Key é confidencial!**

---

## 🗄️ Configurar Supabase

### 1. Criar Tabelas

Aceda ao Supabase SQL Editor e execute:

```sql
-- Tabela de Subscrições Push
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  auth_key TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Logs de Notificações
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  recipients_count INTEGER,
  sent_count INTEGER,
  failed_count INTEGER,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_push_active ON push_subscriptions(is_active);
CREATE INDEX idx_push_endpoint ON push_subscriptions(endpoint);
CREATE INDEX idx_logs_sent_at ON notification_logs(sent_at);
```

### 2. Configurar Row Level Security (RLS)

```sql
-- Ativar RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de subscrição: Todos podem fazer INSERT, ninguém vê dados
CREATE POLICY "insert_own_subscription" ON push_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "no_select" ON push_subscriptions
  FOR SELECT USING (false);

-- Logs: Ninguém acessa via Supabase (dados confidenciais)
CREATE POLICY "no_access" ON notification_logs
  FOR ALL USING (false);
```

### 3. Obter Chaves de API

✅ **JÁ CONFIGURADO para Colégio Alfa e Omega:**

```
SUPABASE_URL = https://xpoysdrwvmamrtybiflj.supabase.co
SUPABASE_ANON_KEY = sb_publishable_f5TrSsgbVRptK1PINCmRag_tWmjDcIp
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ
```

**Dashboard:** https://xpoysdrwvmamrtybiflj.supabase.co

---

## 🚀 Configurar Vercel

### 1. Adicionar Environment Variables

**Status:** ✅ Supabase Configurado | ⏳ Aguardando VAPID Keys

No dashboard Vercel:
- **Settings → Environment Variables**
- Adicionar:

```
# ✅ SUPABASE (Já Configurado — 14 Abril 2026)
SUPABASE_URL = https://xpoysdrwvmamrtybiflj.supabase.co
SUPABASE_ANON_KEY = sb_publishable_f5TrSsgbVRptK1PINCmRag_tWmjDcIp
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ

# ⏳ VAPID Keys (Gerar Localmente — Próximo Passo)
NEXT_PUBLIC_VAPID_PUBLIC_KEY = [GERAR COM: web-push generate-vapid-keys]
VAPID_PRIVATE_KEY = [GERAR COM: web-push generate-vapid-keys]
```

**Como Adicionar em Vercel:**
1. Ir a https://vercel.com/dashboard
2. Selecionar o projeto
3. Settings → Environment Variables
4. Clicar "+ Add New"
5. Preencher "Name" (ex: SUPABASE_URL) e "Value" (ex: https://...)
6. Selecionar "Production" (ou todos)
7. Clicar "Save"

⚠️ **NOTA:** Aguarde gerar VAPID keys antes de adicionar as últimas 2 variáveis!

### 2. Instalar Dependencies no package.json

```json
{
  "dependencies": {
    "web-push": "^3.6.7",
    "@supabase/supabase-js": "^2.38.0"
  }
}
```

Ou via terminal:

```bash
npm install web-push @supabase/supabase-js
```

### 3. Deploy

```bash
git add .
git commit -m "feat: web push notifications setup"
git push origin main
```

Vercel deployer automaticamente. Verificar logs em **Deployments → Function Logs**.

---

## 🌐 Integrar no Website

### 1. Adicionar Meta Tag ao `<head>` (em cada página ou base template)

```html
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#01377d" />
</head>
```

### 2. Incluir Script no `<body>` (antes do </body>)

```html
<script src="/assets/js/push-notifications.js"></script>
```

### 3. Testar Subscrição no Console

```javascript
// No browser console
await PushNotifications.subscribeUser();

// Status
console.log(PushNotifications.getStatus());
```

### 4. Integrar UI (Exemplo: Botão de Subscrição)

```html
<button onclick="PushNotifications.subscribeUser()">
  Ativar Notificações 🔔
</button>

<button onclick="PushNotifications.unsubscribeUser()">
  Desativar Notificações
</button>

<button onclick="PushNotifications.sendTestNotification()">
  Teste de Notificação
</button>
```

---

## 🧪 Testar

### 1. Verificar Service Worker

```javascript
// Console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

### 2. Verificar Subscrição

```javascript
// Console
PushNotifications.getStatus();

// Output esperado:
// {
//   isSupported: true,
//   isSubscribed: true,
//   subscription: PushSubscription {...},
//   endpoint: "https://fcm.googleapis.com/..."
// }
```

### 3. Enviar Notificação Teste (Admin)

```bash
# Via cURL
curl -X POST https://seu-site.vercel.app/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste de Notificação",
    "body": "Se vê isto, tudo está funcionando! ✓",
    "data": { "url": "/tempo.html" }
  }'
```

Ou usar o **Dashboard de Notificações**: `/dashboard-push.html`

### 4. Teste em Modo Offline

1. Abrir DevTools (F12)
2. Application → Service Workers
3. Marcar "Offline"
4. Página deve continuar funcionando (cached)

---

## 🐛 Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Service Worker não carrega | Caminho incorreto | Verificar `/sw.js` existe e caminho em `push-notifications.js` é `/sw.js` |
| "Permission denied" | User recusou notification | Ir a Settings → Permissions → Notifications e permitir |
| Notificação não mostra | Navegador minimizado/closed | Abrir DevTools → Application → Service Workers e simular "Offline" |
| Erro 410 (Gone) | Subscription expirada | Remover automaticamente (já configurado no `send-notification.js`) |
| VAPID key invalid | Chave incorreta/expirada | Gerar nova com `web-push generate-vapid-keys` |
| CORS errors | Headers incorretos | Usar `/api/` routes (same-origin) |

### Debug Mode

Editar `push-notifications.js` e descomentar logs:

```javascript
// Mude:
console.log('[Push] ...');
// Para:
console.error('[Push] ...');  // Força visibilidade
```

---

## 📱 Fluxo Completo do Utilizador

```
1. Utilizador acede a www.colegioalfaeomega.com
   ↓
2. Browser carrega push-notifications.js
   ↓
3. Service Worker registado automaticamente
   ↓
4. Utilizador clica "Ativar Notificações"
   ↓
5. Browser pede permissão
   ↓
6. Se aceitar:
   - Subscrição criada no client
   - Enviada para /api/subscribe
   - Guardada em push_subscriptions (Supabase)
   ↓
7. Admin envia notificação via /dashboard-push.html
   ↓
8. POST para /api/send-notification
   ↓
9. Lê todas as subscrições ativas
   ↓
10. Envia push via web-push para cada uma
   ↓
11. Service Worker recebe evento 'push'
   ↓
12. Exibe notificação ao utilizador (mesmo com browser fechado!)
   ↓
13. Utilizador clica na notificação
   ↓
14. Abre página especificada em data.url
```

---

## 🔒 Segurança

### Best Practices

1. **Nunca expor Private Key**
   - Usar apenas em environment variables do servidor
   - Nunca comitar em Git

2. **Validar Requests**
   - Adicionar autenticação/authorization no dashboard
   - Rate limiting nas APIs

3. **HTTPS Obrigatório**
   - Web Push só funciona em HTTPS (Vercel fornece automaticamente)
   - Self-signed certificates não funcionam

4. **Consentimento Explícito**
   - Sempre pedir permissão de notificação
   - Permitir unsubscribe fácil

### Exemplo: Proteger Dashboard

```javascript
// No dashboard-push.html, antes de sendNotification():
const adminPassword = prompt('Digite a senha de admin:');
if (adminPassword !== 'sua_senha_segura') {
  showAlert('Acesso negado', 'error');
  return;
}
```

**Melhor:** Usar JWT tokens ou Supabase Auth.

---

## 📊 Monitoramento

### Verificar Estatísticas

```sql
-- Supabase SQL Editor
SELECT 
  COUNT(*) as total_subscriptions,
  COUNT(*) FILTER (WHERE is_active = true) as active_users
FROM push_subscriptions;

-- Notificações enviadas
SELECT title, sent_count, sent_at
FROM notification_logs
ORDER BY sent_at DESC
LIMIT 10;
```

---

## 📚 Recursos Úteis

- [MDN — Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Web-Push NPM Package](https://www.npmjs.com/package/web-push)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/draft-thomson-webpush-vapid)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions/runtimes)

---

## ✅ Checklist de Setup

- [ ] VAPID keys geradas
- [ ] Environment variables configuradas em Vercel
- [ ] Tabelas Supabase criadas
- [ ] RLS policies aplicadas
- [ ] Dependencies instaladas (`web-push`, `@supabase/supabase-js`)
- [ ] Service Worker (`sw.js`) no root
- [ ] `manifest.json` configurado
- [ ] `push-notifications.js` incluído
- [ ] `api/send-notification.js` deployado
- [ ] `api/subscribe.js` deployado
- [ ] `dashboard-push.html` acessível
- [ ] Teste de subscrição bem-sucedido
- [ ] Teste de notificação enviada
- [ ] Modo offline testado

---

**Data de Atualização:** 14 de Abril de 2026
**Versão:** 1.0
**Autor:** Telsio Isidoro — IT Professional
