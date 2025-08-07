import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';

interface ElegantNotificationSettingsButtonProps {
  onOpenSettings: () => void;
}

const ElegantNotificationSettingsButton: React.FC<ElegantNotificationSettingsButtonProps> = ({ onOpenSettings }) => {
  const { permission } = useNotifications();

  const isGranted = permission === 'granted';

  return (
    <div className="flex items-center justify-center">
      <motion.button
        onClick={onOpenSettings}
        className={`relative inline-block p-px font-semibold leading-6 text-white no-underline shadow-2xl cursor-pointer group rounded-xl ${
          isGranted 
            ? 'bg-green-800 dark:bg-green-700 shadow-green-900 dark:shadow-green-800' 
            : 'bg-orange-800 dark:bg-orange-700 shadow-orange-900 dark:shadow-orange-800'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className={`absolute inset-0 rounded-xl transition-opacity duration-500 group-hover:opacity-100 ${
            isGranted
              ? 'bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(34,197,94,0.6)_0%,rgba(34,197,94,0)_75%)] opacity-0'
              : 'bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(251,146,60,0.6)_0%,rgba(251,146,60,0)_75%)] opacity-0'
          }`}></span>
        </span>
        <div className={`relative z-10 flex items-center px-6 py-3 space-x-2 rounded-xl ring-1 ring-white/10 ${
          isGranted 
            ? 'bg-green-950/50 dark:bg-green-900/50' 
            : 'bg-orange-950/50 dark:bg-orange-900/50'
        }`}>
          <span className="text-lg">
            {isGranted ? '🔔' : '🔕'}
          </span>
          <span className="text-sm">
            {isGranted ? 'Notificaciones ON' : 'Activar Notificaciones'}
          </span>
        </div>
        <span className={`absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] transition-opacity duration-500 group-hover:opacity-40 ${
          isGranted
            ? 'bg-gradient-to-r from-green-400/0 via-green-400/90 to-green-400/0'
            : 'bg-gradient-to-r from-orange-400/0 via-orange-400/90 to-orange-400/0'
        }`}></span>
      </motion.button>
    </div>
  );
};

export default ElegantNotificationSettingsButton;
