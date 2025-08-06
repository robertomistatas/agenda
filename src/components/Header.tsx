import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="/mistatas-logo.png" 
              alt="MisTatas" 
              className="h-8 w-auto mr-3"
            />
            <h1 className="text-xl font-bold">
              Agenda Empresarial
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="bg-primary-dark hover:bg-accent hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
