import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const SessionExpiredNotification = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right-2 duration-300">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Sesión Expirada
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-3">
          <div className="w-full bg-red-200 rounded-full h-1">
            <div 
              className="bg-red-600 h-1 rounded-full transition-all duration-3000 ease-linear"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredNotification; 