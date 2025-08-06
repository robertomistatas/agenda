import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationSettingsProps {
  show: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ show, onClose }) => {
  const { permission, requestPermission } = useNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setTimeout(onClose, 2000); // Close after 2 seconds if successful
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: '✅',
          text: 'Notificaciones Activas',
          description: 'Recibirás recordatorios de tus reuniones',
          buttonText: 'Probar Notificación',
          action: () => {
            // Show test notification
            new Notification('🎉 Prueba Exitosa', {
              body: 'Las notificaciones están funcionando correctamente',
              icon: '/logo192.png'
            });
          }
        };
      case 'denied':
        return {
          icon: '❌',
          text: 'Notificaciones Bloqueadas',
          description: 'Habilita las notificaciones en la configuración del navegador',
          buttonText: 'Instrucciones',
          action: () => {
            alert(`Para habilitar notificaciones:
            
Chrome/Edge: Click en el ícono 🔒 o ⓘ junto a la URL → Notificaciones → Permitir
Firefox: Click en el ícono 🛡️ → Permisos → Notificaciones → Permitir
Safari: Safari → Preferencias → Sitios Web → Notificaciones → Permitir

Luego recarga la página.`);
          }
        };
      default:
        return {
          icon: '🔔',
          text: 'Activar Notificaciones',
          description: 'Recibe recordatorios automáticos de tus reuniones en cualquier dispositivo',
          buttonText: 'Activar Ahora',
          action: handleEnableNotifications
        };
    }
  };

  const status = getPermissionStatus();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">{status.icon}</div>
          <h2 className="text-xl font-bold text-primary mb-2">
            {status.text}
          </h2>
          <p className="text-gray-600 mb-6">
            {status.description}
          </p>

          {/* Device compatibility info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-primary mb-2">Compatibilidad</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="text-lg mb-1">💻</div>
                <div className="text-gray-600">Windows</div>
                <div className="text-green-500 text-xs">✓ Compatible</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">📱</div>
                <div className="text-gray-600">Android</div>
                <div className="text-green-500 text-xs">✓ Compatible</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">🍎</div>
                <div className="text-gray-600">iOS</div>
                <div className="text-orange-500 text-xs">⚠ Safari 16.4+</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Más Tarde
            </button>
            <button
              onClick={status.action}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {status.buttonText}
            </button>
          </div>

          {/* Additional tips */}
          <div className="mt-4 text-xs text-gray-500">
            💡 Las notificaciones funcionan incluso cuando la app está cerrada
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;
