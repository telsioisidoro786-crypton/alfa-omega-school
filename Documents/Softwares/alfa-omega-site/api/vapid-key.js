/**
 * API: Get VAPID Key
 * Path: /api/vapid-key.js
 * Method: GET
 * 
 * Responsável por:
 * - Retornar a VAPID Public Key ao cliente
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.error('[API VAPID] VAPID key not configured');
      return res.status(500).json({
        error: 'VAPID key not configured',
      });
    }

    return res.status(200).json({
      vapidPublicKey,
    });
  } catch (error) {
    console.error('[API VAPID] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
