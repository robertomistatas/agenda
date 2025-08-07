import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';

interface ClientSummary {
  clientName: string;
  clientType: 'empresa' | 'municipalidad' | 'particular' | 'otro';
  contactPerson: string;
  totalMeetings: number;
  upcomingMeetings: number;
  completedMeetings: number;
  lastMeeting?: Date;
  events: Event[];
}

const ClientTracking: React.FC = () => {
  const { events } = useEvents();
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(null);
  const [filterType, setFilterType] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Agrupar eventos por cliente
  const clientSummaries = useMemo(() => {
    const clientMap = new Map<string, ClientSummary>();
    
    events.forEach(event => {
      const clientName = event.clientName || event.client;
      if (!clientMap.has(clientName)) {
        clientMap.set(clientName, {
          clientName,
          clientType: event.clientType || 'empresa',
          contactPerson: event.contactPerson || '',
          totalMeetings: 0,
          upcomingMeetings: 0,
          completedMeetings: 0,
          events: []
        });
      }
      
      const client = clientMap.get(clientName)!;
      client.events.push(event);
      client.totalMeetings++;
      
      const eventDate = new Date(`${event.date}T${event.time}`);
      const now = new Date();
      
      if (eventDate > now) {
        client.upcomingMeetings++;
      } else {
        client.completedMeetings++;
        if (!client.lastMeeting || eventDate > client.lastMeeting) {
          client.lastMeeting = eventDate;
        }
      }
    });
    
    return Array.from(clientMap.values()).sort((a, b) => 
      b.totalMeetings - a.totalMeetings
    );
  }, [events]);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return clientSummaries.filter(client => {
      const matchesType = filterType === 'todos' || client.clientType === filterType;
      const matchesSearch = client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [clientSummaries, filterType, searchTerm]);

  const getClientTypeColor = (type: string) => {
    const colors = {
      empresa: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      municipalidad: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      particular: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      otro: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[type as keyof typeof colors] || colors.otro;
  };

  const getClientTypeIcon = (type: string) => {
    const icons = {
      empresa: '🏢',
      municipalidad: '🏛️',
      particular: '👤',
      otro: '📋'
    };
    return icons[type as keyof typeof icons] || icons.otro;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 font-medium pb-2 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              to="/seguimiento" 
              className="text-primary dark:text-blue-400 font-medium border-b-2 border-primary dark:border-blue-400 pb-2"
            >
              Seguimiento de Clientes
            </Link>
            <Link 
              to="/configuraciones" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 font-medium pb-2 transition-colors duration-200"
            >
              Configuraciones
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
            Seguimiento por Cliente
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona y hace seguimiento de todos tus clientes y sus reuniones
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por cliente o persona de contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="todos">Todos los tipos</option>
            <option value="empresa">Empresas</option>
            <option value="municipalidad">Municipalidades</option>
            <option value="particular">Particulares</option>
            <option value="otro">Otros</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Clientes */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              Clientes ({filteredClients.length})
            </h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {filteredClients.map((client) => (
                <motion.div
                  key={client.clientName}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedClient?.clientName === client.clientName
                      ? 'bg-accent/20 ring-2 ring-accent'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } shadow-md`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getClientTypeIcon(client.clientType)}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {client.clientName}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClientTypeColor(client.clientType)}`}>
                      {client.clientType}
                    </span>
                  </div>
                  
                  {client.contactPerson && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Contacto: {client.contactPerson}
                    </p>
                  )}
                  
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Total: {client.totalMeetings}</span>
                    <span>Próximas: {client.upcomingMeetings}</span>
                    <span>Realizadas: {client.completedMeetings}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detalles del Cliente Seleccionado */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedClient ? (
                <motion.div
                  key={selectedClient.clientName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
                        <span className="text-2xl">{getClientTypeIcon(selectedClient.clientType)}</span>
                        {selectedClient.clientName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedClient.contactPerson && `Contacto: ${selectedClient.contactPerson}`}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClientTypeColor(selectedClient.clientType)}`}>
                      {selectedClient.clientType}
                    </span>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedClient.totalMeetings}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Total</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {selectedClient.upcomingMeetings}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">Próximas</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {selectedClient.completedMeetings}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Realizadas</div>
                    </div>
                  </div>

                  {/* Lista de Reuniones */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Historial de Reuniones
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedClient.events
                        .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
                        .map((event) => {
                          const eventDate = new Date(`${event.date}T${event.time}`);
                          const isPast = eventDate < new Date();
                          
                          return (
                            <div
                              key={event.id}
                              className={`p-4 rounded-lg border-l-4 ${
                                isPast ? 'border-gray-400 bg-gray-50 dark:bg-gray-700/50' : 'border-accent bg-accent/5 dark:bg-accent/10'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {event.title}
                                </h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  event.status === 'realizado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  event.status === 'cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  event.status === 'confirmado' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {event.status}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p>📅 {event.date} a las {event.time}</p>
                                {event.platform && (
                                  <p>💻 {event.platform}</p>
                                )}
                                {event.scheduledBy && (
                                  <p>👤 Agendado por: {event.scheduledBy}</p>
                                )}
                                {event.notes && (
                                  <p className="mt-2">📝 {event.notes}</p>
                                )}
                                {event.minutes && (
                                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Minuta:</p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">{event.minutes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
                >
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Selecciona un cliente
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Haz clic en un cliente de la lista para ver su historial completo de reuniones
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientTracking;
