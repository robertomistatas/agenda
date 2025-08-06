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
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 cursor-pointer border-l-4 border-accent relative"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Date Section */}
        <div className="flex-shrink-0 text-center">
          <div className="bg-primary text-white rounded-lg p-3 min-w-[60px]">
            <div className="text-xs font-medium text-accent">{dayOfWeek}</div>
            <div className="text-lg font-bold">{day}</div>
            <div className="text-xs">{month}</div>
          </div>
        </div>
        
        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-primary truncate">
            {event.title}
          </h3>
          <p className="text-accent font-medium text-sm">
            {event.client}
          </p>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {event.notes}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {event.time}
            </span>
            {event.alertMinutesBefore > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 17h5l-5 5v-5z" />
                </svg>
                {event.alertMinutesBefore} min antes
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={toggleActions}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[120px]"
              >
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </motion.div>
  );
};

export default EventCard;
