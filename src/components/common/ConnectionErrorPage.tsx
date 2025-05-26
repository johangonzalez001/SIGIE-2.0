import React from 'react';
import { Database, AlertCircle, RefreshCw, Check, Shield } from 'lucide-react';

interface ConnectionErrorPageProps {
  error?: string;
  onRetry: () => void;
}

const ConnectionErrorPage: React.FC<ConnectionErrorPageProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <Database className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Error de Conexión</h1>
        <p className="text-center text-gray-600 mb-6">
          No se pudo establecer conexión con la base de datos
        </p>
        
        <div className="bg-red-50 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-700 font-medium">Error detectado:</p>
            <p className="text-sm text-red-600 mt-1">{error || 'Error de conexión desconocido con Supabase'}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Soluciones recomendadas:</h2>
          <ul className="space-y-3 mt-3">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Verificar archivo .env</p>
                <p className="text-xs text-gray-500">Asegúrese que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén correctamente configuradas</p>
              </div>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Revisar proyecto Supabase</p>
                <p className="text-xs text-gray-500">Verifique que su proyecto Supabase esté activo y accesible</p>
              </div>
            </li>
            <li className="flex items-start">
              <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Políticas de seguridad (RLS)</p>
                <p className="text-xs text-gray-500">Si el error es 403 Forbidden, verifique las políticas de Row Level Security en su base de datos</p>
              </div>
            </li>
          </ul>
        </div>
        
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar conexión
        </button>
      </div>
    </div>
  );
};

export default ConnectionErrorPage;