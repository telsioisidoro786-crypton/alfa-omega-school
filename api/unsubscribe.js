/**
 * API: Unsubscribe User
 * Path: /api/unsubscribe.js
 * Method: POST
 * 
 * Responsável por:
 * - Receber endpoint para remover
 * - Desativar subscrição no Supabase
 */

import { createClient } from '@supabase/supabase-js';

const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  // Usar SERVICE_ROLE_KEY para bypass de RLS (UPDATE/DELETE operações)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseKey);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    console.log('[API Unsubscribe] Removing subscription:', endpoint.substring(0, 50) + '...');

    const supabase = initSupabase();

    const { error } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('endpoint', endpoint);

    if (error) {
      console.error('[API Unsubscribe] Error:', error);
      return res.status(500).json({
        error: 'Failed to unsubscribe',
        details: error.message,
      });
    }

    console.log('[API Unsubscribe] ✓ Unsubscribed successfully');

    return res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully',
    });
  } catch (error) {
    console.error('[API Unsubscribe] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
