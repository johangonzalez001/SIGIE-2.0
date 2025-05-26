import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { checkSupabaseConnection } from './lib/supabase';
import ConnectionErrorPage from './components/common/ConnectionErrorPage';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; error?: string }>({ success: false });
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  const checkConnection = async () => {
    try {
      setIsCheckingConnection(true);
      const status = await checkSupabaseConnection();
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al conectar con la base de datos' 
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (isCheckingConnection) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Verificando conexión con la base de datos...</h2>
      </div>
    );
  }

  if (!connectionStatus.success) {
    return <ConnectionErrorPage error={connectionStatus.error} onRetry={checkConnection} />;
  }

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;