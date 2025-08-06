import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import FloatingActionButton from '../components/FloatingActionButton';
import NotificationSettings from '../components/NotificationSettings';
import NotificationTestButton from '../components/NotificationTestButton';
import ServiceWorkerTestButton from '../components/ServiceWorkerTestButton';
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
    // Optionally show a success message
  };

  // Filter events by date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const upcomingEvents = events.filter(event => event.date >= todayStr);
  const pastEvents = events.filter(event => event.date < todayStr);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Panel de Control
              </h2>
              <p className="text-gray-600">
                Gestiona tus reuniones y eventos empresariales
              </p>
            </div>
            
            {/* Notification Controls */}
            <div className="flex gap-2">
              <NotificationTestButton />
              <ServiceWorkerTestButton />
              <button
                onClick={() => setShowNotificationSettings(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  permission === 'granted' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                <span className="text-lg">
                  {permission === 'granted' ? '🔔' : '🔕'}
                </span>
                <span>
                  {permission === 'granted' ? 'Notificaciones ON' : 'Activar Notificaciones'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <h4 className="font-medium">Error al cargar eventos:</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3a4 4 0 118 0v4M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
            </svg>
            Próximas Reuniones ({upcomingEvents.length})
          </h3>
          
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7V3a4 4 0 118 0v4M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">
                No hay reuniones programadas
              </h4>
              <p className="text-gray-500 mb-4">
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
            <div className="space-y-4">
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
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historial de Reuniones ({pastEvents.length})
            </h3>
            
            <div className="space-y-4">
              {pastEvents.slice(0, 5).map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
              
              {pastEvents.length > 5 && (
                <div className="text-center">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    Ver más reuniones anteriores
                  </button>
                </div>
              )}
            </div>
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
