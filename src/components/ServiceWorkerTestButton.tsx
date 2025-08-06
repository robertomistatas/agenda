import React from 'react';
import { motion } from 'framer-motion';

interface ServiceWorkerTestButtonProps {
  className?: string;
}

const ServiceWorkerTestButton: React.FC<ServiceWorkerTestButtonProps> = ({ className = '' }) => {
  const testServiceWorkerNotification = async () => {
    console.log('🧪 Testing Service Worker notification...');
    
    if (!('serviceWorker' in navigator)) {
      alert('❌ Service Worker no soportado en este navegador');
      return;
    }

    if (Notification.permission !== 'granted') {
      alert('⚠️ Permisos de notificación no otorgados\n\nPrimero activa las notificaciones');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker ready:', registration);

      const now = new Date();
      const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      const dateString = now.toLocaleDateString('es-ES', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Show persistent notification with actions (through Service Worker)
      await registration.showNotification('🚀 Prueba Service Worker - Mistatas', {
        body: `Fecha: ${dateString}\nHora: ${timeString}\n\n✅ Notificación persistente con acciones`,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'sw-test-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200],
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
          url: '/',
          testNotification: true
        }
      });

      console.log('✅ Service Worker notification sent successfully');
    } catch (error) {
      console.error('❌ Error with Service Worker notification:', error);
      alert('❌ Error al mostrar notificación del Service Worker\n\nRevisa la consola para más detalles');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={testServiceWorkerNotification}
      className={`bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${className}`}
    >
      <span className="text-lg">🚀</span>
      <span>SW Test</span>
    </motion.button>
  );
};

export default ServiceWorkerTestButton;
