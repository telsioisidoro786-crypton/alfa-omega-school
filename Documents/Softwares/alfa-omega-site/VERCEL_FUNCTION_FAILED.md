# 📍 Vercel Function Failed - Próximos Passos

## 🔴 O Erro: FUNCTION_INVOCATION_FAILED

Isto significa que a função `/api/subscribe` **crashed no Node.js**.

Pode ser:
1. ❌ Erro ao fazer import (supabase-js não existe)
2. ❌ Variável de ambiente undefined
3. ❌ Erro no código (syntax error)
4. ❌ Erro de conexão Supabase

---

## 🎯 VER A MENSAGEM EXATA

Volta à página que mostraste e procura por **mais detalhes**:

1. **Clica no erro** (na linha POST /api/subscribe → 500)
2. Procura por uma seção chamada **"Logs"** ou **"Details"**
3. Procura por **stderr** ou **stdout**
4. Deve ver algo tipo:

```
TypeError: Cannot read property 'SUPABASE_URL' of undefined
```

ou

```
Module not found: @supabase/supabase-js
```

ou

```
Cannot access 'createClient' before initialization
```

**Copia essa mensagem exata e mostra-me.**

---

## 🚀 WORKAROUND: Criar Endpoint de Teste

Enquanto procuras a mensagem exata, vou criar um endpoint super-simples de teste:

