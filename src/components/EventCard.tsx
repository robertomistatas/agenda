import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const eventDate = new Date(`${event.date}T${event.time}`);
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const dayOfWeek = dayNames[eventDate.getDay()];
  const day = eventDate.getDate();
  const month = monthNames[eventDate.getMonth()];

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(event);
    }
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && event.id) {
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres eliminar la reunión:\n\n"${event.title}" con ${event.client}?\n\nEsta acción no se puede deshacer.`
      );
      if (confirmed) {
        onDelete(event.id);
      }
    }
    setShowActions(false);
  };

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  // Get client type icon
  const getClientTypeIcon = (type?: string) => {
    const icons = {
      empresa: '🏢',
      municipalidad: '🏛️',
      particular: '👤',
      otro: '📋'
    };
    return icons[type as keyof typeof icons] || '📅';
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex flex-col gap-3 h-48 text-gray-800 dark:text-white rounded-xl shadow-lg p-6 max-w-[280px] w-full bg-white/60 dark:bg-gray-800/60 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-gray-600/30 cursor-pointer hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
      onClick={onClick}
    >
      {/* Header with date and actions */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getClientTypeIcon(event.clientType)}</span>
          <div className="text-sm opacity-90">
            <div className="font-medium">{dayOfWeek}</div>
            <div className="text-xs">{day} {month}</div>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={toggleActions}
            className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors rounded-full hover:bg-white/20 dark:hover:bg-gray-700/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-white/30 dark:border-gray-600/30 py-1 z-20 min-w-[120px]"
              >
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 flex items-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/30 flex items-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Event Title - Large and prominent */}
      <div className="flex-1">
        <h3 className="font-semibold text-2xl tracking-tight leading-tight line-clamp-2 mb-1">
          {event.title}
        </h3>
        <p className="font-normal text-sm opacity-90 truncate">
          {event.clientName || event.client}
        </p>
      </div>

        {/* Time and Status */}
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{event.time}</span>
          </div>
          
          {event.status && (
            <div className={`flex items-center gap-1 text-xs`}>
              <div className={`w-2 h-2 rounded-full ${
                event.status === 'confirmado' ? 'bg-green-500' :
                event.status === 'realizado' ? 'bg-blue-500' :
                event.status === 'cancelado' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className={`font-medium ${
                event.status === 'confirmado' ? 'text-green-700 dark:text-green-400' :
                event.status === 'realizado' ? 'text-blue-700 dark:text-blue-400' :
                event.status === 'cancelado' ? 'text-red-700 dark:text-red-400' :
                'text-yellow-700 dark:text-yellow-400'
              }`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
            </div>
          )}
        </div>      {/* Platform indicator */}
      {event.platform && (
        <div className="absolute top-2 right-2 opacity-60">
          {event.platform === 'presencial' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </div>
      )}

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowActions(false)}
        />
      )}
    </motion.div>
  );
};

export default EventCard;
