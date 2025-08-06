import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Event } from '../types';
import { useAuth } from './useAuth';
import { notificationService } from '../services/NotificationService';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    console.log(`[${new Date().toLocaleTimeString()}] Setting up events listener for user:`, user.uid);

    const eventsRef = collection(db, 'events');
    // Simplificar la consulta para evitar índices compuestos
    const q = query(
      eventsRef,
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        console.log(`[${new Date().toLocaleTimeString()}] Firestore snapshot received, docs count:`, snapshot.size);
        const eventsData: Event[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`[${new Date().toLocaleTimeString()}] Event data:`, { id: doc.id, ...data });
          eventsData.push({ id: doc.id, ...data } as Event);
        });
        
        // Sort by date and time manually on client side
        eventsData.sort((a, b) => {
          if (a.date === b.date) {
            return a.time.localeCompare(b.time);
          }
          return a.date.localeCompare(b.date);
        });
        
        setEvents(eventsData);
        setLoading(false);
        setError(null);

        // Schedule notifications for all events
        if (notificationService.getPermission() === 'granted') {
          notificationService.scheduleAllEvents(eventsData);
          console.log(`📅 Scheduled notifications for ${eventsData.length} events`);
        }
      },
      (err) => {
        console.error('Error fetching events:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return { events, loading, error };
};
