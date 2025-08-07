export interface Event {
  id?: string;
  title: string;
  client: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  alertMinutesBefore: number;
  userId: string;
  createdAt: Date;
  
  // Nuevos campos para gestión empresarial
  clientType: 'empresa' | 'municipalidad' | 'particular' | 'otro';
  clientName: string; // Nombre oficial del cliente/institución
  contactPerson: string; // Persona de contacto
  scheduledBy: string; // Quién agendó la reunión
  address?: string; // Dirección del evento (opcional)
  meetingLink?: string; // Link para reuniones online
  platform: 'google-meet' | 'zoom' | 'teams' | 'presencial' | 'otro';
  status: 'pendiente' | 'confirmado' | 'realizado' | 'cancelado';
  minutes?: string; // Minuta posterior a la reunión
  attachments?: EventAttachment[]; // Archivos adjuntos
}

export interface EventAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  devices: Device[];
}

export interface Device {
  token: string;
  platform: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: any;
}
