import React from 'react';
import { X, Edit, Building, Hash, FileText, MapPin, Calendar, Clock, CheckCircle, XCircle, User } from 'lucide-react';

const AreaDetail = ({ area, onClose, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{area.nombre}</h3>
              <p className="text-sm text-gray-600">Detalles del área</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-3 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <Edit size={16} />
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {area.esta_activa ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-600" />
              )}
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                area.esta_activa 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {area.esta_activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Nombre del Área</label>
              </div>
              <p className="text-gray-900 font-medium">{area.nombre}</p>
            </div>

            {/* Código */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Código</label>
              </div>
              <p className="text-gray-900">
                {area.codigo || (
                  <span className="text-gray-400 italic">Sin código asignado</span>
                )}
              </p>
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Responsable</label>
              </div>
              <p className="text-gray-900">
                {area.responsable ? (
                  <div>
                    <span className="font-medium">{area.responsable.nombre_completo}</span>
                    <br />
                    <span className="text-sm text-gray-600">{area.responsable.posicion}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Sin responsable asignado</span>
                )}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Descripción</label>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              {area.descripcion ? (
                <p className="text-gray-900 whitespace-pre-wrap">{area.descripcion}</p>
              ) : (
                <p className="text-gray-400 italic">Sin descripción</p>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Información de Ubicación</label>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Esta área está configurada para recibir equipos y artículos del inventario.
                {area.esta_activa 
                  ? ' Actualmente está disponible para asignaciones.' 
                  : ' Actualmente no está disponible para asignaciones.'
                }
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Creación */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
              </div>
              <p className="text-gray-900">{formatDate(area.fecha_creacion)}</p>
            </div>

            {/* Fecha de Actualización */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Última Actualización</label>
              </div>
              <p className="text-gray-900">
                {area.fecha_actualizacion ? formatDate(area.fecha_actualizacion) : 'Sin actualizaciones'}
              </p>
            </div>
          </div>

          {/* Statistics Placeholder */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Estadísticas del Área</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-gray-600">Equipos Asignados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-xs text-gray-600">Artículos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-gray-600">Movimientos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">0</p>
                <p className="text-xs text-gray-600">Mantenimientos</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Las estadísticas se actualizarán cuando se asignen equipos y artículos a esta área
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaDetail; 