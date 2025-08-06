# Configuración Firebase

Para que la aplicación funcione completamente, necesitas configurar Firebase:

## 1. Crear proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "mistatas-agenda"
3. Habilita Google Analytics (opcional)

## 2. Configurar Authentication

1. En la consola Firebase, ve a Authentication > Sign-in method
2. Habilita "Email/Password"
3. Crea un usuario de prueba desde la pestaña "Users"

## 3. Configurar Firestore Database

1. Ve a Firestore Database
2. Crea una base de datos en modo "test" (para desarrollo)
3. Las reglas se configurarán automáticamente

## 4. Configurar Cloud Messaging

1. Ve a Project Settings > Cloud Messaging
2. Genera un nuevo certificado de Web Push
3. Copia la clave VAPID generada

## 5. Obtener configuración

1. Ve a Project Settings > General
2. En "Your apps", agrega una nueva app web
3. Copia la configuración de Firebase

## 6. Actualizar archivos

Reemplaza las configuraciones en estos archivos:

### `src/firebase.ts`
```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const VAPID_KEY = "TU_VAPID_KEY";
```

### `public/firebase-messaging-sw.js`
```javascript
firebase.initializeApp({
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
});
```

## 7. Configurar reglas de Firestore

En Firestore Database > Rules, usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden acceder a sus propios datos
    match /events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 8. Probar la aplicación

1. Ejecuta `npm start`
2. Abre http://localhost:3000
3. Crea una cuenta o inicia sesión
4. Prueba crear eventos y notificaciones

## 9. Deploy a GitHub Pages

1. El workflow de GitHub Actions está configurado
2. Simplemente haz push a la rama `main`
3. La app se desplegará automáticamente en: https://robertomistatas.github.io/agenda/
