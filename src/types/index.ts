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
