/**
 * Push Notifications Manager — Colégio Alfa e Omega
 * Frontend Logic (Vanilla JavaScript)
 * 
 * Responsáveis:
 * - Registar Service Worker
 * - Pedir permissão para notificações
 * - Subscrever utilizador (enviar para Supabase)
 * - Gerir state e recuperação de erros
 * 
 * Usage:
 * <script src="/assets/js/push-notifications.js"></script>
 */

const PushNotifications = {
  // Configuração
  config: {
    vapidPublicKey: null, // Será carregada do servidor
    serviceWorkerPath: '/sw.js',
    supabaseUrl: null,
    supabaseAnonKey: null,
  },

  // State
  state: {
    swRegistration: null,
    isSupported: false,
    isSubscribed: false,
    subscription: null,
  },

  /**
   * ============================================
   * INICIALIZAÇÃO
   * ============================================
   */

  /**
   * Inicializar e verificar suporte
   * @returns {Promise<boolean>}
   */
  async initialize(config = {}) {
    console.log('[Push] Initializing Push Notifications...');

    // Verificar suporte
    if (!this.checkBrowserSupport()) {
      console.warn('[Push] Browser does not support Service Workers or Push API');
      return false;
    }

    // Carregar configuração
    this.config = {
      ...this.config,
      ...config
    };

    try {
      // Carregar VAPID key do servidor se não fornecida
      if (!this.config.vapidPublicKey) {
        try {
          await this.loadVapidKey();
        } catch (vapidError) {
          console.error('[Push] VAPID key loading failed:', vapidError.message);
          console.error('[Push] Push Notifications will NOT work without VAPID key');
          return false; // Falha crítica
        }
      }

      // Registar Service Worker
      try {
        const swRegistration = await this.registerServiceWorker();
        if (!swRegistration) {
          console.error('[Push] ✗ Service Worker registration returned null');
          return false;
        }
      } catch (swError) {
        console.error('[Push] Service Worker registration failed:', swError.message);
        return false; // Falha crítica
      }

      // Apenas verificar subscription se SW está registado
      if (this.state.swRegistration) {
        try {
          await this.checkSubscriptionStatus();
        } catch (subError) {
          console.warn('[Push] Subscription status check failed (non-critical):', subError.message);
        }
      }

      this.state.isSupported = true;
      console.log('[Push] ✓ Push Notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('[Push] ✗ Unexpected initialization error:', error.message);
      console.error('[Push] Stack:', error.stack);
      return false;
    }
  },

  /**
   * Verificar suporte do browser
   */
  checkBrowserSupport() {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasPushAPI = 'PushManager' in window;
    const hasNotifications = 'Notification' in window;

    return hasServiceWorker && hasPushAPI && hasNotifications;
  },

  /**
   * Carregar VAPID key do servidor com fallback
   */
  async loadVapidKey() {
    try {
      // 1. Tentar carregar do servidor
      console.log('[Push] Attempting to load VAPID key from /api/vapid-key...');
      const response = await fetch('/api/vapid-key');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      this.config.vapidPublicKey = data.vapidPublicKey;
      console.log('[Push] ✓ VAPID key loaded from server');
      return;
    } catch (error) {
      console.warn('[Push] ⚠️  Failed to load VAPID key from server:', error.message);
      
      // 2. Fallback: Tentar localStorage (para desenvolvimento local)
      try {
        const cached = localStorage.getItem('debug_vapid_public_key');
        if (cached) {
          this.config.vapidPublicKey = cached;
          console.log('[Push] ✓ VAPID key loaded from localStorage (DEV MODE)');
          return;
        }
      } catch (e) {
        console.warn('[Push] localStorage unavailable');
      }
      
      // 3. Sem VAPID key - modo degradado
      console.warn('[Push] ⚠️  VAPID key not available - Push Notifications will not work');
      console.warn('[Push] Next steps:');
      console.warn('     1. Generate VAPID keys: npm install -g web-push && web-push generate-vapid-keys');
      console.warn('     2. Add to Vercel: NEXT_PUBLIC_VAPID_PUBLIC_KEY=<generated>');
      console.warn('     3. For DEV: localStorage.setItem("debug_vapid_public_key", "<key>");');
      
      throw new Error('VAPID key not configured. See console for setup instructions.');
    }
  },

  /**
   * Registar Service Worker
   */
  async registerServiceWorker() {
    try {
      console.log(`[Push] Attempting to register Service Worker from: ${this.config.serviceWorkerPath}`);
      
      const registration = await navigator.serviceWorker.register(this.config.serviceWorkerPath, {
        scope: '/',
      });

      this.state.swRegistration = registration;
      console.log('[Push] ✓ Service Worker registered:', registration.scope);
      console.log('[Push] Active:', !!registration.active);
      console.log('[Push] Installing:', !!registration.installing);

      // Atualizar a cada 6 horas
      setInterval(() => {
        registration.update();
      }, 6 * 60 * 60 * 1000);

      return registration;
    } catch (error) {
      console.error('[Push] ✗ Service Worker FAILED to register:', error.message);
      console.error('[Push] Error type:', error.name);
      console.error('[Push] Attempted path:', this.config.serviceWorkerPath);
      throw error;
    }
  },

  /**
   * ============================================
   * SUBSCRIÇÃO
   * ============================================
   */

  /**
   * Subscrever utilizador a notificações
   * @returns {Promise<PushSubscription>}
   */
  async subscribeUser() {
    console.log('[Push] Subscribing user...');

    try {
      // 0. Validar que Service Worker está registado
      if (!this.state.swRegistration) {
        throw new Error('Service Worker not registered. Please reload the page and try again.');
      }

      // 1. Pedir permissão se necessário
      if (Notification.permission === 'denied') {
        throw new Error('Notification permission denied');
      }

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Notification permission not granted');
        }
      }

      // 2. Obter push subscription
      const subscription = await this.state.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.config.vapidPublicKey),
      });

      console.log('[Push] Subscription created:', subscription);

      // 3. Enviar subscription para backend (Supabase)
      await this.saveSubscriptionToBackend(subscription);

      this.state.subscription = subscription;
      this.state.isSubscribed = true;

      // 4. Guardar em localStorage
      this.saveSubscriptionLocally(subscription);

      console.log('[Push] ✓ User subscribed successfully');
      return subscription;
    } catch (error) {
      console.error('[Push] Subscription error:', error);
      throw error;
    }
  },

  /**
   * Desinscrever utilizador
   */
  async unsubscribeUser() {
    console.log('[Push] Unsubscribing user...');

    try {
      if (!this.state.subscription) {
        throw new Error('No active subscription');
      }

      // Desinscrever do push manager
      await this.state.subscription.unsubscribe();
      console.log('[Push] Push unsubscribed');

      // Remover do backend
      await this.removeSubscriptionFromBackend(this.state.subscription);

      // Remover do localStorage
      localStorage.removeItem('ao_push_subscription');

      this.state.subscription = null;
      this.state.isSubscribed = false;

      console.log('[Push] ✓ User unsubscribed');
    } catch (error) {
      console.error('[Push] Unsubscription error:', error);
      throw error;
    }
  },

  /**
   * Verificar status de subscrição
   */
  async checkSubscriptionStatus() {
    try {
      // Validar que Service Worker está registado
      if (!this.state.swRegistration) {
        console.warn('[Push] Service Worker not registered yet, skipping subscription check');
        return;
      }

      const subscription = await this.state.swRegistration.pushManager.getSubscription();

      if (subscription) {
        this.state.subscription = subscription;
        this.state.isSubscribed = true;
        console.log('[Push] User is already subscribed:', subscription.endpoint);
      } else {
        // Tentar carregar do localStorage
        const cached = this.getSubscriptionLocally();
        if (cached) {
          console.log('[Push] Subscription cache found');
        }
      }
    } catch (error) {
      console.error('[Push] Error checking subscription:', error);
    }
  },

  /**
   * ============================================
   * BACKEND COMMUNICATION
   * ============================================
   */

  /**
   * Enviar subscription para Supabase
   */
  async saveSubscriptionToBackend(subscription) {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Push] Subscription saved to backend:', data);
      return data;
    } catch (error) {
      console.error('[Push] Error saving subscription:', error);
      throw error;
    }
  },

  /**
   * Remover subscription do Supabase
   */
  async removeSubscriptionFromBackend(subscription) {
    try {
      const endpoint = subscription.endpoint;

      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      console.log('[Push] Subscription removed from backend');
      return true;
    } catch (error) {
      console.error('[Push] Error removing subscription:', error);
      throw error;
    }
  },

  /**
   * ============================================
   * LOCAL STORAGE
   * ============================================
   */

  /**
   * Guardar subscription em localStorage
   */
  saveSubscriptionLocally(subscription) {
    try {
      localStorage.setItem('ao_push_subscription', JSON.stringify(subscription.toJSON()));
      console.log('[Push] Subscription saved to localStorage');
    } catch (error) {
      console.warn('[Push] Error saving to localStorage:', error);
    }
  },

  /**
   * Carregar subscription do localStorage
   */
  getSubscriptionLocally() {
    try {
      const cached = localStorage.getItem('ao_push_subscription');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('[Push] Error reading from localStorage:', error);
      return null;
    }
  },

  /**
   * ============================================
   * UTILIDADES
   * ============================================
   */

  /**
   * Converter VAPID key de Base64
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  },

  /**
   * Obter status atual
   */
  getStatus() {
    return {
      isSupported: this.state.isSupported,
      isSubscribed: this.state.isSubscribed,
      subscription: this.state.subscription,
      endpoint: this.state.subscription?.endpoint,
    };
  },

  /**
   * Pedir permissão manualmente
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('[Push] Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  /**
   * Test notification (debug)
   */
  async sendTestNotification() {
    try {
      if (!this.state.swRegistration) {
        throw new Error('Service Worker not registered');
      }

      await this.state.swRegistration.showNotification('Test Notification', {
        body: 'This is a test notification from Colégio Alfa e Omega',
        icon: '/assets/images/logo/icon-192.png',
        badge: '/assets/images/logo/icon-96.png',
        tag: 'test-notification',
      });

      console.log('[Push] Test notification sent');
    } catch (error) {
      console.error('[Push] Error sending test notification:', error);
    }
  },
};

/**
 * ============================================
 * AUTO-INITIALIZATION
 * ============================================
 */

// Inicializar ao carregar o DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PushNotifications.initialize();
  });
} else {
  PushNotifications.initialize();
}

// Exportar para casos de uso global
window.PushNotifications = PushNotifications;

console.log('[Push] Push Notifications module loaded');

/**
 * ============================================
 * DIAGNÓSTICO (para debugging)
 * ============================================
 */

// Função pública para diagnosticar problemas
window.diagnosePushNotifications = function() {
  console.log('=== DIAGNÓSTICO DE NOTIFICAÇÕES ===');
  console.log('1. Browser Support:');
  console.log('   - Service Worker:', 'serviceWorker' in navigator);
  console.log('   - Push Manager:', 'PushManager' in window);
  console.log('   - Notifications:', 'Notification' in window);
  console.log('   - Overall:', PushNotifications.checkBrowserSupport());
  
  console.log('2. Current State:');
  console.log('   - isSupported:', PushNotifications.state.isSupported);
  console.log('   - isSubscribed:', PushNotifications.state.isSubscribed);
  console.log('   - swRegistration:', PushNotifications.state.swRegistration);
  console.log('   - subscription:', PushNotifications.state.subscription);
  
  console.log('3. Configuration:');
  console.log('   - vapidPublicKey loaded:', !!PushNotifications.config.vapidPublicKey);
  console.log('   - serviceWorkerPath:', PushNotifications.config.serviceWorkerPath);
  
  console.log('4. Notification Permission:', Notification.permission);
  
  console.log('5. ServiceWorker Registration:');
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log('   - Total registrations:', registrations.length);
    registrations.forEach((reg, i) => {
      console.log(`   - Registration ${i}:`, {
        scope: reg.scope,
        active: !!reg.active,
        installing: !!reg.installing,
        waiting: !!reg.waiting,
      });
    });
  });
  
  console.log('=== FIM DO DIAGNÓSTICO ===');
};

// Função para development - adicionar VAPID key manualmente
window.setDevVapidKey = function(publicKey) {
  console.log('[Push] DEV MODE: Setting VAPID key from console...');
  localStorage.setItem('debug_vapid_public_key', publicKey);
  PushNotifications.config.vapidPublicKey = publicKey;
  console.log('[Push] ✓ VAPID key set. Now run: PushNotifications.initialize()');
};

console.log('[Push] Diagnóstico disponível: diagnosePushNotifications()');
