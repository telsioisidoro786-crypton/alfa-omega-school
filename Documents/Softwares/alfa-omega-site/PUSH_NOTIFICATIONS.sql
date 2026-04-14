-- ============================================
-- Web Push Notifications — SQL Setup
-- Colégio Alfa e Omega
-- ============================================

-- ============================================
-- 1. CRIAR TABELAS
-- ============================================

-- Tabela de Subscrições
CREATE TABLE IF NOT EXISTS push_subscriptions (
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
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  recipients_count INTEGER,
  sent_count INTEGER,
  failed_count INTEGER,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 2. CRIAR ÍNDICES (Performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_push_active 
  ON push_subscriptions(is_active);

CREATE INDEX IF NOT EXISTS idx_push_endpoint 
  ON push_subscriptions(endpoint);

CREATE INDEX IF NOT EXISTS idx_push_created 
  ON push_subscriptions(created_at);

CREATE INDEX IF NOT EXISTS idx_logs_sent_at 
  ON notification_logs(sent_at);

-- ============================================
-- 3. ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CRIAR POLICIES (Segurança)
-- ============================================

-- push_subscriptions: INSERT público (qualquer um pode subscrever)
CREATE POLICY "insert_own_subscription" ON push_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- push_subscriptions: SELECT bloqueado (dados privados)
CREATE POLICY "no_select" ON push_subscriptions
  FOR SELECT
  USING (false);

-- push_subscriptions: UPDATE permitido para todos (RLS bypass via SERVICE_ROLE_KEY no backend)
CREATE POLICY "allow_update" ON push_subscriptions
  FOR UPDATE
  USING (true);

-- push_subscriptions: DELETE permitido para todos (RLS bypass via SERVICE_ROLE_KEY no backend)
CREATE POLICY "allow_delete" ON push_subscriptions
  FOR DELETE
  USING (true);

-- notification_logs: Negado para todos (apenas server via SERVICE_ROLE_KEY)
CREATE POLICY "no_access" ON notification_logs
  FOR ALL
  USING (false);

-- ============================================
-- 5. CRIAR FUNÇÃO PARA AUTO-LIMPEZA
-- ============================================

-- Remover subscrições inutilizadas após 90 dias
CREATE OR REPLACE FUNCTION cleanup_old_subscriptions()
RETURNS void AS $$
BEGIN
  DELETE FROM push_subscriptions
  WHERE is_active = false
  AND unsubscribed_at < NOW() - INTERVAL '90 days';
  
  RAISE NOTICE 'Cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- Agendar limpeza (requer pg_cron extension)
-- SELECT cron.schedule('cleanup_subscriptions', '0 2 * * *', 
--   'SELECT cleanup_old_subscriptions()');

-- ============================================
-- 6. CRIAR TRIGGER PARA ATUALIZAR LAST_UPDATED
-- ============================================

CREATE OR REPLACE FUNCTION update_push_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER push_subscription_update_timestamp
BEFORE UPDATE ON push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_push_subscription_timestamp();

-- ============================================
-- 7. INSERIR DADOS DE TESTE (OPCIONAL)
-- ============================================

-- Descomente para testar
/*
INSERT INTO notification_logs (title, body, recipients_count, sent_count, failed_count)
VALUES 
  ('Teste 1', 'Mensagem de teste 1', 100, 98, 2),
  ('Teste 2', 'Mensagem de teste 2', 100, 100, 0);
*/

-- ============================================
-- 8. QUERIES ÚTEIS PARA MONITORAMENTO
-- ============================================

-- Contar subscrições ativas
-- SELECT COUNT(*) FROM push_subscriptions WHERE is_active = true;

-- Ver últimas notificações
-- SELECT title, sent_count, failed_count, sent_at FROM notification_logs ORDER BY sent_at DESC LIMIT 10;

-- Ver subscrições que falharam e foram removidas
-- SELECT COUNT(*) FROM push_subscriptions WHERE is_active = false;

-- Estatísticas gerais
-- SELECT 
--   COUNT(*) as total_subscriptions,
--   COUNT(*) FILTER (WHERE is_active = true) as active_users,
--   COUNT(*) FILTER (WHERE is_active = false) as inactive_users
-- FROM push_subscriptions;

-- ============================================
-- NOTA: Executar este script em Supabase SQL Editor
-- ============================================
