/**
 * HEALTH CHECK API - Diagnóstico Vercel
 * Path: /api/health.js
 * 
 * Endpoint ultra-simples para verificar se Vercel funciona
 */

export default function handler(req, res) {
  // Resposta imediata sem dependências
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoint: '/api/health',
    message: 'Server is running ✓',
  });
}
