# 🔔 Sistema de Notificaciones Multiplataforma

## Funcionalidades Implementadas

### ✅ **Notificaciones Locales del Navegador**
- Funciona en **Windows, Android e iOS**
- Notificaciones automáticas basadas en tiempo de eventos
- Sonido y vibración (Android)
- Persisten aunque la app esté cerrada

### ✅ **Firebase Cloud Messaging (FCM)**
- Push notifications desde el servidor
- Funciona en segundo plano
- Soporte para acciones (Ver Agenda, Cerrar)

### ✅ **Detección Automática de Compatibilidad**
- **Windows**: ✅ Completamente compatible
- **Android**: ✅ Completamente compatible
- **iOS**: ⚠️ Safari 16.4+ requerido

## Cómo Funcionan

### 🔄 **Flujo de Notificaciones**

1. **Usuario crea evento** → Se programa notificación automática
2. **Tiempo configurado** → Se muestra notificación del sistema
3. **Usuario hace clic** → Se abre la aplicación

### 📱 **Tipos de Notificaciones**

#### **Notificaciones Locales (JavaScript)**
```javascript
// Se programan automáticamente al crear eventos
new Notification('🔔 Recordatorio de Reunión', {
  body: 'Reunión con Cliente ABC en 15 minutos',
  icon: '/logo192.png',
  tag: 'event-123',
  requireInteraction: true
});
```

#### **Firebase Cloud Messaging**
```javascript
// Para notificaciones desde servidor
// Requiere configuración de VAPID key
messaging.onMessage((payload) => {
  // Maneja notificaciones en primer plano
});
```

## Configuración Requerida

### 🔑 **VAPID Key (Firebase)**

1. Ve a [Firebase Console](https://console.firebase.google.com/project/agenda-f1799/settings/cloudmessaging)
2. **Project Settings** → **Cloud Messaging**
3. **Web Push certificates** → **Generate key pair**
4. Copia la clave y reemplaza en `src/firebase.ts`:

```typescript
const VAPID_KEY = "TU_CLAVE_VAPID_AQUI";
```

### 🌐 **Configuración por Navegador**

#### **Chrome/Edge (Windows/Android)**
- Automático al hacer clic en "Permitir notificaciones"
- Funciona inmediatamente

#### **Firefox (Windows/Android)**
- Automático al hacer clic en "Permitir notificaciones"
- Soporte completo para acciones

#### **Safari (iOS/macOS)**
- Requiere iOS 16.4+ o macOS 13+
- Funciona después de añadir a pantalla de inicio (PWA)

## Resolución de Problemas

### ❌ **"Notificaciones no aparecen"**

1. **Verificar permisos**: 
   - Chrome: `chrome://settings/content/notifications`
   - Firefox: `about:preferences#privacy`
   - Safari: Configuración → Notificaciones

2. **Verificar Service Worker**:
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('SW registered:', registrations.length > 0);
   });
   ```

### ❌ **"FCM no funciona"**

1. Verificar VAPID key en Firebase Console
2. Comprobar configuración del Service Worker
3. Asegurar HTTPS en producción

### ❌ **"No funciona en iOS"**

1. Verificar versión Safari 16.4+
2. Instalar como PWA (Añadir a pantalla de inicio)
3. Verificar permisos en Configuración → Safari → Notificaciones

## Testing

### 🧪 **Probar Notificaciones**

```javascript
// Consola del navegador
notificationService.showTestNotification();
```

### 📊 **Verificar Estado**

```javascript
// Verificar permisos
console.log('Permission:', Notification.permission);

// Verificar FCM token
requestNotificationPermission().then(token => {
  console.log('FCM Token:', token);
});
```

## Próximas Mejoras

- [ ] Notificaciones por email (backup)
- [ ] Sincronización con calendarios nativos
- [ ] Notificaciones recurrentes
- [ ] Configuración granular por evento

## Compatibilidad

| Plataforma | Navegador | Soporte | Notas |
|------------|-----------|---------|-------|
| Windows | Chrome | ✅ | Completo |
| Windows | Firefox | ✅ | Completo |
| Windows | Edge | ✅ | Completo |
| Android | Chrome | ✅ | Completo |
| Android | Firefox | ✅ | Completo |
| iOS | Safari | ⚠️ | iOS 16.4+, PWA requerida |
| macOS | Safari | ⚠️ | macOS 13+, PWA requerida |
