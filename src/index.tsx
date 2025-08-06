import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { requestNotificationPermission } from './firebase';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Request notification permission on app load
requestNotificationPermission();

// Register service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
      .then((registration) => {
        console.log('PWA Service Worker registered successfully');
      })
      .catch((registrationError) => {
        console.log('PWA Service Worker registration failed:', registrationError);
      });
  });
} else if (process.env.NODE_ENV === 'development') {
  console.log('Service Worker registration skipped in development mode');
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
