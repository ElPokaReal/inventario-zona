import React from 'react';
import { X, Edit, Package, MapPin, Hash, FileText, Tag, BarChart3, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ProductDetail = ({ product, onClose, onEdit }) => {
  const getStockStatus = () => {
    if (product.stock_actual === 0) {
      return { label: 'Sin Stock', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
    } else if (product.stock_actual <= product.stock_minimo) {
      return { label: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle };
    } else if (product.stock_maximo && product.stock_actual > product.stock_maximo) {
      return { label: 'Sobrestock', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertTriangle };
    } else {
      return { label: 'Stock Normal', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
    }
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

  const getStatusColor = (status) => {
    const colors = {
      disponible: 'bg-green-100 text-green-800 border-green-200',
      en_uso: 'bg-blue-100 text-blue-800 border-blue-200',
      en_mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_reparacion: 'bg-orange-100 text-orange-800 border-orange-200',
      retirado: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{product.nombre}</h2>
              <p className="text-gray-600 font-mono">{product.codigo}</p>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Información Básica</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Código del Artículo</label>
                    <p className="text-gray-800 font-mono text-lg">{product.codigo}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Categoría</label>
                    <p className="text-gray-800">{product.categoria?.nombre || 'Sin categoría'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Estado del Artículo</label>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full border ${getStatusColor(product.estado)}`}>
                      {getStatusLabel(product.estado)}
                    </span>
                  </div>
                </div>

                {product.numero_serie && (
                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                      <p className="text-gray-800 font-mono">{product.numero_serie}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      product.esta_activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.esta_activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Inventario</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Cantidad Disponible</label>
                    <p className="text-gray-800 text-2xl font-bold">{product.stock_actual} unidades</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <StockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600">Estado del Stock</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-3 py-1 text-sm rounded-full border ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                      {product.stock_actual <= product.stock_minimo && (
                        <AlertTriangle size={16} className="text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-sm font-medium text-gray-600">Stock Mínimo</label>
                    <p className="text-gray-800 text-lg font-semibold">{product.stock_minimo} unidades</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-sm font-medium text-gray-600">Stock Máximo</label>
                    <p className="text-gray-800 text-lg font-semibold">{product.stock_maximo || '∞'} unidades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>Ubicación</span>
            </h3>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600">Ubicación Actual</label>
                <p className="text-gray-800 text-lg">{product.ubicacion}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Descripción Detallada</span>
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{product.descripcion}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Información del Sistema</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-400" />
                <div>
                  <label className="font-medium text-gray-600">Creado el</label>
                  <p className="text-gray-800">{new Date(product.fecha_creacion).toLocaleString('es-ES')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-400" />
                <div>
                  <label className="font-medium text-gray-600">Última actualización</label>
                  <p className="text-gray-800">
                    {product.fecha_actualizacion 
                      ? new Date(product.fecha_actualizacion).toLocaleString('es-ES')
                      : 'No actualizado'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;