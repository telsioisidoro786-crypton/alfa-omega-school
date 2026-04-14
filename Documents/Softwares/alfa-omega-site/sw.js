/**
 * Service Worker — Colégio Alfa e Omega
 * Responsável por: Web Push Notifications, Cache, Offline Support
 * 
 * Features:
 * - Ouve eventos 'push' e exibe notificações
 * - Estratégia de cache (network-first com fallback)
 * - Sincronização em background
 */

const CACHE_NAME = 'alfa-omega-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/tempo.html',
  '/sobre.html',
  '/oferta.html',
  '/finalistas.html',
  '/galeria.html',
  '/olimpiadas.html',
  '/novidades.html',
  '/avisos.html',
  '/contactos.html',
  '/matriculas.html',
  '/quiz.html',
  '/assets/css/main.css',
  '/assets/css/animations.css',
  '/assets/js/main.js',
  '/assets/js/forms.js',
  '/assets/js/push-notifications.js',
  '/manifest.json'
];

/**
 * INSTALL EVENT
 * Pré-cachear assets essenciais
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - caching assets');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
        console.warn('[SW] Some assets could not be cached:', error);
      });
    })
  );
  self.skipWaiting(); // Ativar imediatamente
});

/**
 * ACTIVATE EVENT
 * Limpar caches antigos
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event - cleaning old caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Controlar todos os clientes
});

/**
 * FETCH EVENT
 * Estratégia: Network-first com fallback para cache
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições cross-origin e APIs
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Guardar em cache se for sucesso
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback para cache se offline
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline - Página não disponível', { status: 503 });
        });
      })
  );
});

/**
 * PUSH EVENT
 * Receber e exibir notificações push
 * ⚠️ CRÍTICO: Este evento é disparado mesmo com navegador fechado
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', event);

  // Dados da notificação
  let notificationData = {
    title: 'Colégio Alfa e Omega',
    body: 'Nova notificação da escola',
    icon: '/assets/images/logo/icon-192.png',
    badge: '/assets/images/logo/icon-96.png',
    tag: 'ao-notification',
    requireInteraction: false,
    data: {
      url: '/',
      timestamp: new Date().toISOString(),
    }
  };

  // Se há dados no push, fazer parse
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        title: pushData.title || notificationData.title,
        body: pushData.body || notificationData.body,
        icon: pushData.icon || notificationData.icon,
        badge: pushData.badge || notificationData.badge,
        tag: pushData.tag || notificationData.tag,
        requireInteraction: pushData.requireInteraction || false,
        data: {
          url: pushData.url || '/',
          timestamp: new Date().toISOString(),
          ...pushData.data
        }
      };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  // Mostrar notificação
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/assets/images/logo/icon-96.png'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    })
  );
});

/**
 * NOTIFICATION CLICK EVENT
 * Quando utilizador clica na notificação
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Abrir URL ou página principal
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Se já existe janela aberta, focar
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não existe, abrir nova
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

/**
 * NOTIFICATION CLOSE EVENT
 * Analytics quando utilizador fecha notificação
 */
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
  // Aqui pode enviar analytics
});

/**
 * PERIODIC BACKGROUND SYNC
 * (Opcional) Sincronizar dados periodicamente
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      fetch('/api/get-pending-syncs')
        .then((response) => response.json())
        .then((data) => {
          console.log('[SW] Synced data:', data);
        })
        .catch((error) => {
          console.error('[SW] Sync error:', error);
        })
    );
  }
});

/**
 * MESSAGE EVENT
 * Comunicação entre client e service worker
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: '1.0.0',
      status: 'active'
    });
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        event.ports[0].postMessage({ cleared: true });
      })
    );
  }
});

console.log('[SW] Service Worker loaded and ready');
