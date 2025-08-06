# Mistatas - Agenda Empresarial

Una aplicación PWA (Progressive Web App) corporativa para gestionar reuniones y eventos empresariales con notificaciones push y funcionalidad offline.

## 🚀 Características

- **Gestión de Eventos**: Crear, editar y organizar reuniones con clientes B2B
- **Notificaciones Push**: Recordatorios automáticos mediante Firebase Cloud Messaging
- **PWA Instalable**: Compatible con Windows, macOS, iOS y Android
- **Historial de Reuniones**: Seguimiento completo de reuniones anteriores
- **Autenticación Segura**: Firebase Authentication
- **Deploy Automático**: GitHub Actions para despliegue en GitHub Pages

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Estilos**: TailwindCSS
- **Animaciones**: Framer Motion
- **Backend**: Firebase (Firestore, Auth, Cloud Messaging)
- **Navegación**: React Router
- **Formularios**: React Hook Form
- **Deploy**: GitHub Pages

## 🎨 Tema Corporativo

- **Principal**: #184347 (Verde corporativo)
- **Acento**: #9BE4D2 (Verde agua)
- **Fondo**: #F2EAE2 (Beige claro)

## 📱 Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Habilita Cloud Messaging
5. Reemplaza la configuración en `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

6. Reemplaza también la configuración en `public/firebase-messaging-sw.js`
7. Obtén tu VAPID key y actualízala en `firebase.ts`

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16 o superior
- npm o yarn

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/robertomistatas/agenda.git
cd agenda

# Instala las dependencias
npm install

# Configura Firebase (ver sección anterior)

# Inicia el servidor de desarrollo
npm start
```

### Build y Deploy

```bash
# Build de producción
npm run build

# Deploy a GitHub Pages
npm run deploy
```

## 📊 Estructura de Datos

### Colección `events`
```typescript
{
  title: string,           // Motivo de la reunión
  client: string,          // Cliente/Empresa
  date: string,           // YYYY-MM-DD
  time: string,           // HH:mm
  notes: string,          // Descripción/notas
  alertMinutesBefore: number, // Minutos antes para recordatorio
  userId: string,         // ID del usuario
  createdAt: timestamp    // Fecha de creación
}
```

### Colección `users`
```typescript
{
  uid: string,
  name: string,
  email: string,
  devices: [
    { token: string, platform: string }
  ]
}
```

## 🔔 Configuración de Notificaciones

Las notificaciones push funcionan tanto en foreground como en background:

- **Foreground**: Notificaciones estilo "glass" con Framer Motion
- **Background**: Notificaciones nativas del sistema operativo
- **Service Worker**: Maneja notificaciones cuando la app está cerrada

## 📱 PWA Features

- **Instalable**: Manifest.json configurado
- **Offline**: Service Worker para cacheo básico
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **App-like**: Experiencia nativa en dispositivos móviles

## 🎯 Pantallas Principales

1. **Login**: Autenticación corporativa con Firebase Auth
2. **Dashboard**: Vista principal con próximas reuniones e historial
3. **Formulario de Eventos**: Modal para crear nuevas reuniones
4. **Notificaciones**: Sistema de alertas elegante

## 🚀 Deploy en GitHub Pages

El proyecto incluye GitHub Actions para deploy automático:

1. Push a la rama `main`
2. GitHub Actions ejecuta el build
3. Deploy automático en `https://robertomistatas.github.io/agenda/`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

Roberto Mistatas - [@robertomistatas](https://github.com/robertomistatas)

Enlace del Proyecto: [https://github.com/robertomistatas/agenda](https://github.com/robertomistatas/agenda)
