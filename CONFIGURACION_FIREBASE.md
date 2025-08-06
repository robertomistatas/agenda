# Configuración Firebase para tu proyecto agenda-f1799

## ✅ Ya configurado:
- Configuración de Firebase ✅
- Authentication habilitado ✅

## 🔧 Pasos pendientes:

### 1. Configurar reglas de Firestore
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **agenda-f1799**
3. Ve a **Firestore Database**
4. Haz clic en la pestaña **"Rules"**
5. Copia y pega las reglas del archivo `firestore.rules`
6. Haz clic en **"Publish"**

### 2. Crear usuario en Firebase Auth
1. En Firebase Console, ve a **Authentication > Users**
2. Haz clic en **"Add user"**
3. Agrega tu email (ej: roberto@mistatas.com)
4. Establece una contraseña segura
5. Haz clic en **"Add user"**

### 3. Configurar Cloud Messaging (opcional para notificaciones)
1. Ve a **Project Settings > Cloud Messaging**
2. En "Web configuration", haz clic en **"Generate key pair"**
3. Copia la clave VAPID generada
4. Reemplaza `"your-vapid-key"` en `src/firebase.ts` con tu clave VAPID

### 4. Verificar la aplicación
1. Reinicia el servidor: `npm start`
2. Ve a http://localhost:3000/agenda
3. Inicia sesión con las credenciales que creaste en Firebase Auth
4. Prueba crear algunos eventos

## 🚨 Errores comunes y soluciones:

### "Credenciales no coinciden"
- Verifica que el email y contraseña existan en Firebase Auth
- Asegúrate de usar el email exacto (sin espacios extra)
- La contraseña debe tener al menos 6 caracteres

### "Permission denied" al crear eventos
- Aplica las reglas de Firestore del archivo `firestore.rules`
- Asegúrate de estar autenticado antes de crear eventos

### Problemas de CORS o red
- Verifica que el dominio esté autorizado en Firebase Console
- Para desarrollo local, `localhost` debería estar permitido por defecto

## 📱 Para habilitar PWA en producción:
1. Haz push a GitHub: `git push origin main`
2. GitHub Actions desplegará automáticamente en: https://robertomistatas.github.io/agenda/
3. La app será instalable desde el navegador

## 🔐 Estructura de datos que se creará:

### Colección `events`:
```json
{
  "title": "Reunión con cliente",
  "client": "Empresa ABC",
  "date": "2025-08-07",
  "time": "10:00",
  "notes": "Notas de la reunión",
  "alertMinutesBefore": 15,
  "userId": "user-uid-from-auth",
  "createdAt": "timestamp"
}
```

¡Tu aplicación Firebase está casi lista! 🚀
