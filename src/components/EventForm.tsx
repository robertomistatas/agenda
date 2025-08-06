import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useEventActions } from '../hooks/useEventActions';

interface EventFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editEvent?: Event | null; // Event to edit (null for new event)
}

interface FormData {
  title: string;
  client: string;
  date: string;
  time: string;
  notes: string;
  alertMinutesBefore: number;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSuccess, editEvent = null }) => {
  const { user } = useAuth();
  const { updateEvent } = useEventActions();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const isEditing = !!editEvent;

  // Populate form when editing
  useEffect(() => {
    if (editEvent) {
      reset({
        title: editEvent.title,
        client: editEvent.client,
        date: editEvent.date,
        time: editEvent.time,
        notes: editEvent.notes || '',
        alertMinutesBefore: editEvent.alertMinutesBefore || 15
      });
    }
  }, [editEvent, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      console.error('No user found');
      alert('Error: Usuario no autenticado');
      return;
    }

    console.log('Submitting event data:', data);
    console.log('User UID:', user.uid);
    console.log('Is editing:', isEditing);

    try {
      if (isEditing && editEvent?.id) {
        // Update existing event
        await updateEvent(editEvent.id, {
          ...data,
          userId: user.uid,
        });
        console.log('Event updated successfully');
        alert('Evento actualizado exitosamente');
      } else {
        // Create new event
        const eventData: Omit<Event, 'id'> = {
          ...data,
          userId: user.uid,
          createdAt: new Date(),
        };

        console.log('Event data to save:', eventData);

        const docRef = await addDoc(collection(db, 'events'), {
          ...eventData,
          createdAt: serverTimestamp(),
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Evento creado exitosamente');
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving event:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = isEditing ? 'Error al actualizar el evento. ' : 'Error al crear el evento. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'No tienes permisos para realizar esta acción. Verifica las reglas de Firestore.';
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'No estás autenticado. Intenta cerrar sesión e iniciar sesión nuevamente.';
      } else {
        errorMessage += `Detalles: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">
            {isEditing ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente / Empresa *
            </label>
            <input
              type="text"
              {...register('client', { required: 'El cliente es requerido' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Nombre del cliente o empresa"
            />
            {errors.client && (
              <p className="text-red-500 text-xs mt-1">{errors.client.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de la reunión *
            </label>
            <input
              type="text"
              {...register('title', { required: 'El motivo es requerido' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Ej: Presentación de propuesta"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                {...register('date', { required: 'La fecha es requerida' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora *
              </label>
              <input
                type="time"
                {...register('time', { required: 'La hora es requerida' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción / Notas
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Notas adicionales sobre la reunión..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recordatorio (minutos antes)
            </label>
            <select
              {...register('alertMinutesBefore', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value={0}>Sin recordatorio</option>
              <option value={5}>5 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
              <option value={1440}>1 día</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EventForm;
