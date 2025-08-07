import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePWAComplete } from '../hooks/usePWAManager';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  message: string;
  details?: string;
}

const DiagnosticoPWA: React.FC = () => {
  const { notifications, pwa, setupComplete } = usePWAComplete();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'partial' | 'success' | 'error'>('pending');

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: Soporte PWA básico
    try {
      const hasSW = 'serviceWorker' in navigator;
      const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
      
      if (hasSW && hasManifest) {
        results.push({
          test: 'Soporte PWA',
          status: 'success',
          message: 'Service Worker y Manifest detectados',
          details: `SW: ${hasSW}, Manifest: ${hasManifest}`
        });
      } else {
        results.push({
          test: 'Soporte PWA',
          status: 'error',
          message: 'Faltan componentes PWA básicos',
          details: `SW: ${hasSW}, Manifest: ${hasManifest}`
        });
      }
    } catch (error) {
      results.push({
        test: 'Soporte PWA',
        status: 'error',
        message: 'Error verificando PWA',
        details: String(error)
      });
    }

    // Test 2: Service Worker
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        results.push({
          test: 'Service Worker',
          status: 'success',
          message: 'Service Worker registrado y activo',
          details: `Scope: ${registration.scope}`
        });
      } else {
        results.push({
          test: 'Service Worker',
          status: 'warning',
          message: 'Service Worker no registrado',
          details: 'Intenta recargar la página'
        });
      }
    } catch (error) {
      results.push({
        test: 'Service Worker',
        status: 'error',
        message: 'Error verificando Service Worker',
        details: String(error)
      });
    }

    // Test 3: Notificaciones
    try {
      const notificationSupport = 'Notification' in window;
      const permission = notifications.permission;
      
      if (notificationSupport) {
        if (permission.granted) {
          results.push({
            test: 'Notificaciones',
            status: 'success',
            message: 'Notificaciones habilitadas',
            details: 'Permisos concedidos correctamente'
          });
        } else if (permission.denied) {
          results.push({
            test: 'Notificaciones',
            status: 'error',
            message: 'Notificaciones bloqueadas',
            details: 'Necesitas habilitar notificaciones en configuración del navegador'
          });
        } else {
          results.push({
            test: 'Notificaciones',
            status: 'warning',
            message: 'Permisos no solicitados',
            details: 'Usa el botón para solicitar permisos'
          });
        }
      } else {
        results.push({
          test: 'Notificaciones',
          status: 'error',
          message: 'Notificaciones no soportadas',
          details: 'Este navegador no soporta notificaciones'
        });
      }
    } catch (error) {
      results.push({
        test: 'Notificaciones',
        status: 'error',
        message: 'Error verificando notificaciones',
        details: String(error)
      });
    }

    // Test 4: Instalabilidad PWA
    try {
      const platform = pwa.installState.platform;
      const canInstall = pwa.installState.canInstall;
      const isInstalled = pwa.installState.installed;

      if (isInstalled) {
        results.push({
          test: 'Instalación PWA',
          status: 'success',
          message: 'App ya está instalada',
          details: `Plataforma: ${platform}`
        });
      } else if (canInstall) {
        results.push({
          test: 'Instalación PWA',
          status: 'success',
          message: 'App puede ser instalada',
          details: `Plataforma: ${platform}, usa el botón de instalación`
        });
      } else {
        results.push({
          test: 'Instalación PWA',
          status: 'warning',
          message: 'Instalación no disponible actualmente',
          details: `Plataforma: ${platform}, recarga la página si es necesario`
        });
      }
    } catch (error) {
      results.push({
        test: 'Instalación PWA',
        status: 'error',
        message: 'Error verificando instalación',
        details: String(error)
      });
    }

    // Test 5: Conexión de red
    try {
      const online = navigator.onLine;
      const connection = (navigator as any).connection;
      
      if (online) {
        results.push({
          test: 'Conectividad',
          status: 'success',
          message: 'Conexión a internet activa',
          details: connection ? `Tipo: ${connection.effectiveType}` : 'Detalles no disponibles'
        });
      } else {
        results.push({
          test: 'Conectividad',
          status: 'warning',
          message: 'Sin conexión a internet',
          details: 'La app debería funcionar offline con caché'
        });
      }
    } catch (error) {
      results.push({
        test: 'Conectividad',
        status: 'error',
        message: 'Error verificando conectividad',
        details: String(error)
      });
    }

    // Test 6: Caché offline
    try {
      const cacheNames = await caches.keys();
      if (cacheNames.length > 0) {
        results.push({
          test: 'Caché Offline',
          status: 'success',
          message: 'Archivos en caché disponibles',
          details: `Cachés: ${cacheNames.join(', ')}`
        });
      } else {
        results.push({
          test: 'Caché Offline',
          status: 'warning',
          message: 'No hay archivos en caché',
          details: 'La app podría no funcionar offline'
        });
      }
    } catch (error) {
      results.push({
        test: 'Caché Offline',
        status: 'error',
        message: 'Error verificando caché',
        details: String(error)
      });
    }

    setDiagnostics(results);
    
    // Calcular estado general
    const errors = results.filter(r => r.status === 'error').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    
    if (errors === 0 && warnings === 0) {
      setOverallStatus('success');
    } else if (errors === 0) {
      setOverallStatus('partial');
    } else {
      setOverallStatus('error');
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'pending': return '⏳';
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'pending': return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'success':
        return '🎉 ¡PWA funcionando perfectamente!';
      case 'partial':
        return '⚡ PWA funcional con algunos avisos';
      case 'error':
        return '🚨 PWA tiene problemas que requieren atención';
      case 'pending':
        return '🔍 Ejecuta el diagnóstico para verificar el estado';
    }
  };

  useEffect(() => {
    // Ejecutar diagnóstico inicial
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2EAE2] to-[#DDD6C7] dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🔧 Diagnóstico PWA
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Verifica el estado de la Progressive Web App y las notificaciones
          </p>

          <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Estado General
            </h2>
            <p className={`text-lg ${getStatusColor(overallStatus === 'pending' ? 'pending' : 'success')}`}>
              {getOverallStatusMessage()}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runDiagnostics}
              disabled={isRunning}
              className="bg-[#184347] hover:bg-[#2a5f65] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? '🔄 Ejecutando...' : '🔍 Ejecutar Diagnóstico'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={notifications.sendTestNotification}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              🔔 Probar Notificación
            </motion.button>

            {pwa.installState.canInstall && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pwa.install}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                📱 Instalar App
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            📊 Resultados del Diagnóstico
          </h2>

          <div className="space-y-4">
            {diagnostics.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(result.status)}</span>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {result.test}
                      </h3>
                    </div>
                    <p className={`font-medium ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                    {result.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {diagnostics.length === 0 && !isRunning && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Ejecuta el diagnóstico para ver los resultados
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticoPWA;
