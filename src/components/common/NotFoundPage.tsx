import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-700">404</h1>
        <h2 className="mt-2 text-3xl font-semibold text-gray-900">Página no encontrada</h2>
        <p className="mt-4 text-gray-600">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
        
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;