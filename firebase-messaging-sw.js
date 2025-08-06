// Firebase Cloud Messaging Service Worker
// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCS9fF81NIw-w6KecO6jefZUMOZQBFNFxU",
  authDomain: "agenda-f1799.firebaseapp.com",
  projectId: "agenda-f1799",
  storageBucket: "agenda-f1799.firebasestorage.app",
  messagingSenderId: "210697546824",
  appId: "1:210697546824:web:6b41e48f381c949790bc7d"
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Mistatas - Recordatorio';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una reunión próxima',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'meeting-reminder',
    requireInteraction: true,
    vibrate: [200, 100, 200], // Vibration pattern
    timestamp: Date.now(),
    actions: [
      {
        action: 'view',
        title: '📅 Ver Agenda',
        icon: '/logo192.png'
      },
      {
        action: 'dismiss',
        title: '❌ Cerrar'
      }
    ],
    data: {
      ...payload.data,
      url: '/'
    }
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === self.location.origin + '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
  // 'dismiss' action just closes the notification (default behavior)
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});
