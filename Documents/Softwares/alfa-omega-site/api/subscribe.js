/**
 * API: Subscribe User
 * Path: /api/subscribe.js
 * Method: POST
 * 
 * Responsável por:
 * - Receber subscrição do cliente
 * - Guardar na tabela push_subscriptions do Supabase
 * - Retornar confirmação
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js');

const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  // Usar SERVICE_ROLE_KEY para bypass de RLS
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseKey);
};

module.exports = async function handler(req, res) {
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, userAgent, timestamp } = req.body;

    // Validar input
    if (!subscription || !subscription.endpoint) {
      console.error('[API Subscribe] Invalid subscription data:', subscription);
      return res.status(400).json({
        error: 'Invalid subscription data',
        details: 'subscription.endpoint is required',
      });
    }

    console.log('[API Subscribe] New subscription:', {
      endpoint: subscription.endpoint.substring(0, 50) + '...',
      hasKeys: !!subscription.keys,
      timestamp,
    });

    // Validar VAPID keys
    if (!subscription.keys || !subscription.keys.auth || !subscription.keys.p256dh) {
      console.error('[API Subscribe] Missing VAPID keys:', subscription.keys);
      return res.status(400).json({
        error: 'Invalid subscription keys',
        details: 'subscription.keys must have auth and p256dh',
      });
    }

    // Inicializar Supabase
    const supabase = initSupabase();

    // Checar se já existe
    const { data: existing, error: checkError } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscription.endpoint)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (esperado)
      console.error('[API Subscribe] Error checking subscription:', checkError);
    }

    if (existing) {
      // Atualizar subscrição existente
      console.log('[API Subscribe] Updating existing subscription:', existing.id);
      const { error: updateError } = await supabase
        .from('push_subscriptions')
        .update({
          endpoint: subscription.endpoint,
          auth_key: subscription.keys.auth,
          p256dh_key: subscription.keys.p256dh,
          user_agent: userAgent,
          is_active: true,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('[API Subscribe] Error updating subscription:', updateError);
        return res.status(500).json({
          error: 'Failed to update subscription',
          details: updateError.message,
          code: updateError.code,
        });
      }

      console.log('[API Subscribe] ✓ Subscription updated:', existing.id);
      return res.status(200).json({
        success: true,
        action: 'updated',
        subscriptionId: existing.id,
      });
    }

    // Inserir nova subscrição
    console.log('[API Subscribe] Inserting new subscription');
    const { data, error } = await supabase.from('push_subscriptions').insert([
      {
        endpoint: subscription.endpoint,
        auth_key: subscription.keys.auth,
        p256dh_key: subscription.keys.p256dh,
        user_agent: userAgent,
        is_active: true,
        subscribed_at: timestamp || new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('[API Subscribe] Error inserting subscription:', error);
      console.error('[API Subscribe] Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return res.status(500).json({
        error: 'Failed to save subscription',
        details: error.message,
        code: error.code,
      });
    }

    console.log('[API Subscribe] ✓ New subscription saved');

    return res.status(201).json({
      success: true,
      action: 'created',
      subscriptionId: data?.[0]?.id,
      message: 'Subscription saved successfully',
    });
  } catch (error) {
    console.error('[API Subscribe] Unexpected error:', error);
    console.error('[API Subscribe] Error stack:', error.stack);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
