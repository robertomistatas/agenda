import React, { createContext, useContext, useState } from 'react';
import { Event } from '../types';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<void>;
  loading: boolean;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: React.ReactNode;
}

// Demo events
const demoEvents: Event[] = [
  {
    id: '1',
    title: 'Reunión con Municipalidad X',
    client: 'Municipalidad de Santiago',
    date: '2025-08-07',
    time: '10:00',
    notes: 'Presentación de propuesta para sistema de gestión municipal',
    alertMinutesBefore: 15,
    userId: 'demo-user-123',
    createdAt: new Date('2025-08-06T10:00:00')
  },
  {
    id: '2',
    title: 'Seguimiento proyecto ERP',
    client: 'Empresa Tecnológica ABC',
    date: '2025-08-08',
    time: '14:30',
    notes: 'Revisión de avances y próximos entregables del sistema ERP',
    alertMinutesBefore: 30,
    userId: 'demo-user-123',
    createdAt: new Date('2025-08-06T11:00:00')
  },
  {
    id: '3',
    title: 'Capacitación equipo',
    client: 'Corporación Industrial XYZ',
    date: '2025-08-09',
    time: '09:00',
    notes: 'Capacitación al equipo sobre nuevas funcionalidades del sistema',
    alertMinutesBefore: 60,
    userId: 'demo-user-123',
    createdAt: new Date('2025-08-06T12:00:00')
  }
];

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(demoEvents);
  const [loading, setLoading] = useState(false);

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      setEvents(prev => [...prev, newEvent].sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      }));
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    events,
    addEvent,
    loading
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
