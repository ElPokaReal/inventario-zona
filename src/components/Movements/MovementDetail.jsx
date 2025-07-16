import React from 'react';
import { X, Edit, ArrowUpDown, Package, Hash, FileText, MapPin, User, Calendar, Clock } from 'lucide-react';

const MovementDetail = ({ movement, onClose, onEdit }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'entrada':
        return '↗️';
      case 'salida':
        return '↘️';
      case 'transferencia':
        return '↔️';
      case 'asignacion':
        return '👤';
      case 'devolucion':
        return '↩️';
      case 'mantenimiento':
        return '🔧';
      default:
        return '📦';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      entrada: 'Entrada',
      salida: 'Salida',
      transferencia: 'Transferencia',
      asignacion: 'Asignación',
      devolucion: 'Devolución',
      mantenimiento: 'Mantenimiento'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      entrada: 'bg-green-100 text-green-800 border-green-200',
      salida: 'bg-red-100 text-red-800 border-red-200',
      transferencia: 'bg-blue-100 text-blue-800 border-blue-200',
      asignacion: 'bg-purple-100 text-purple-800 border-purple-200',
      devolucion: 'bg-orange-100 text-orange-800 border-orange-200',
      mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeDescription = (type) => {
    const descriptions = {
      entrada: 'Aumenta el stock del artículo',
      salida: 'Reduce el stock del artículo',
      transferencia: 'Mueve el artículo entre ubicaciones',
      asignacion: 'Asigna el artículo a una persona o área',
      devolucion: 'Devuelve el artículo al inventario',
      mantenimiento: 'Retira temporalmente para mantenimiento'
    };
    return descriptions[type] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <ArrowUpDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Movimiento #{movement.id}
              </h2>
              <p className="text-gray-600">
                {getTypeLabel(movement.tipo)} - {movement.articulo?.nombre}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(movement.tipo)}`}>
                  {getTypeLabel(movement.tipo)}
                </span>
                <span className="text-sm text-gray-500">
                  {getTypeDescription(movement.tipo)}
                </span>
              </div>
            </div>
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
                <Package className="w-5 h-5 text-blue-600" />
                <span>Información del Artículo</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Artículo</label>
                    <p className="text-gray-800 text-lg">{movement.articulo?.nombre}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Código</label>
                    <p className="text-gray-800 font-mono">{movement.articulo?.codigo}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Cantidad</label>
                    <p className="text-gray-800 text-lg font-medium">{movement.cantidad} unidades</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Impacto en Stock</label>
                    <p className="text-gray-800">
                      <span className="font-mono">{movement.stock_anterior}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="font-mono font-medium">{movement.stock_nuevo}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <span>Información del Usuario</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Registrado por</label>
                    <p className="text-gray-800 text-lg">{movement.usuario?.nombre_completo}</p>
                    <p className="text-sm text-gray-600">{movement.usuario?.email}</p>
                  </div>
                </div>
                
                {movement.recibido_por && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Recibido por</label>
                      <p className="text-gray-800">{movement.recibido_por}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Fecha y Hora</label>
                    <p className="text-gray-800">
                      {new Date(movement.fecha_creacion).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(movement.fecha_creacion).toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del Movimiento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Detalles del Movimiento</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Motivo</label>
                    <p className="text-gray-800">{movement.motivo}</p>
                  </div>
                </div>
                
                {movement.referencia && (
                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Referencia</label>
                      <p className="text-gray-800 font-mono">{movement.referencia}</p>
                    </div>
                  </div>
                )}
                
                {movement.observaciones && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Observaciones</label>
                      <p className="text-gray-800">{movement.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {movement.ubicacion_origen && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Ubicación Origen</label>
                      <p className="text-gray-800">{movement.ubicacion_origen}</p>
                    </div>
                  </div>
                )}
                
                {movement.ubicacion_destino && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Ubicación Destino</label>
                      <p className="text-gray-800">{movement.ubicacion_destino}</p>
                    </div>
                  </div>
                )}
                
                {movement.asignado_a && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Asignado a</label>
                      <p className="text-gray-800">{movement.asignado_a}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen del Impacto */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-blue-600" />
              <span>Resumen del Impacto</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <label className="font-medium text-gray-600">Stock Anterior</label>
                  <p className="text-gray-800 font-mono">{movement.stock_anterior} unidades</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <label className="font-medium text-gray-600">Movimiento</label>
                  <p className="text-gray-800">
                    {movement.tipo === 'entrada' ? '+' : '-'}{movement.cantidad} unidades
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <label className="font-medium text-gray-600">Stock Nuevo</label>
                  <p className="text-gray-800 font-mono">{movement.stock_nuevo} unidades</p>
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
                  <label className="font-medium text-gray-600">Fecha de Creación</label>
                  <p className="text-gray-800">{new Date(movement.fecha_creacion).toLocaleString('es-ES')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Hash size={16} className="text-green-400" />
                <div>
                  <label className="font-medium text-gray-600">ID del Movimiento</label>
                  <p className="text-gray-800 font-mono">#{movement.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Notas</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Los movimientos de entrada aumentan el stock disponible</li>
              <li>• Los movimientos de salida reducen el stock disponible</li>
              <li>• Las transferencias mueven artículos entre ubicaciones sin cambiar el stock total</li>
              <li>• Las asignaciones asignan artículos a personas o áreas específicas</li>
              <li>• Solo administradores pueden eliminar movimientos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementDetail; 