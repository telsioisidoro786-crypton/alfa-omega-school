/**
 * API: Subscribe User (VERSÃO SIMPLES - Sem RLS Issues)
 * Path: /api/subscribe-simple.js
 * 
 * Versão ultra-simplificada que contorna problemas de RLS
 * Usa logging detalhado para debug
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  console.log('[API Subscribe] ========== START ==========');
  console.log('[API Subscribe] Method:', req.method);
  console.log('[API Subscribe] Headers:', Object.keys(req.headers).join(', '));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log environment
  console.log('[API Subscribe] Environment Check:');
  console.log('[API Subscribe] - SUPABASE_URL:', process.env.SUPABASE_URL ? '✓' : '✗');
  console.log('[API Subscribe] - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');

  try {
    const { subscription, userAgent, timestamp } = req.body;

    console.log('[API Subscribe] Request body:', {
      hasSubscription: !!subscription,
      hasEndpoint: !!subscription?.endpoint,
      hasKeys: !!subscription?.keys,
    });

    if (!subscription?.endpoint) {
      console.error('[API Subscribe] ✗ Missing endpoint');
      return res.status(400).json({ error: 'Missing endpoint' });
    }

    if (!subscription?.keys?.auth || !subscription?.keys?.p256dh) {
      console.error('[API Subscribe] ✗ Missing keys', subscription?.keys);
      return res.status(400).json({ error: 'Missing subscription keys' });
    }

    // Desativar validação de URL de endpoint (às vezes traz problemas com URLs muito longas)
    const endpoint = subscription.endpoint;
    console.log('[API Subscribe] Endpoint:', endpoint.substring(0, 80) + '...');

    // Inicializar Supabase
    console.log('[API Subscribe] Initializing Supabase...');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[API Subscribe] ✗ Supabase credentials missing');
      return res.status(500).json({
        error: 'Server config error',
        details: 'Supabase credentials not configured',
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Tenta INSERT direto (sem SELECT check)
    console.log('[API Subscribe] Attempting INSERT...');
    
    const subscriptionData = {
      endpoint,
      auth_key: subscription.keys.auth,
      p256dh_key: subscription.keys.p256dh,
      user_agent: userAgent || 'unknown',
      is_active: true,
      subscribed_at: timestamp || new Date().toISOString(),
    };

    console.log('[API Subscribe] Data to insert:', {
      endpoint: endpoint.substring(0, 50) + '...',
      auth_key: subscription.keys.auth.substring(0, 20) + '...',
      p256dh_key: subscription.keys.p256dh.substring(0, 20) + '...',
    });

    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert([subscriptionData]);

    if (error) {
      console.error('[API Subscribe] ✗ INSERT FAILED');
      console.error('[API Subscribe] Error code:', error.code);
      console.error('[API Subscribe] Error message:', error.message);
      console.error('[API Subscribe] Error details:', error.details);
      console.error('[API Subscribe] Error hint:', error.hint);

      return res.status(500).json({
        error: 'Failed to save subscription',
        details: error.message,
        code: error.code,
        hint: error.hint,
      });
    }

    console.log('[API Subscribe] ✓ INSERT SUCCESS');
    console.log('[API Subscribe] ========== END (SUCCESS) ==========');

    return res.status(201).json({
      success: true,
      action: 'created',
      subscriptionId: data?.[0]?.id,
      message: 'Subscription saved successfully',
    });
  } catch (exception) {
    console.error('[API Subscribe] ✗ EXCEPTION:');
    console.error('[API Subscribe] Type:', exception.constructor.name);
    console.error('[API Subscribe] Message:', exception.message);
    console.error('[API Subscribe] Stack:', exception.stack);
    console.error('[API Subscribe] ========== END (EXCEPTION) ==========');

    return res.status(500).json({
      error: 'Unexpected error',
      details: exception.message,
      type: exception.constructor.name,
    });
  }
}
