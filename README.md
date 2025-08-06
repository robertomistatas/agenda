# 🏢 Mistatas - Agenda Empresarial PWA

Una aplicación web progresiva (PWA) moderna para la gestión de reuniones y eventos empresariales, construida con React, TypeScript, Firebase y TailwindCSS.

## 🌟 Características

### ✨ Funcionalidades Principales
- 🔐 **Autenticación segura** con Firebase Auth
- 📅 **Gestión completa de eventos** (Crear, Editar, Eliminar, Visualizar)
- 🔔 **Notificaciones push** en tiempo real con Firebase Messaging
- 📱 **PWA instalable** en dispositivos móviles y escritorio
- 🎨 **Interfaz moderna** y responsiva con TailwindCSS
- ⚡ **Animaciones fluidas** con Framer Motion
- 🌐 **Deploy automático** a GitHub Pages

### 🛠️ Stack Tecnológico
- **Frontend**: React 18 + TypeScript
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Notificaciones**: Firebase Cloud Messaging
- **Estilos**: TailwindCSS
- **Animaciones**: Framer Motion
- **Navegación**: React Router
- **Formularios**: React Hook Form
- **PWA**: Service Worker + Web App Manifest
- **Deploy**: GitHub Actions + GitHub Pages

## 🚀 Demo en Vivo

🌐 **[Ver Demo](https://robertomistatas.github.io/agenda)**

## 📱 Instalación como PWA

1. Visita la aplicación en tu navegador
2. Busca el ícono de "Instalar" en la barra de direcciones
3. Haz clic en "Instalar" para agregar la app a tu dispositivo
4. ¡Listo! Ahora puedes usar Mistatas como una app nativa

## 🔧 Desarrollo Local

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn
- Cuenta de Firebase

### Configuración

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/robertomistatas/agenda.git
   cd agenda
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilita Authentication, Firestore y Cloud Messaging
   - Copia la configuración a `src/firebase.ts`
   - Genera una clave VAPID para notificaciones push
   - Ver `CONFIGURACION_FIREBASE.md` para detalles

4. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

## 📦 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Eyecta la configuración de Create React App

## 🚀 Deploy

### Deploy Automático
El proyecto se despliega automáticamente a GitHub Pages cuando se hace push a la rama `main`.

### Deploy Manual
```powershell
# Ejecuta el script de PowerShell
.\deploy.ps1
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Cabecera de la aplicación
│   ├── EventCard.tsx   # Tarjeta de evento
│   ├── EventForm.tsx   # Formulario de eventos
│   └── ...
├── hooks/              # Custom hooks
│   ├── useAuth.tsx     # Hook de autenticación
│   ├── useEvents.ts    # Hook de gestión de eventos
│   └── useNotifications.ts # Hook de notificaciones
├── pages/              # Páginas principales
│   ├── Dashboard.tsx   # Panel principal
│   ├── Login.tsx       # Página de login
│   └── ...
├── services/           # Servicios
│   └── NotificationService.ts # Servicio de notificaciones
├── types/              # Definiciones de tipos
│   └── index.ts        # Tipos TypeScript
└── firebase.ts         # Configuración de Firebase
```

## 🔔 Notificaciones Push

La aplicación soporta notificaciones push a través de Firebase Cloud Messaging:

- **Notificaciones de recordatorio** automáticas antes de reuniones
- **Notificaciones manuales** para pruebas
- **Soporte multiplataforma** (Windows, Android, iOS)

### Configuración de Notificaciones
1. La aplicación solicita permisos automáticamente
2. Se genera un token FCM único para cada dispositivo
3. Las notificaciones se programan automáticamente para eventos próximos

## 🛡️ Seguridad

- **Autenticación segura** con Firebase Auth
- **Reglas de seguridad** configuradas en Firestore
- **Validación de datos** en frontend y backend
- **Tokens de notificación** seguros con VAPID

## 🎨 Diseño

### Paleta de Colores
- **Primario**: `#184347` (Verde corporativo)
- **Acento**: `#9BE4D2` (Verde claro)
- **Fondo**: `#F2EAE2` (Beige suave)
- **Texto**: `#2D3748` (Gris oscuro)

### Tipografía
- **Fuente principal**: Inter (Google Fonts)
- **Jerarquía visual** clara con diferentes pesos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Roberto Mistatas**
- GitHub: [@robertomistatas](https://github.com/robertomistatas)
- Email: roberto@mistatas.com

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📈 Roadmap

- [ ] 📊 Dashboard de estadísticas
- [ ] 🔍 Búsqueda y filtros avanzados
- [ ] 📧 Invitaciones por email
- [ ] 🗓️ Integración con Google Calendar
- [ ] 🎯 Categorías de eventos
- [ ] 📱 App móvil nativa
- [ ] 🌍 Internacionalización (i18n)

---

⭐ **¡No olvides dar una estrella al proyecto si te gustó!**
