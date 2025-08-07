import React from 'react';
import { motion } from 'framer-motion';
import { NotificationService } from '../services/NotificationService';

const ElegantNotificationButton: React.FC = () => {
  const handleTestNotification = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      notificationService.showTestNotification();
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.button
        onClick={handleTestNotification}
        className="relative inline-block p-px font-semibold leading-6 text-white no-underline bg-gray-800 dark:bg-gray-700 shadow-2xl cursor-pointer group rounded-xl shadow-zinc-900 dark:shadow-zinc-800"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative z-10 flex items-center px-6 py-3 space-x-2 rounded-xl bg-gray-950/50 dark:bg-gray-900/50 ring-1 ring-white/10">
          <span className="text-sm">Probar Notificación</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
            className="w-5 h-5"
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.91 32.91 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-gray-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </motion.button>
    </div>
  );
};

export default ElegantNotificationButton;
