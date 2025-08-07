import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientTracking from './pages/ClientTracking';
import Configuraciones from './pages/Configuraciones';
import DiagnosticoPWA from './pages/DiagnosticoPWA';
import InAppNotification from './components/InAppNotification';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import './styles/globals.css';

function App() {
  const { user, loading } = useAuth();
  const { notification, clearNotification } = useNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-medium">Cargando Mistatas...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route 
              path="/" 
              element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/seguimiento" 
              element={user ? <ClientTracking /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/configuraciones" 
              element={user ? <Configuraciones /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/diagnostico" 
              element={user ? <DiagnosticoPWA /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
          
          {/* In-App Notifications */}
          <InAppNotification 
            notification={notification} 
            onClose={clearNotification} 
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
