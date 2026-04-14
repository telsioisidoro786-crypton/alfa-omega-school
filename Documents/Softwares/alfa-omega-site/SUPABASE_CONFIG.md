# Configuração Supabase — Colégio Alfa e Omega

## Credenciais do Projeto

```
Project ID: xpoysdrwvmamrtybiflj
Project URL: https://xpoysdrwvmamrtybiflj.supabase.co
Publishable Key (ANON): sb_publishable_f5TrSsgbVRptK1PINCmRag_tWmjDcIp
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ
```

## ✅ Próximos Passos

### 1. Executar SQL para Criar Tabelas

Aceder a: `https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql`

Copiar e colar todo o conteúdo de `PUSH_NOTIFICATIONS.sql` no SQL Editor e executar.

### 2. Configurar Vercel Environment Variables

1. Ir a: https://vercel.com/dashboard
2. Projeto → Settings → Environment Variables
3. Adicionar as seguintes variáveis:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY = [Gerar com: web-push generate-vapid-keys]
VAPID_PRIVATE_KEY = [Gerar com: web-push generate-vapid-keys]
SUPABASE_URL = https://xpoysdrwvmamrtybiflj.supabase.co
SUPABASE_ANON_KEY = sb_publishable_f5TrSsgbVRptK1PINCmRag_tWmjDcIp
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3lzZHJ3dm1hbXJ0eWJpZmxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxNjk4OSwiZXhwIjoyMDkwMzkyOTg5fQ.0aQ0zn3TpC2aqdu-OYdm18pjj9KhJTp0wkieWt7ivYQ
```

### 3. Gerar VAPID Keys

```bash
npm install -g web-push
web-push generate-vapid-keys

# Output:
# Public Key: BJOU...
# Private Key: R4nC...

# Copiar e colar em Vercel
```

### 4. Fazer Deploy

```bash
git add .
git commit -m "feat: configure supabase push notifications"
git push origin main
```

### 5. Testar

Aceder a: `https://seu-site.vercel.app/PUSH_NOTIFICATIONS_GUIDE.html`

---

## 🔗 Links Úteis

- **Dashboard Supabase:** https://xpoysdrwvmamrtybiflj.supabase.co
- **SQL Editor:** https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql
- **Tabelas:** https://xpoysdrwvmamrtybiflj.supabase.co/project/default/editor
- **Dashboard Notificações:** `/dashboard-push.html`

---

**Date:** 14 Abril 2026 | **Status:** ✅ Ready to Configure
