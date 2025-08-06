import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Event } from '../types';

export const useEventActions = () => {
  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      console.log('Deleting event:', eventId);
      await deleteDoc(doc(db, 'events', eventId));
      console.log('✅ Event deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting event:', error);
      throw error;
    }
  };

  const updateEvent = async (eventId: string, updatedData: Partial<Event>): Promise<void> => {
    try {
      console.log('Updating event:', eventId, updatedData);
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, updatedData);
      console.log('✅ Event updated successfully');
    } catch (error) {
      console.error('❌ Error updating event:', error);
      throw error;
    }
  };

  return {
    deleteEvent,
    updateEvent
  };
};
