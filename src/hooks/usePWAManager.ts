import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, isSupported, getToken as getFirebaseToken } from 'firebase/messaging';

// Configuración Firebase (reemplaza con tu configuración)
const firebaseConfig = {
  apiKey: "AIzaSyBm_GjTzPK5Y9zQYgH8Y8ZZEGx_y8XlMq8",
  authDomain: "mistatas-agenda.firebaseapp.com",
  projectId: "mistatas-agenda",
  storageBucket: "mistatas-agenda.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface PWAInstallState {
  canInstall: boolean;
  installed: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unsupported';
}

export interface NotificationManager {
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  scheduleReminder: (title: string, body: string, delay: number) => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

export interface PWAManager {
  installState: PWAInstallState;
  install: () => Promise<boolean>;
  checkInstallability: () => void;
}

export function useNotificationManager(): NotificationManager {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });

  const [messaging, setMessaging] = useState<any>(null);

  useEffect(() => {
    initializeNotifications();
    updatePermissionState();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Verificar soporte para notificaciones
      if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones');
        return;
      }

      // Verificar soporte para Firebase Messaging
      const supported = await isSupported();
      if (!supported) {
        console.warn('Firebase Messaging no es compatible');
        return;
      }

      // Inicializar Firebase
      const app = initializeApp(firebaseConfig);
      const messagingInstance = getMessaging(app);
      setMessaging(messagingInstance);

      // Escuchar mensajes en primer plano
      onMessage(messagingInstance, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);
        
        // Mostrar notificación personalizada
        if (payload.notification) {
          new Notification(payload.notification.title || 'MisTatas', {
            body: payload.notification.body,
            icon: '/agenda/logo192.svg',
            badge: '/agenda/logo192.svg',
            requireInteraction: true,
            tag: 'mistatas-foreground'
          });
        }
      });

    } catch (error) {
      console.error('Error inicializando notificaciones:', error);
    }
  };

  const updatePermissionState = () => {
    if ('Notification' in window) {
      const perm = Notification.permission;
      setPermission({
        granted: perm === 'granted',
        denied: perm === 'denied',
        default: perm === 'default'
      });
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (!('Notification' in window)) {
        console.error('Notificaciones no soportadas en este navegador');
        return false;
      }

      // Verificar si ya están concedidos
      if (Notification.permission === 'granted') {
        console.log('Permisos ya concedidos');
        updatePermissionState();
        return true;
      }

      // Verificar si fueron denegados permanentemente
      if (Notification.permission === 'denied') {
        console.warn('Permisos denegados permanentemente');
        updatePermissionState();
        return false;
      }

      console.log('Solicitando permisos de notificación...');
      const permission = await Notification.requestPermission();
      updatePermissionState();

      if (permission === 'granted') {
        console.log('Permisos de notificación concedidos exitosamente');
        return true;
      } else {
        console.log('Permisos de notificación denegados por el usuario');
        return false;
      }
    } catch (error) {
      console.error('Error solicitando permisos de notificación:', error);
      return false;
    }
  };

  const sendTestNotification = async (): Promise<boolean> => {
    try {
      // Verificar soporte
      if (!('Notification' in window)) {
        console.error('Notificaciones no soportadas en este navegador');
        return false;
      }

      // Verificar permisos
      if (!permission.granted) {
        console.log('Permisos no concedidos, solicitando...');
        const granted = await requestPermission();
        if (!granted) {
          console.log('No se pudieron obtener permisos');
          return false;
        }
      }

      console.log('Enviando notificación de prueba...');

      // Crear notificación con configuración robusta para Android
      const notification = new Notification('🔔 Prueba de Notificación - MisTatas', {
        body: 'Las notificaciones están funcionando correctamente en tu dispositivo',
        icon: '/agenda/logo192.svg',
        badge: '/agenda/logo192.svg',
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200],
        tag: 'test-notification-' + Date.now(),
        timestamp: Date.now(),
        data: {
          type: 'test',
          timestamp: Date.now()
        }
      });

      // Manejar eventos de la notificación
      notification.onclick = (event) => {
        console.log('Notificación de prueba clickeada');
        event.preventDefault();
        notification.close();
        
        // Enfocar la ventana si está disponible
        if (window.focus) {
          window.focus();
        }
      };

      notification.onclose = () => {
        console.log('Notificación de prueba cerrada');
      };

      notification.onerror = (error) => {
        console.error('Error en notificación de prueba:', error);
      };

      notification.onshow = () => {
        console.log('Notificación de prueba mostrada exitosamente');
      };

      return true;
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
      return false;
    }
  };

  const scheduleReminder = async (title: string, body: string, delay: number): Promise<boolean> => {
    try {
      if (!permission.granted) {
        const granted = await requestPermission();
        if (!granted) return false;
      }

      // Programar notificación local
      setTimeout(() => {
        const notification = new Notification(title, {
          body: body,
          icon: '/agenda/logo192.svg',
          badge: '/agenda/logo192.svg',
          requireInteraction: true,
          vibrate: [200, 100, 200, 100, 200],
          tag: 'scheduled-reminder'
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }, delay);

      return true;
    } catch (error) {
      console.error('Error programando recordatorio:', error);
      return false;
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      if (!messaging) {
        console.warn('Firebase Messaging no inicializado');
        return null;
      }

      // Para desarrollo/testing podemos usar getToken sin VAPID key
      const token = await getFirebaseToken(messaging);

      if (token) {
        console.log('Token FCM obtenido:', token);
        return token;
      } else {
        console.log('No se pudo obtener el token FCM');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo token FCM:', error);
      return null;
    }
  };

  return {
    permission,
    requestPermission,
    sendTestNotification,
    scheduleReminder,
    getToken
  };
}

export function usePWAManager(): PWAManager {
  const [installState, setInstallState] = useState<PWAInstallState>({
    canInstall: false,
    installed: false,
    platform: 'unsupported'
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    checkInstallability();
    detectPlatform();
    
    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallState(prev => ({ ...prev, canInstall: true }));
    };

    // Escuchar instalación completada
    const handleAppInstalled = () => {
      setInstallState(prev => ({ ...prev, installed: true, canInstall: false }));
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const detectPlatform = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;

    let platform: PWAInstallState['platform'] = 'unsupported';
    
    if (isIOS) {
      platform = 'ios';
    } else if (isAndroid) {
      platform = 'android';
    } else if (isDesktop) {
      platform = 'desktop';
    }

    setInstallState(prev => ({ ...prev, platform }));
  };

  const checkInstallability = () => {
    // Verificar si ya está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');

    setInstallState(prev => ({ ...prev, installed: isInstalled }));
  };

  const install = async (): Promise<boolean> => {
    try {
      if (!deferredPrompt) {
        console.log('No hay prompt de instalación disponible');
        return false;
      }

      const result = await deferredPrompt.prompt();
      console.log('Resultado de instalación:', result);

      if (result.outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
        setDeferredPrompt(null);
        setInstallState(prev => ({ ...prev, canInstall: false }));
        return true;
      } else {
        console.log('Usuario rechazó la instalación');
        return false;
      }
    } catch (error) {
      console.error('Error durante la instalación:', error);
      return false;
    }
  };

  return {
    installState,
    install,
    checkInstallability
  };
}

// Hook combinado para gestión completa PWA
export function usePWAComplete() {
  const notifications = useNotificationManager();
  const pwa = usePWAManager();

  const setupComplete = async (): Promise<boolean> => {
    try {
      console.log('🚀 Iniciando configuración PWA completa...');
      let success = false;
      
      // 1. Verificar soporte básico
      const hasSW = 'serviceWorker' in navigator;
      const hasNotifications = 'Notification' in window;
      
      console.log('Verificación de soporte:', { serviceWorker: hasSW, notifications: hasNotifications });
      
      // 2. Solicitar permisos de notificación
      if (hasNotifications) {
        console.log('Solicitando permisos de notificación...');
        const notificationGranted = await notifications.requestPermission();
        console.log('Permisos de notificación:', notificationGranted ? 'concedidos' : 'denegados');
        success = notificationGranted;
      } else {
        console.warn('Notificaciones no soportadas en este dispositivo');
      }
      
      // 3. Intentar obtener token FCM (no crítico)
      try {
        console.log('Intentando obtener token FCM...');
        const token = await notifications.getToken();
        console.log('Token FCM:', token ? 'obtenido exitosamente' : 'no disponible');
      } catch (tokenError) {
        console.log('Token FCM no disponible (normal en desarrollo):', tokenError);
      }
      
      // 4. Verificar estado de instalación PWA
      console.log('Verificando instalabilidad PWA...');
      pwa.checkInstallability();
      
      // 5. Verificar Service Worker
      if (hasSW) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          console.log('Service Worker:', registration ? 'registrado' : 'no registrado');
        } catch (swError) {
          console.warn('Error verificando Service Worker:', swError);
        }
      }

      const finalStatus = {
        notifications: success,
        serviceWorker: hasSW,
        installable: pwa.installState.canInstall,
        installed: pwa.installState.installed,
        platform: pwa.installState.platform
      };
      
      console.log('🎯 Setup PWA resultado final:', finalStatus);
      return success;
      
    } catch (error) {
      console.error('❌ Error crítico en setup PWA:', error);
      return false;
    }
  };

  return {
    notifications,
    pwa,
    setupComplete
  };
}
