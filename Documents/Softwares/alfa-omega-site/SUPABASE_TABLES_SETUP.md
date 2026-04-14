# 🗄️ Setup Tabelas Supabase

## ✅ Passo 1: Verificar se Tabelas Existem

1. **Aceder ao Supabase:**
   👉 https://xpoysdrwvmamrtybiflj.supabase.co

2. **Abrir SQL Editor:**
   - Lado esquerdo → clica **"SQL Editor"**
   - Clica **"New Query"**

3. **Verificar Tabelas:**
   Cola este comando:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

4. **Clica ▶ Run**

---

## 📊 Resultado Esperado

Deve ver na resposta:
```
table_name
─────────────────────
notification_logs
push_subscriptions
```

### ✅ Se Aparecem Ambas
Parabéns! As tabelas já existem. 

→ Vai para **[TESTE FINAL](#teste-final)**

### ❌ Se Não Aparecem (ou aparecem vazias)
Precisa criar as tabelas. Segue passo 2.

---

## 🛠️ Passo 2: Criar Tabelas (Se Faltam)

### 2a. Copiar SQL

Abre este ficheiro no editor:
📄 [PUSH_NOTIFICATIONS.sql](PUSH_NOTIFICATIONS.sql)

Copia **TODO O CONTEÚDO** (Ctrl+A → Ctrl+C)

---

### 2b. Colar em Supabase

1. **SQL Editor → New Query**
2. **Cola o SQL** (Ctrl+V)
3. **Clica ▶ Run**

⏳ Aguarda completar (deve dizer "Completed in Xs")

---

### 2c. Verificar

Executa o comando de verificação novamente:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

✅ Deve agora aparecer ambas as tabelas!

---

## 🧪 Teste Final

Depois de tabelas criadas/confirmadas:

1. **Reload do site:**
   https://www.colegioalfaeomega.com/dashboard-push.html
   
   (Hard refresh: Ctrl+Shift+R)

2. **Abre Console (F12)**

3. **Verifica status:**
   ```javascript
   diagnosePushNotifications()
   ```

4. **Tenta subscrever:**
   Clica em "🔔 Ativar Notificações"

✅ **Esperado:** "Notificações ativadas! ✓"

❌ **Se erro 500 persiste:** Vê [TROUBLESHOOTING](#troubleshooting)

---

## 🆘 Troubleshooting

### Erro: "Backend error: 500"

**Causas possíveis:**

1. **Tabelas não criadas**
   → Volta ao Passo 2 e executa o SQL

2. **Variáveis de ambiente ausentes/erradas**
   → Verifica [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
   → Redeploy: vai a Deployments e força novo deploy

3. **Vercel logs**
   → https://vercel.com/dashboard/alfa-omega-site/deployments
   → Clica deployment mais recente
   → Vai a "Functions"
   → Ve log de `/api/subscribe`

4. **RLS Policies bloqueando**
   → Em Supabase, vai a Table Editor
   → `push_subscriptions` → clica RLS
   → Certifica que está **ativado** (se está "Enforce policies" = ON)

---

## ✅ Checklist Supabase

- [ ] Acedi a https://xpoysdrwvmamrtybiflj.supabase.co
- [ ] Abri SQL Editor
- [ ] Verifiquei se `push_subscriptions` existe
- [ ] Verifiquei se `notification_logs` existe
- [ ] Se faltavam, executei o PUSH_NOTIFICATIONS.sql
- [ ] Reloadei o dashboard-push.html
- [ ] Testei subscrevendo

---

## 🔗 Links Rápidos

- **Supabase Dashboard:** https://xpoysdrwvmamrtybiflj.supabase.co
- **SQL Editor:** https://xpoysdrwvmamrtybiflj.supabase.co/project/default/sql
- **Table Editor:** https://xpoysdrwvmamrtybiflj.supabase.co/project/default/editor
- **Vercel Deployments:** https://vercel.com/dashboard/alfa-omega-site/deployments

---

## 💡 Próximos Passos

1. ✅ Setup Vercel env vars → [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
2. ✅ Setup Tabelas Supabase → **Este ficheiro**
3. ✅ Teste final → [TESTE_FINAL.md](TESTE_FINAL.md) *(em breve)*

