import React from 'react';
import { X, Edit, Tag, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';

const CategoryDetail = ({ category, onClose, onEdit }) => {
  const getStatusIcon = (isActive) => {
    return isActive ? CheckCircle : XCircle;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600' : 'text-gray-400';
  };

  const StatusIcon = getStatusIcon(category.esta_activa);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{category.nombre}</h2>
              <div className="flex items-center space-x-2">
                <StatusIcon size={16} className={getStatusColor(category.esta_activa)} />
                <span className={`text-sm ${
                  category.esta_activa ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {category.esta_activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
            >
              <Edit size={18} />
              <span>Editar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-600" />
              <span>Información de la Categoría</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  <p className="text-gray-800 text-lg font-semibold">{category.nombre}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <div className="bg-gray-50 rounded-lg p-4 mt-1">
                    <p className="text-gray-700 leading-relaxed">
                      {category.descripcion || 'Sin descripción'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      category.esta_activa 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {category.esta_activa ? 'Activa' : 'Inactiva'}
                    </span>
                    <StatusIcon size={16} className={getStatusColor(category.esta_activa)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Información del Sistema</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-400" />
                <div>
                  <label className="font-medium text-gray-600">Creada el</label>
                  <p className="text-gray-800">{new Date(category.fecha_creacion).toLocaleString('es-ES')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-400" />
                <div>
                  <label className="font-medium text-gray-600">Última actualización</label>
                  <p className="text-gray-800">
                    {category.fecha_actualizacion 
                      ? new Date(category.fecha_actualizacion).toLocaleString('es-ES')
                      : 'No actualizada'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Notas</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Las categorías activas están disponibles para asignar a artículos</li>
              <li>• Las categorías inactivas no aparecen en los formularios de artículos</li>
              <li>• Solo los administradores pueden gestionar categorías</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail; 