// Service Worker for PWA functionality and Enhanced Notifications
const CACHE_NAME = 'mistatas-v1.1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force activation of new SW
  self.skipWaiting();
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages
  self.clients.claim();
});

// Enhanced notification display
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click received');
  
  const notification = event.notification;
  const action = event.action;
  
  notification.close();
  
  if (action === 'ok' || action === 'view' || !action) {
    // Open or focus the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            console.log('SW: Focusing existing window');
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          console.log('SW: Opening new window');
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('SW: Notification closed');
});

// Enhanced push event handling
self.addEventListener('push', (event) => {
  console.log('SW: Push event received');
  
  if (event.data) {
    const data = event.data.json();
    console.log('SW: Push data:', data);
    
    const title = data.notification?.title || data.title || 'Mistatas - Recordatorio';
    const options = {
      body: data.notification?.body || data.body || 'Tienes una reunión próxima',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: data.tag || 'mistatas-notification',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
      actions: [
        {
          action: 'view',
          title: '📅 Ver Agenda',
          icon: '/logo192.png'
        },
        {
          action: 'close',
          title: '❌ Cerrar'
        }
      ],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});
