import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationPayload } from '../types';

interface InAppNotificationProps {
  notification: NotificationPayload | null;
  onClose: () => void;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({ notification, onClose }) => {
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-glass-bg backdrop-blur-lg border border-glass-border rounded-lg shadow-2xl p-4 text-primary">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-primary truncate">
                  {notification.title}
                </h4>
                <p className="text-sm text-primary/80 mt-1">
                  {notification.body}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-primary/60 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InAppNotification;
