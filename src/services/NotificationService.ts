import { Event } from '../types';

export class NotificationService {
  private static instance: NotificationService;
  
  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get notification permission status
  getPermission(): NotificationPermission {
    return this.isSupported() ? Notification.permission : 'denied';
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.log('Notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  // Show browser notification (simplified, compatible)
  showNotification(title: string, options: NotificationOptions = {}): void {
    console.log('🔔 Attempting to show notification:', { title, options });
    
    if (this.getPermission() !== 'granted') {
      console.log('❌ Notification permission not granted:', this.getPermission());
      return;
    }

    try {
      // Create simple notification options (only compatible properties)
      const notificationOptions: NotificationOptions = {
        icon: '/logo192.png',
        badge: '/logo192.png',
        requireInteraction: true,
        ...options
      };

      const notification = new Notification(title, notificationOptions);

      console.log('✅ Notification created successfully');

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
        console.log('🔕 Notification auto-closed');
      }, 10000);

      // Enhanced click handling
      notification.onclick = () => {
        console.log('👆 Notification clicked');
        window.focus();
        notification.close();
      };

      // Error handling
      notification.onerror = (error) => {
        console.error('❌ Notification error:', error);
      };

      // Show event
      notification.onshow = () => {
        console.log('👁️ Notification shown successfully');
      };

      // Close event
      notification.onclose = () => {
        console.log('🔕 Notification closed');
      };

    } catch (error) {
      console.error('❌ Error creating notification:', error);
    }
  }

  // Schedule notification for event
  scheduleEventNotification(event: Event): void {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const notificationTime = new Date(eventDateTime.getTime() - event.alertMinutesBefore * 60 * 1000);
    const now = new Date();

    if (notificationTime > now) {
      const delay = notificationTime.getTime() - now.getTime();
      
      console.log(`📅 Notification scheduled for ${notificationTime.toLocaleString()}`);
      
      setTimeout(() => {
        this.showNotification(
          '🔔 Recordatorio de Reunión', 
          {
            body: `${event.title} con ${event.client} en ${event.alertMinutesBefore} minutos`,
            tag: `event-${event.id}`,
            requireInteraction: true
          }
        );
      }, delay);
    }
  }

  // Schedule all event notifications
  scheduleAllEvents(events: Event[]): void {
    events.forEach(event => {
      if (event.alertMinutesBefore > 0) {
        this.scheduleEventNotification(event);
      }
    });
  }

  // Show test notification (simplified)
  showTestNotification(): void {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES');
    const dateString = now.toLocaleDateString('es-ES');
    
    console.log('🧪 Starting test notification sequence...');
    console.log('📊 Browser info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isLocalhost: window.location.hostname === 'localhost',
      protocol: window.location.protocol,
      permission: this.getPermission()
    });
    
    this.showNotification(
      '🧪 Prueba de Notificación - Mistatas',
      {
        body: `Fecha: ${dateString}\nHora: ${timeString}\n\n✅ Sistema funcionando correctamente`,
        tag: 'test-notification',
        requireInteraction: true
      }
    );
  }
}

export const notificationService = NotificationService.getInstance();
