// Service Worker para MisTatas - Agenda Empresarial
// Versión 2.0.0 - Soporte completo PWA con notificaciones robustas

const CACHE_NAME = 'mistatas-v2.0.0';
const CACHE_URLS = [
  '/agenda/',
  '/agenda/index.html',
  '/agenda/static/js/',
  '/agenda/static/css/',
  '/agenda/manifest.json',
  '/agenda/logo192.svg',
  '/agenda/logo512.svg',
  '/agenda/favicon.ico'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.0.0...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] App shell cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching app shell:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Estrategia de caché: Network First con fallback a caché
self.addEventListener('fetch', (event) => {
  // Solo manejar requests GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es exitosa, clona y guarda en caché
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, busca en caché
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Si no hay caché, devuelve página offline para navegación
            if (event.request.destination === 'document') {
              return caches.match('/agenda/index.html');
            }
          });
      })
  );
});

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  let notificationData = {
    title: 'MisTatas - Recordatorio',
    body: 'Tienes una reunión próxima',
    icon: '/agenda/logo192.svg',
    badge: '/agenda/logo192.svg',
    tag: 'meeting-reminder',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
    actions: [
      {
        action: 'view',
        title: '📅 Ver Detalles',
        icon: '/agenda/logo192.svg'
      },
      {
        action: 'dismiss',
        title: '❌ Descartar',
        icon: '/agenda/logo192.svg'
      }
    ],
    data: {
      url: '/agenda/',
      timestamp: Date.now()
    }
  };

  // Si hay datos del servidor, úsalos
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        ...payload,
        // Asegurar que siempre tenemos estas propiedades para Android
        icon: payload.icon || '/agenda/logo192.svg',
        badge: payload.badge || '/agenda/logo192.svg',
        requireInteraction: true,
        silent: false
      };
    } catch (error) {
      console.log('[SW] Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked, action:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Navegar a la aplicación
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const url = event.notification.data?.url || '/agenda/';
        
        // Si ya hay una ventana abierta, enfócala
        for (const client of clientList) {
          if (client.url.includes('/agenda/') && 'focus' in client) {
            console.log('[SW] Focusing existing window');
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abre una nueva
        if (clients.openWindow) {
          console.log('[SW] Opening new window:', url);
          return clients.openWindow(url);
        }
      })
  );
});

// Manejo de cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

// Función para sincronizar datos
async function syncData() {
  try {
    console.log('[SW] Syncing data...');
    
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now()
      });
    });
    
  } catch (error) {
    console.error('[SW] Error syncing data:', error);
  }
}

// Manejo de mensajes desde la aplicación
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
});

console.log('[SW] Service Worker v2.0.0 loaded successfully');
