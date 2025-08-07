import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { requestNotificationPermission } from './firebase';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Request notification permission on app load
requestNotificationPermission();

// Register service worker for PWA (funciona en desarrollo y producción)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
      .then((registration) => {
        console.log('PWA Service Worker registered successfully:', registration.scope);
        
        // Verificar actualizaciones del Service Worker
        registration.addEventListener('updatefound', () => {
          console.log('Nueva versión del Service Worker disponible');
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Nueva versión del Service Worker instalada');
                // Opcional: notificar al usuario sobre la actualización
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('PWA Service Worker registration failed:', registrationError);
      });
  });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
