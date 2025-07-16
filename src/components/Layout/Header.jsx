import React from 'react';
import { Search, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ title }) => {
  const { user } = useAuth();

  const getRoleLabel = (role) => {
    const roleMap = {
      'administrador': 'Administrador',
      'técnico': 'Técnico',
      'usuario': 'Usuario'
    };
    return roleMap[role] || 'Usuario';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos, códigos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.nombre_completo}</p>
              <p className="text-xs text-gray-600">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;