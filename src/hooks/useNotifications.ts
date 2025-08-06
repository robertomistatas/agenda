import { useState, useEffect } from 'react';
import { onMessageListener } from '../firebase';
import { NotificationPayload } from '../types';
import { MessagePayload } from 'firebase/messaging';
import { notificationService } from '../services/NotificationService';

export const useNotifications = () => {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check initial permission
    setPermission(notificationService.getPermission());

    // Setup Firebase messaging listener
    const setupListener = async () => {
      try {
        const payload = await onMessageListener() as MessagePayload;
        if (payload && payload.notification) {
          const notificationData: NotificationPayload = {
            title: payload.notification.title || 'Mistatas',
            body: payload.notification.body || 'Nueva notificación',
            icon: payload.notification.icon,
            data: payload.data
          };
          
          setNotification(notificationData);
          
          // Also show browser notification if permission granted
          if (notificationService.getPermission() === 'granted') {
            notificationService.showNotification(
              notificationData.title,
              {
                body: notificationData.body,
                icon: notificationData.icon,
                tag: 'firebase-message'
              }
            );
          }
        }
      } catch (error) {
        console.log('Error setting up notification listener:', error);
      }
    };

    setupListener();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);
    
    if (newPermission === 'granted') {
      notificationService.showTestNotification();
      return true;
    }
    return false;
  };

  const showNotification = (title: string, body: string) => {
    const payload: NotificationPayload = { title, body };
    setNotification(payload);
    
    if (permission === 'granted') {
      notificationService.showNotification(title, { body });
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return { 
    notification, 
    permission, 
    clearNotification, 
    requestPermission, 
    showNotification 
  };
};
