import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePWAComplete } from '../hooks/usePWAManager';

const Configuraciones: React.FC = () => {
  const { notifications, pwa, setupComplete } = usePWAComplete();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    // Verificar tema actual
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleCompleteSetup = async () => {
    setIsSettingUp(true);
    try {
      const success = await setupComplete();
      if (success) {
        console.log('Setup PWA completado exitosamente');
      }
    } catch (error) {
      console.error('Error en setup:', error);
    } finally {
      setIsSettingUp(false);
    }
  };

  const getInstallButtonText = () => {
    if (pwa.installState.installed) {
      return '✅ App Instalada';
    }
    if (pwa.installState.canInstall) {
      return '📱 Instalar App';
    }
    if (pwa.installState.platform === 'ios') {
      return '📱 Instalar (Safari → Compartir → Añadir a inicio)';
    }
    return '📱 Instalación no disponible';
  };

  const getNotificationStatus = () => {
    if (notifications.permission.granted) {
      return { icon: '✅', text: 'Notificaciones Habilitadas', color: 'text-green-600 dark:text-green-400' };
    }
    if (notifications.permission.denied) {
      return { icon: '❌', text: 'Notificaciones Bloqueadas', color: 'text-red-600 dark:text-red-400' };
    }
    return { icon: '⚠️', text: 'Permisos No Solicitados', color: 'text-yellow-600 dark:text-yellow-400' };
  };

  const notificationStatus = getNotificationStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2EAE2] to-[#DDD6C7] dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            ⚙️ Configuraciones
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Personaliza tu experiencia con MisTatas
          </p>

          {/* Setup Completo PWA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-[#184347] to-[#2a5f65] rounded-xl p-6 mb-6 text-white"
          >
            <h2 className="text-xl font-bold mb-3">🚀 Configuración Rápida PWA</h2>
            <p className="mb-4 opacity-90">
              Configura notificaciones e instalación con un solo clic
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteSetup}
              disabled={isSettingUp}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSettingUp ? '⏳ Configurando...' : '🔧 Configurar Todo'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Notificaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            🔔 Notificaciones
          </h2>
          
          <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{notificationStatus.icon}</span>
              <span className={`font-semibold ${notificationStatus.color}`}>
                {notificationStatus.text}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {!notifications.permission.granted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={notifications.requestPermission}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔔 Habilitar Notificaciones
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={notifications.sendTestNotification}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🧪 Probar Notificación
              </motion.button>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Recordatorios Automáticos
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Recibe notificaciones antes de tus reuniones
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => notifications.scheduleReminder(
                  '📅 Recordatorio de Prueba',
                  'Esta es una notificación de prueba programada',
                  5000 // 5 segundos
                )}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ⏰ Probar en 5s
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Instalación PWA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            📱 Instalación de App
          </h2>
          
          <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Estado de la App
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Plataforma: {pwa.installState.platform}
                </p>
              </div>
              <div className="text-right">
                {pwa.installState.installed && (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    ✅ Instalada
                  </span>
                )}
                {pwa.installState.canInstall && !pwa.installState.installed && (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    📱 Disponible
                  </span>
                )}
              </div>
            </div>

            {(pwa.installState.canInstall || pwa.installState.platform === 'ios') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pwa.install}
                disabled={pwa.installState.installed || pwa.installState.platform === 'ios'}
                className="bg-[#184347] hover:bg-[#2a5f65] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {getInstallButtonText()}
              </motion.button>
            )}

            {pwa.installState.platform === 'ios' && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>En iOS Safari:</strong> Toca el botón Compartir (⬆️) y luego "Añadir a la pantalla de inicio"
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tema y Personalización */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            🎨 Personalización
          </h2>
          
          <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Tema Oscuro
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cambia entre tema claro y oscuro
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`w-16 h-8 rounded-full p-1 transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            🔧 Diagnóstico y Soporte
          </h2>
          
          <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4">
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Verifica el estado de la PWA y las notificaciones
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/agenda/#/diagnostico'}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              🔍 Abrir Diagnóstico
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Configuraciones;
