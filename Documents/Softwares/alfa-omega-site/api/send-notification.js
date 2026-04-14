/**
 * API: Send Notifications
 * Path: /api/send-notification.js
 * Method: POST
 * 
 * Responsável por:
 * - Ler subscrições do Supabase
 * - Enviar push notifications via web-push
 * - Tratar erros (410 Gone, 404 Not Found) e remover subscrições inválidas
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_VAPID_PUBLIC_KEY
 * - VAPID_PRIVATE_KEY
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

// Dependencies
const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

// Configurar web-push com VAPID keys
const configureWebPush = () => {
  const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  };

  if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
    throw new Error('VAPID keys not configured in environment');
  }

  webpush.setVapidDetails(
    'mailto:admin@colegioalfaeomega.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  console.log('[API] Web-push configured with VAPID keys');
};

// Inicializar Supabase
const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(supabaseUrl, supabaseKey);
};

/**
 * Handler da API
 */
export default async function handler(req, res) {
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, data, recipients } = req.body;

    // Validar input
    if (!title || !body) {
      return res.status(400).json({
        error: 'Missing required fields: title, body',
      });
    }

    console.log('[API] Sending notification:', { title, body });

    // Configurar web-push
    configureWebPush();

    // Inicializar Supabase
    const supabase = initSupabase();

    // 1. Buscar subscrições do banco de dados
    let subscriptions;

    if (recipients && recipients.length > 0) {
      // Enviar para recipients específicos
      const { data: subs, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .in('user_id', recipients);

      if (error) {
        console.error('[API] Error fetching subscriptions:', error);
        return res.status(500).json({
          error: 'Failed to fetch subscriptions',
          details: error.message,
        });
      }

      subscriptions = subs;
    } else {
      // Enviar para todos os subscritos
      const { data: subs, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('[API] Error fetching subscriptions:', error);
        return res.status(500).json({
          error: 'Failed to fetch subscriptions',
          details: error.message,
        });
      }

      subscriptions = subs;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[API] No active subscriptions found');
      return res.status(200).json({
        success: true,
        sent: 0,
        failed: 0,
        message: 'No subscriptions to send to',
      });
    }

    console.log(`[API] Found ${subscriptions.length} subscriptions`);

    // 2. Preparar payload
    const notificationPayload = JSON.stringify({
      title,
      body,
      icon: '/assets/images/logo/icon-192.png',
      badge: '/assets/images/logo/icon-96.png',
      tag: 'ao-notification',
      data: {
        url: data?.url || '/',
        timestamp: new Date().toISOString(),
        ...data,
      },
    });

    // 3. Enviar notificações e tratar erros
    let sent = 0;
    let failed = 0;
    const failedSubscriptions = [];

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth_key,
            p256dh: sub.p256dh_key,
          },
        };

        // Enviar push
        await webpush.sendNotification(pushSubscription, notificationPayload);

        sent++;
        console.log(`[API] ✓ Notification sent to ${sub.endpoint.substring(0, 50)}...`);
      } catch (error) {
        failed++;
        console.error(`[API] ✗ Error sending to ${sub.endpoint.substring(0, 50)}...`, {
          status: error.statusCode,
          message: error.message,
        });

        // Tratar erros específicos
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(
            `[API] Removing invalid subscription (${error.statusCode}): ${sub.id}`
          );
          failedSubscriptions.push(sub.id);
        }
      }
    });

    // Aguardar todas as operações
    await Promise.all(sendPromises);

    // 4. Remover subscrições inválidas (410 Gone, 404 Not Found)
    if (failedSubscriptions.length > 0) {
      const { error: deleteError } = await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', failedSubscriptions);

      if (deleteError) {
        console.error('[API] Error deleting invalid subscriptions:', deleteError);
      } else {
        console.log(`[API] Removed ${failedSubscriptions.length} invalid subscriptions`);
      }
    }

    // 5. Log de transação
    const { error: logError } = await supabase.from('notification_logs').insert([
      {
        title,
        body,
        recipients_count: subscriptions.length,
        sent_count: sent,
        failed_count: failed,
        sent_at: new Date().toISOString(),
      },
    ]);

    if (logError) {
      console.warn('[API] Error logging notification:', logError);
    }

    // 6. Response
    return res.status(200).json({
      success: true,
      sent,
      failed,
      total: subscriptions.length,
      removed: failedSubscriptions.length,
      message: `Notification sent to ${sent}/${subscriptions.length} users`,
    });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return res.status(500).json({
      error: 'Failed to send notification',
      details: error.message,
    });
  }
}
