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
  
  // Nuevos campos
  clientType: 'empresa' | 'municipalidad' | 'particular' | 'otro';
  clientName: string;
  contactPerson: string;
  scheduledBy: string;
  address?: string;
  meetingLink?: string;
  platform: 'google-meet' | 'zoom' | 'teams' | 'presencial' | 'otro';
  status: 'pendiente' | 'confirmado' | 'realizado' | 'cancelado';
  minutes?: string;
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
        alertMinutesBefore: editEvent.alertMinutesBefore || 15,
        
        // Nuevos campos con valores por defecto
        clientType: editEvent.clientType || 'empresa',
        clientName: editEvent.clientName || editEvent.client, // Fallback al campo client original
        contactPerson: editEvent.contactPerson || '',
        scheduledBy: editEvent.scheduledBy || user?.email || '',
        address: editEvent.address || '',
        meetingLink: editEvent.meetingLink || '',
        platform: editEvent.platform || 'presencial',
        status: editEvent.status || 'pendiente',
        minutes: editEvent.minutes || ''
      });
    } else {
      // Valores por defecto para nuevos eventos
      reset({
        title: '',
        client: '',
        clientName: '',
        date: '',
        time: '',
        notes: '',
        alertMinutesBefore: 15,
        clientType: 'empresa',
        contactPerson: '',
        scheduledBy: user?.email || '',
        address: '',
        meetingLink: '',
        platform: 'presencial',
        status: 'pendiente',
        minutes: ''
      });
    }
  }, [editEvent, reset, user]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      console.error('No user found');
      alert('Error: Usuario no autenticado');
      return;
    }

    console.log('Submitting event data:', data);
    console.log('User UID:', user.uid);
    console.log('Is editing:', isEditing);

    // Crear el objeto de evento con compatibilidad hacia atrás
    const eventData = {
      ...data,
      client: data.clientName || data.client, // Mantener compatibilidad con el campo client original
      userId: user.uid,
    };

    try {
      if (isEditing && editEvent?.id) {
        // Update existing event
        await updateEvent(editEvent.id, eventData);
        console.log('Event updated successfully');
        alert('Evento actualizado exitosamente');
      } else {
        // Create new event
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary dark:text-white">
            {isEditing ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Cliente *
                </label>
                <select
                  {...register('clientType', { required: 'El tipo de cliente es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="empresa">Empresa</option>
                  <option value="municipalidad">Municipalidad</option>
                  <option value="particular">Particular</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.clientType && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.clientType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Cliente/Institución *
                </label>
                <input
                  type="text"
                  {...register('clientName', { required: 'El nombre del cliente es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ej: MisTatas Ltda., Municipalidad de Santiago"
                />
                {errors.clientName && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.clientName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Persona de Contacto *
                </label>
                <input
                  type="text"
                  {...register('contactPerson', { required: 'La persona de contacto es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nombre de quien nos recibe"
                />
                {errors.contactPerson && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agendado por *
                </label>
                <input
                  type="text"
                  {...register('scheduledBy', { required: 'El responsable es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Quién en MisTatas generó la reunión"
                />
                {errors.scheduledBy && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.scheduledBy.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Motivo de la Reunión *
              </label>
              <input
                type="text"
                {...register('title', { required: 'El motivo es requerido' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ej: Presentación de propuesta comercial"
              />
              {errors.title && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Fecha, Hora y Modalidad */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fecha, Hora y Modalidad</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'La fecha es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.date && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  {...register('time', { required: 'La hora es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.time && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado *
                </label>
                <select
                  {...register('status', { required: 'El estado es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plataforma *
                </label>
                <select
                  {...register('platform', { required: 'La plataforma es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="presencial">Presencial</option>
                  <option value="google-meet">Google Meet</option>
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.platform && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.platform.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recordatorio (minutos antes)
                </label>
                <select
                  {...register('alertMinutesBefore', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            </div>
          </div>

          {/* Ubicación y Enlaces */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ubicación y Enlaces</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dirección del Evento
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Dirección física del evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link de Reunión Online
                </label>
                <input
                  type="url"
                  {...register('meetingLink')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Notas y Minuta */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notas y Seguimiento</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción / Notas Previas
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Notas adicionales sobre la reunión, preparación, objetivos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minuta Posterior a la Reunión
              </label>
              <textarea
                {...register('minutes')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Resumen de lo conversado, acuerdos, próximos pasos, compromisos..."
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar Evento' : 'Crear Evento')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EventForm;
