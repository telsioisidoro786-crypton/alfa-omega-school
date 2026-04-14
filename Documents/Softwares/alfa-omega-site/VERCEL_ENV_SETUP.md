# ⚙️ Configurar Variáveis no Vercel

## Tuas VAPID Keys (Geradas 14 Abril 2026)

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY = BAlRMWBPr4wNIyn8UuGaJAcwmamMUIXk5EywUs4EhkaB1pxahdJRLjIVv30_aXalGIKCVt4xPwo-r2aIasuZMVs

VAPID_PRIVATE_KEY = h91pPi8RhDyCpz5b5GLbL3gQ_FHuNOguI9czCTGibaQ
```

⚠️ **IMPORTANTE:** Copia exatamente como aparece (sem espaços extras no início/fim)

---

## 📋 Passos para Vercel

### 1. Aceder ao Dashboard
👉 https://vercel.com/dashboard/alfa-omega-site/settings/environment-variables

### 2. Adicionar Primeira Variável (VAPID Public Key)

Clica **"+ Add New"**

**Campo 1 - Name:**
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY
```

**Campo 2 - Value:**
```
BAlRMWBPr4wNIyn8UuGaJAcwmamMUIXk5EywUs4EhkaB1pxahdJRLjIVv30_aXalGIKCVt4xPwo-r2aIasuZMVs
```

**Campo 3 - Environments:**
- ☑️ Production
- ☑️ Preview  
- ☑️ Development

Clica **"Save"**

✅ Primeira variável guardada!

---

### 3. Adicionar Segunda Variável (VAPID Private Key)

Clica **"+ Add New"** outra vez

**Campo 1 - Name:**
```
VAPID_PRIVATE_KEY
```

**Campo 2 - Value:**
```
h91pPi8RhDyCpz5b5GLbL3gQ_FHuNOguI9czCTGibaQ
```

**Campo 3 - Environments:**
- ☑️ Production
- ☑️ Preview
- ☑️ Development

Clica **"Save"**

✅ Segunda variável guardada!

---

### 4. Verificar Outras Variáveis

Confirma que **TAMBÉM** tens estas 3 (do setup anterior):

- ✅ `SUPABASE_URL` = https://xpoysdrwvmamrtybiflj.supabase.co
- ✅ `SUPABASE_ANON_KEY` = sb_publishable_f5TrSsgbVRptK1PINCmRag_tWmjDcIp
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = eyJ... (a key longa)

❌ Se faltam, adiciona também (mesmo processo acima)

---

## ✅ Checklist Vercel

- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY adicionada
- [ ] VAPID_PRIVATE_KEY adicionada
- [ ] Ambas têm Production ☑️
- [ ] SUPABASE_URL existe
- [ ] SUPABASE_ANON_KEY existe
- [ ] SUPABASE_SERVICE_ROLE_KEY existe
- [ ] **Total: 5 variáveis** visíveis na lista

---

## ⏳ Próximo Passo (Após Guardar)

Vercel faz redeploy **automático** em ~1-2 minutos.

1. Vai a **Deployments:** https://vercel.com/dashboard/alfa-omega-site/deployments
2. Procura a deploy mais recente
3. Espera que apareça status **"Ready ✓"** ou **"Verifying..."**

4️⃣ Depois segue [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md)

---

## 🆘 Se Lhe Custa a Guardar

- Verifica se copiastes o valor inteiro (sem espaços antes/depois)
- Tenta fazer refresh da página (Ctrl+R)
- Se erro persiste, tenta em browser diferente

