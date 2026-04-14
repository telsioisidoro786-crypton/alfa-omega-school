-- ============================================
-- NUCLEAR OPTION: Reset RLS Policies Completo
-- ============================================
-- USE ISTO APENAS SE TIVEREM PROBLEMAS COM POLÍTICAS
-- Droppa todas as policies e recria do zero

-- ============================================
-- 1. DROP POLICIES ANTIGAS
-- ============================================

DROP POLICY IF EXISTS "no_insert" ON push_subscriptions;
DROP POLICY IF EXISTS "no_update" ON push_subscriptions;
DROP POLICY IF EXISTS "no_delete" ON push_subscriptions;
DROP POLICY IF EXISTS "no_select" ON push_subscriptions;
DROP POLICY IF EXISTS "insert_own_subscription" ON push_subscriptions;
DROP POLICY IF EXISTS "no_access" ON notification_logs;
DROP POLICY IF EXISTS "allow_insert" ON push_subscriptions;
DROP POLICY IF EXISTS "allow_update" ON push_subscriptions;
DROP POLICY IF EXISTS "allow_delete" ON push_subscriptions;

-- ============================================
-- 2. ATIVAR RLS (Se já está ativado, não faz nada)
-- ============================================

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CRIAR POLICIES CORRETAS
-- ============================================

-- push_subscriptions: INSERT PERMISSIVO (qualquer um pode subscrever quando autenticado)
CREATE POLICY "allow_insert_for_all" ON push_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- push_subscriptions: UPDATE PERMISSIVO (backend pode atualizar)
CREATE POLICY "allow_update_via_service_role" ON push_subscriptions
  FOR UPDATE
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- push_subscriptions: DELETE PERMISSIVO (backend pode deletar)
CREATE POLICY "allow_delete_via_service_role" ON push_subscriptions
  FOR DELETE
  TO authenticated, service_role
  USING (true);

-- push_subscriptions: SELECT BLOQUEADO (dados sensíveis)
CREATE POLICY "block_select_push_subscriptions" ON push_subscriptions
  FOR SELECT
  USING (false);

-- notification_logs: BLOQUEADO PARA TODOS (apenas server read via SERVICE_ROLE_KEY)
CREATE POLICY "block_all_notification_logs" ON notification_logs
  FOR ALL
  USING (false);

-- ============================================
-- 4. VERIFICAR RESULTADO
-- ============================================

-- Listar todas as policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('push_subscriptions', 'notification_logs')
ORDER BY tablename, policyname;

-- ============================================
-- NOTA: Se viu "CREATE POLICY" 5 vezes sem erros,
-- as policies foram criadas com sucesso!
-- ============================================
