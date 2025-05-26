import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, X } from 'lucide-react'; 
import { useAuth } from '../../modules/auth/context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-xl font-semibold text-blue-800">Sistema de Gestión Escolar SIGIE</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Notificaciones</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 text-center text-gray-500">
                  No hay notificaciones
                </div>
              </div>
            )}
          </div>
          
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user?.name || ''}</span>
              <span className="text-xs text-gray-500 capitalize">{user?.role || ''}</span>
            </div>
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || ''}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;