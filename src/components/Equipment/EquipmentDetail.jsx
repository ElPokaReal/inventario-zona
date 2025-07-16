import React from 'react';
import { X, Edit, Monitor, Hash, FileText, MapPin, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

const EquipmentDetail = ({ equipment, onClose, onEdit }) => {
  const getStatusIcon = (isActive) => {
    return isActive ? CheckCircle : XCircle;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600' : 'text-gray-400';
  };

  const getStatusLabel = (status) => {
    const labels = {
      disponible: 'Disponible',
      en_uso: 'En Uso',
      en_mantenimiento: 'Mantenimiento',
      en_reparacion: 'Reparación',
      retirado: 'Dado de Baja'
    };
    return labels[status] || status;
  };

  const getStatusColorBadge = (status) => {
    const colors = {
      disponible: 'bg-green-100 text-green-800 border-green-200',
      en_uso: 'bg-blue-100 text-blue-800 border-blue-200',
      en_mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_reparacion: 'bg-orange-100 text-orange-800 border-orange-200',
      retirado: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const StatusIcon = getStatusIcon(equipment.esta_activo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{equipment.tipo}</h2>
              <p className="text-gray-600 font-mono">{equipment.codigo_inventario}</p>
              <div className="flex items-center space-x-2 mt-1">
                <StatusIcon size={16} className={getStatusColor(equipment.esta_activo)} />
                <span className={`text-sm ${
                  equipment.esta_activo ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {equipment.esta_activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-green-600" />
                <span>Información del Equipo</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Código de Inventario</label>
                    <p className="text-gray-800 font-mono text-lg">{equipment.codigo_inventario}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Tipo</label>
                    <p className="text-gray-800">{equipment.tipo}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Marca y Modelo</label>
                    <p className="text-gray-800">{equipment.marca} {equipment.modelo}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                    <p className="text-gray-800 font-mono">{equipment.numero_serie}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full border ${getStatusColorBadge(equipment.estado)}`}>
                      {getStatusLabel(equipment.estado)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Ubicación y Asignación</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Ubicación Actual</label>
                    <p className="text-gray-800 text-lg">{equipment.ubicacion_actual?.nombre || 'Sin ubicación'}</p>
                  </div>
                </div>
                
                {equipment.asignado_a && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Asignado a</label>
                      <p className="text-gray-800 text-lg">{equipment.asignado_a.nombre_completo}</p>
                      <p className="text-sm text-gray-600">{equipment.asignado_a.email}</p>
                    </div>
                  </div>
                )}
                
                {!equipment.asignado_a && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Asignación</label>
                      <p className="text-gray-600">Sin asignar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Descripción</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{equipment.descripcion}</p>
            </div>
          </div>

          {/* Especificaciones */}
          {equipment.especificaciones && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Especificaciones Técnicas</span>
              </h3>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{equipment.especificaciones}</p>
              </div>
            </div>
          )}

          {/* Información del Sistema */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span>Información del Sistema</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-green-400" />
                <div>
                  <label className="font-medium text-gray-600">Creado el</label>
                  <p className="text-gray-800">{new Date(equipment.fecha_creacion).toLocaleString('es-ES')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-green-400" />
                <div>
                  <label className="font-medium text-gray-600">Última actualización</label>
                  <p className="text-gray-800">
                    {equipment.fecha_actualizacion 
                      ? new Date(equipment.fecha_actualizacion).toLocaleString('es-ES')
                      : 'No actualizado'
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
              <li>• Los equipos activos están disponibles para uso y asignaciones</li>
              <li>• Los equipos inactivos no están disponibles para uso</li>
              <li>• Solo administradores pueden eliminar equipos</li>
              <li>• Técnicos y administradores pueden gestionar equipos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;