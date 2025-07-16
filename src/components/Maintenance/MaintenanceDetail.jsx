import React from 'react';
import { X, Edit, Wrench, Monitor, User, FileText, DollarSign, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const MaintenanceDetail = ({ maintenance, onClose, onEdit }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <Clock size={16} className="text-yellow-600" />;
      case 'en_progreso':
        return <Wrench size={16} className="text-blue-600" />;
      case 'completado':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelado':
        return <AlertTriangle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: 'Pendiente',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_progreso: 'bg-blue-100 text-blue-800 border-blue-200',
      completado: 'bg-green-100 text-green-800 border-green-200',
      cancelado: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      pendiente: 'Mantenimiento reportado, esperando asignación de técnico',
      en_progreso: 'Mantenimiento en curso, técnico trabajando en el equipo',
      completado: 'Mantenimiento finalizado exitosamente',
      cancelado: 'Mantenimiento cancelado o pospuesto'
    };
    return descriptions[status] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Mantenimiento #{maintenance.id}
              </h2>
              <p className="text-gray-600">
                {maintenance.equipo?.codigo_inventario} - {maintenance.equipo?.tipo}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(maintenance.estado)}
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(maintenance.estado)}`}>
                  {getStatusLabel(maintenance.estado)}
                </span>
                <span className="text-sm text-gray-500">
                  {getStatusDescription(maintenance.estado)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
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
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                <span>Información del Equipo</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Código de Inventario</label>
                    <p className="text-gray-800 text-lg font-mono">{maintenance.equipo?.codigo_inventario}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Tipo</label>
                    <p className="text-gray-800">{maintenance.equipo?.tipo}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Marca y Modelo</label>
                    <p className="text-gray-800">{maintenance.equipo?.marca} {maintenance.equipo?.modelo}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Estado del Equipo</label>
                    <p className="text-gray-800">{maintenance.equipo?.estado}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <span>Información del Personal</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Reportado por</label>
                    <p className="text-gray-800 text-lg">{maintenance.reportado_por?.nombre_completo}</p>
                    <p className="text-sm text-gray-600">{maintenance.reportado_por?.email}</p>
                  </div>
                </div>
                
                {maintenance.tecnico && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Técnico Asignado</label>
                      <p className="text-gray-800 text-lg">{maintenance.tecnico.nombre_completo}</p>
                      <p className="text-sm text-gray-600">{maintenance.tecnico.email}</p>
                    </div>
                  </div>
                )}
                
                {!maintenance.tecnico && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Técnico Asignado</label>
                      <p className="text-gray-600">Sin asignar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descripción del Problema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Descripción del Problema</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{maintenance.descripcion_problema}</p>
            </div>
          </div>

          {/* Observaciones */}
          {maintenance.observaciones && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Observaciones</span>
              </h3>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{maintenance.observaciones}</p>
              </div>
            </div>
          )}

          {/* Información Temporal y Costos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span>Información Temporal</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Fecha de Inicio</label>
                    <p className="text-gray-800">
                      {new Date(maintenance.fecha_inicio).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(maintenance.fecha_inicio).toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                </div>
                
                {maintenance.fecha_fin && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Fecha de Finalización</label>
                      <p className="text-gray-800">
                        {new Date(maintenance.fecha_fin).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(maintenance.fecha_fin).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                )}
                
                {maintenance.fecha_fin && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Duración</label>
                      <p className="text-gray-800">
                        {Math.ceil((new Date(maintenance.fecha_fin) - new Date(maintenance.fecha_inicio)) / (1000 * 60 * 60 * 24))} días
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Información de Costos</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Costo del Mantenimiento</label>
                    <p className="text-gray-800 text-lg font-medium">
                      {maintenance.costo ? `$${parseFloat(maintenance.costo).toFixed(2)}` : 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span>Información del Sistema</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-green-400" />
                <div>
                  <label className="font-medium text-gray-600">ID del Registro</label>
                  <p className="text-gray-800 font-mono">#{maintenance.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-green-400" />
                <div>
                  <label className="font-medium text-gray-600">Estado Actual</label>
                  <p className="text-gray-800">{getStatusLabel(maintenance.estado)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Notas</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Los mantenimientos pendientes esperan asignación de técnico</li>
              <li>• Los mantenimientos en progreso indican trabajo activo</li>
              <li>• Los mantenimientos completados requieren fecha de finalización</li>
              <li>• Solo administradores pueden eliminar registros de mantenimiento</li>
              <li>• El estado del equipo se actualiza automáticamente según el mantenimiento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetail; 