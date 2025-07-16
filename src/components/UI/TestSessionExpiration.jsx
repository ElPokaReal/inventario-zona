import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import api from '../../utils/axiosConfig';

const TestSessionExpiration = () => {
  const testExpiredToken = async () => {
    try {
      console.log('Probando endpoint de token expirado...');
      await api.get('/api/test-expired-token');
    } catch (error) {
      console.log('Error capturado:', error.response?.status);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9998]">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Prueba de Expiración
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Prueba la funcionalidad de expiración de sesión
            </p>
            <button
              onClick={testExpiredToken}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
            >
              Probar Token Expirado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSessionExpiration; 