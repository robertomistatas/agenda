import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePWAComplete } from '../hooks/usePWAManager';
import { useNavigate } from 'react-router-dom';

const Configuraciones: React.FC = () => {
  const { notifications, pwa, setupComplete } = usePWAComplete();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRequestingNotifications, setIsRequestingNotifications] = useState(false);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar tema actual
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const handleCompleteSetup = async () => {
    setIsSettingUp(true);
    try {
      console.log('Iniciando configuración completa...');
      
      // Verificar que todas las funciones estén disponibles
      if (!notifications || !pwa || !setupComplete) {
        throw new Error('Servicios PWA no disponibles');
      }

      // Ejecutar la configuración completa
      const result = await setupComplete();
      
      if (result) {
        alert('¡Configuración completada exitosamente! Tu aplicación PWA está lista.');
      } else {
        alert('Error en la configuración. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en configuración completa:', error);
      alert(`Error al completar la configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleRequestPermissions = async () => {
    setIsRequestingNotifications(true);
    try {
      console.log('Solicitando permisos de notificación...');
      
      if (!notifications?.requestPermission) {
        throw new Error('Función de permisos no disponible');
      }

      const result = await notifications.requestPermission();
      
      if (result) {
        alert('¡Permisos de notificación habilitados correctamente!');
      } else {
        alert('Error al solicitar permisos. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      alert(`Error al habilitar notificaciones: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsRequestingNotifications(false);
    }
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    try {
      console.log('Enviando notificación de prueba...');
      
      if (!notifications?.sendTestNotification) {
        throw new Error('Función de notificación de prueba no disponible');
      }

      const result = await notifications.sendTestNotification();
      
      if (result) {
        alert('¡Notificación de prueba enviada! Verifica tu dispositivo.');
      } else {
        alert('Error al enviar notificación. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      alert(`Error al enviar notificación de prueba: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleOpenDiagnostic = () => {
    console.log('Navegando a diagnóstico...');
    navigate('/diagnostico');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ⚙️ Configuraciones PWA
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona la configuración de tu Aplicación Web Progresiva
          </p>
        </motion.div>

        {/* PWA Setup Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            🚀 Configuración Inicial
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteSetup}
              disabled={isSettingUp}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isSettingUp
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                {isSettingUp ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
                  <span className="text-3xl">✅</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isSettingUp ? 'Configurando...' : 'Configurar Todo'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Configura automáticamente todas las funciones PWA
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRequestPermissions}
              disabled={isRequestingNotifications}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isRequestingNotifications
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-600 dark:bg-green-900 dark:hover:bg-green-800'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                {isRequestingNotifications ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                ) : (
                  <span className="text-3xl">🔔</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isRequestingNotifications ? 'Habilitando...' : 'Habilitar Notificaciones'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Solicita permisos para recibir notificaciones
              </p>
            </motion.button>
          </div>

          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTestNotification}
              disabled={isTestingNotification}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                isTestingNotification
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-purple-300 bg-purple-50 hover:bg-purple-100 dark:border-purple-600 dark:bg-purple-900 dark:hover:bg-purple-800'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                {isTestingNotification ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                ) : (
                  <span className="text-3xl">🧪</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {isTestingNotification ? 'Enviando...' : 'Probar Notificación'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Envía una notificación de prueba
              </p>
            </motion.button>
          </div>
        </motion.div>

        {/* Theme Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            🎨 Tema y Personalización
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Modo Oscuro</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cambia entre tema claro y oscuro
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Diagnostic Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            🔍 Diagnóstico
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenDiagnostic}
            className="w-full p-4 rounded-lg border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 dark:border-orange-600 dark:bg-orange-900 dark:hover:bg-orange-800 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl">🩺</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Abrir Diagnóstico
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Verifica el estado de todas las funciones PWA
            </p>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Configuraciones;
