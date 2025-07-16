import React from 'react';
import { X, Edit, User, Mail, Phone, Building, Shield, Calendar } from 'lucide-react';

const UserDetail = ({ user, onClose, onEdit }) => {
  const getRoleLabel = (rol_id) => {
  const labels = {
    1: 'Administrador',
    2: 'Usuario',
    3: 'Técnico'
  };
  return labels[rol_id];
};

  const getRoleColor = (rol_id) => {
    const colors = {
      1: 'bg-red-100 text-red-800 border-red-200',
      2: 'bg-blue-100 text-blue-800 border-blue-200',
      3: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[rol_id];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user.nombre_completo}</h2>
            <p className="text-gray-600">@{user.nombre_usuario}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
            >
              <Edit size={18} />
              <span>Editar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user.nombre_completo}</h3>
              <p className="text-gray-600">{user.posicion}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 text-sm rounded-full border ${getRoleColor(user.rol.id)}`}>
                  {getRoleLabel(user.rol.id)}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  user.esta_activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.esta_activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-gray-800">{user.telefono}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Laboral</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Building size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Departamento</label>
                  <p className="text-gray-800">{user.departamento}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Posición</label>
                  <p className="text-gray-800">{user.posicion}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Rol en el Sistema</label>
                  <p className="text-gray-800">{getRoleLabel(user.rol.id)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Usuario del Sistema</label>
                  <p className="text-gray-800 font-mono">@{user.nombre_usuario}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Información del Sistema</h3>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <label className="font-medium text-gray-600">Fecha de Creación</label>
                <p className="text-gray-800">{new Date(user.fecha_creacion).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;