/**
 * TEST API - Diagnosticar problemas Node.js
 * Path: /api/test.js
 * 
 * Endpoint de teste que mostra exatamente o que existe no runtime
 */

export default function handler(req, res) {
  console.log('[TEST] ========== START ==========');
  console.log('[TEST] Method:', req.method);

  if (req.method !== 'GET') {
    return res.status(200).json({ 
      test: 'Este endpoint responde a GET',
      method: req.method 
    });
  }

  try {
    console.log('[TEST] Checking environment variables...');
    
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.SUPABASE_URL ? '✓ EXISTS' : '✗ MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ EXISTS' : '✗ MISSING',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✓ EXISTS' : '✗ MISSING',
      VAPID_PUBLIC: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? '✓ EXISTS' : '✗ MISSING',
      VAPID_PRIVATE: process.env.VAPID_PRIVATE_KEY ? '✓ EXISTS' : '✗ MISSING',
    };

    console.log('[TEST] Environment:', env);

    // Tentar importar Supabase
    console.log('[TEST] Attempting to import Supabase...');
    let supabaseImport = 'NOT TESTED';
    
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseImport = '✓ IMPORT SUCCESS';
      
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const client = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        supabaseImport = '✓ CLIENT CREATED';
      }
    } catch (importError) {
      supabaseImport = `✗ ERROR: ${importError.message}`;
    }

    console.log('[TEST] Supabase Import:', supabaseImport);

    console.log('[TEST] ========== END (SUCCESS) ==========');

    return res.status(200).json({
      statusCode: 200,
      message: 'Test endpoint working ✓',
      environment: env,
      supabaseImport,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[TEST] ✗ EXCEPTION:', error.message);
    console.error('[TEST] ========== END (EXCEPTION) ==========');
    
    return res.status(500).json({
      statusCode: 500,
      error: 'Exception occurred',
      message: error.message,
      stack: error.stack,
    });
  }
}
