import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import FloatingActionButton from '../components/FloatingActionButton';
import NotificationSettings from '../components/NotificationSettings';
import ElegantNotificationButton from '../components/ElegantNotificationButton';
import ElegantNotificationSettingsButton from '../components/ElegantNotificationSettingsButton';
import { useEvents } from '../hooks/useEvents';
import { useNotifications } from '../hooks/useNotifications';
import { useEventActions } from '../hooks/useEventActions';
import { Event } from '../types';

const Dashboard: React.FC = () => {
  const { events, loading, error } = useEvents();
  const { permission } = useNotifications();
  const { deleteEvent } = useEventActions();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      // The useEvents hook will automatically update the events list
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento. Inténtalo de nuevo.');
    }
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleEventSuccess = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // Filter events by date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const upcomingEvents = events.filter(event => event.date >= todayStr);
  const pastEvents = events.filter(event => event.date < todayStr);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link 
              to="/" 
              className="text-primary dark:text-blue-400 font-medium border-b-2 border-primary dark:border-blue-400 pb-2"
            >
              Dashboard
            </Link>
            <Link 
              to="/seguimiento" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 font-medium pb-2 transition-colors duration-200"
            >
              Seguimiento de Clientes
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
                Panel de Control
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona tus reuniones y eventos empresariales
              </p>
            </div>
            
            {/* Notification Controls */}
            <div className="flex gap-2">
              <ElegantNotificationButton />
              <ElegantNotificationSettingsButton onOpenSettings={() => setShowNotificationSettings(true)} />
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-md">
              <h4 className="font-medium">Error al cargar eventos:</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-primary dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3a4 4 0 118 0v4M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
            </svg>
            Próximas Reuniones ({upcomingEvents.length})
          </h3>
          
          {upcomingEvents.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7V3a4 4 0 118 0v4M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No hay reuniones programadas
              </h4>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Agrega tu primera reunión para comenzar
              </p>
              <button
                onClick={handleAddEvent}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Agregar Reunión
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
              {upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historial de Reuniones ({pastEvents.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
              {pastEvents.slice(0, 8).map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
              
            {pastEvents.length > 8 && (
              <div className="text-center mt-6">
                <button className="text-primary hover:text-primary/80 text-sm font-medium bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200">
                  Ver más reuniones anteriores
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddEvent} />

      {/* Event Form Modal */}
      <AnimatePresence>
        {showEventForm && (
          <EventForm
            onClose={handleCloseForm}
            onSuccess={handleEventSuccess}
            editEvent={editingEvent}
          />
        )}
      </AnimatePresence>

      {/* Notification Settings Modal */}
      <AnimatePresence>
        {showNotificationSettings && (
          <NotificationSettings
            show={showNotificationSettings}
            onClose={() => setShowNotificationSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
