# 📖 Índice - Setup Web Push Notifications

## 🎯 Começa por Aqui

**Lê primeiro esto:** [SETUP_3PASSOS.md](SETUP_3PASSOS.md) (3-5 min)

Tem tudo condensado em 3 passos diretos.

---

## 📚 Documentação Completa

### 🚀 Guias de Setup

| Documento | Tempo | Conteúdo |
|-----------|-------|----------|
| [SETUP_3PASSOS.md](SETUP_3PASSOS.md) | 3 min | **COMENÇA AQUI** — 3 passos diretos |
| [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) | 5 min | Adicionar VAPID keys em Vercel |
| [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md) | 5 min | Criar/verificar tabelas Supabase |
| [TESTE_FINAL.md](TESTE_FINAL.md) | 10 min | Teste completo + troubleshooting |

### 📖 Referência & Debugging

| Documento | Tipo | O Que Tem |
|-----------|------|-----------|
| [API_REFERENCE.md](API_REFERENCE.md) | API Docs | Endpoints, payloads, response codes |
| [PUSH_NOTIFICATIONS_GUIDE.html](PUSH_NOTIFICATIONS_GUIDE.html) | Visual | Guia interactive + checklist |
| [VAPID_ERROR_RESOLVED.md](VAPID_ERROR_RESOLVED.md) | Debug | Erro "VAPID not configured" |
| [PUSH_NOTIFICATIONS_SETUP.md](PUSH_NOTIFICATIONS_SETUP.md) | Detalhado | Guia completo original (350+ linhas) |

### 🛠️ Ficheiros de Código

| Ficheiro | Tipo | Propósito |
|----------|------|-----------|
| `api/vapid-key.js` | API | GET endpoint para VAPID public key |
| `api/subscribe.js` | API | POST para guardar subscrições |
| `api/unsubscribe.js` | API | POST para remover subscrições |
| `api/send-notification.js` | API | POST para enviar notificações |
| `assets/js/push-notifications.js` | Frontend | Client-side subscription manager |
| `sw.js` | Service Worker | Ouve eventos push |
| `dashboard-push.html` | UI | Admin dashboard |
| `manifest.json` | PWA | Configuração progressive web app |
| [PUSH_NOTIFICATIONS.sql](PUSH_NOTIFICATIONS.sql) | Database | Schema + RLS policies |

---

## 🎯 Fluxo Recomendado

### Para Setup Inicial (Primeira Vez)
1. Lê [SETUP_3PASSOS.md](SETUP_3PASSOS.md) → 3 min
2. Segue [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) → 5 min
3. Segue [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md) → 5 min
4. Testa [TESTE_FINAL.md](TESTE_FINAL.md) → 10 min

**Total: ~25 minutos**

### Para Debugging
1. Se erro VAPID: [VAPID_ERROR_RESOLVED.md](VAPID_ERROR_RESOLVED.md)
2. Se erro 500 subscribe: [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md#troubleshooting)
3. Se notificação não aparece: [TESTE_FINAL.md](TESTE_FINAL.md#troubleshooting)

### Para Desenvolvimento Futuro
1. API Docs: [API_REFERENCE.md](API_REFERENCE.md)
2. Frontend: [assets/js/push-notifications.js](assets/js/push-notifications.js)
3. Backend: [api/send-notification.js](api/send-notification.js)

---

## 🔑 Informação da Configuração

**Projeto Supabase:**
- ID: `xpoysdrwvmamrtybiflj`
- URL: https://xpoysdrwvmamrtybiflj.supabase.co

**VAPID Keys (14 Abril 2026):**
```
Public:  BAlRMWBPr4wNIyn8UuGaJAcwmamMUIXk5EywUs4EhkaB1pxahdJRLjIVv30_aXalGIKCVt4xPwo-r2aIasuZMVs
Private: h91pPi8RhDyCpz5b5GLbL3gQ_FHuNOguI9czCTGibaQ
```

**Tabelas:**
- `push_subscriptions` — Guarda subscriptions dos utilizadores
- `notification_logs` — Histórico de notificações enviadas

---

## 📋 Checklist de Setup

- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY em Vercel
- [ ] VAPID_PRIVATE_KEY em Vercel
- [ ] SUPABASE_URL em Vercel
- [ ] SUPABASE_ANON_KEY em Vercel
- [ ] SUPABASE_SERVICE_ROLE_KEY em Vercel
- [ ] Tabela `push_subscriptions` criada em Supabase
- [ ] Tabela `notification_logs` criada em Supabase
- [ ] Vercel deployment ready
- [ ] Dashboard carrega sem erros
- [ ] `diagnosePushNotifications()` mostra isSupported: true
- [ ] Subscriber consegue ativar notificações
- [ ] Notificação de teste aparece no ecrã

---

## 🚀 Próximos Passos (Após Setup)

1. **Customizar Dashboard**
   - Branding (cores, logo)
   - Campos adicionais (destinatários, agendamento)

2. **Integrar com Sistema Existente**
   - Importar lista de contactos
   - Histórico de mensagens
   - Templates de notificações

3. **Analytics**
   - Dashboard de estatísticas
   - Taxa de entrega
   - Cliques em notificação

---

## 🆘 Precisa de Ajuda?

1. **Erro específico?** → Procura em [TESTE_FINAL.md](TESTE_FINAL.md#troubleshooting)
2. **Questão de API?** → Consulta [API_REFERENCE.md](API_REFERENCE.md)
3. **Não sabe por onde começar?** → Lê [SETUP_3PASSOS.md](SETUP_3PASSOS.md)

---

**Última atualização:** 14 Abril 2026

