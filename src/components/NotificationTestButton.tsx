import React from 'react';
import { motion } from 'framer-motion';

interface NotificationTestButtonProps {
  className?: string;
}

const NotificationTestButton: React.FC<NotificationTestButtonProps> = ({ className = '' }) => {
  const testNotification = () => {
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

    // Test browser notification (simple, without actions)
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('🧪 Testing simple notification...');
      
      const notification = new Notification('🧪 Prueba de Notificación - Mistatas', {
        body: `Fecha: ${dateString}\nHora: ${timeString}\n\n✅ Las notificaciones están funcionando correctamente`,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'test-notification',
        requireInteraction: true,
        timestamp: now.getTime(),
        vibrate: [200, 100, 200] // Vibration pattern for mobile
        // Note: No actions for simple notifications
      });

      // Handle notification click
      notification.onclick = () => {
        console.log('Test notification clicked');
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      console.log('✅ Test notification sent successfully');
    } else if (Notification.permission === 'denied') {
      alert('❌ Notificaciones bloqueadas\n\nPara habilitar:\n1. Haz clic en el ícono 🔒 junto a la URL\n2. Permite las notificaciones\n3. Recarga la página');
    } else {
      alert('⚠️ Permisos de notificación no otorgados\n\nPrimero activa las notificaciones usando el botón "Activar Notificaciones"');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={testNotification}
      className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${className}`}
    >
      <span className="text-lg">🧪</span>
      <span>Probar Notificación</span>
    </motion.button>
  );
};

export default NotificationTestButton;
