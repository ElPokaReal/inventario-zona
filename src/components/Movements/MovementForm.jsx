import React, { useState, useEffect } from 'react';
import { X, Save, ArrowUpDown, Package, Hash, FileText, MapPin, User, Calendar } from 'lucide-react';

const MovementForm = ({ movement, articles, users, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    articulo_id: '',
    tipo: 'entrada',
    cantidad: 1,
    motivo: '',
    referencia: '',
    ubicacion_origen: '',
    ubicacion_destino: '',
    asignado_a: '',
    recibido_por: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (movement) {
      setFormData({
        articulo_id: movement.articulo?.id || '',
        tipo: movement.tipo || 'entrada',
        cantidad: movement.cantidad || 1,
        motivo: movement.motivo || '',
        referencia: movement.referencia || '',
        ubicacion_origen: movement.ubicacion_origen || '',
        ubicacion_destino: movement.ubicacion_destino || '',
        asignado_a: movement.asignado_a || '',
        recibido_por: movement.recibido_por || '',
        observaciones: movement.observaciones || ''
      });
      setSelectedArticle(movement.articulo);
    }
  }, [movement]);

  useEffect(() => {
    if (formData.articulo_id) {
      const article = articles.find(a => a.id === parseInt(formData.articulo_id));
      setSelectedArticle(article);
    } else {
      setSelectedArticle(null);
    }
  }, [formData.articulo_id, articles]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.articulo_id) {
      newErrors.articulo_id = 'El artículo es obligatorio';
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo es obligatorio';
    } else if (formData.motivo.trim().length < 5) {
      newErrors.motivo = 'El motivo debe tener al menos 5 caracteres';
    }

    if (formData.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    }

    // Validaciones específicas por tipo de movimiento
    if (formData.tipo === 'salida' && selectedArticle) {
      if (formData.cantidad > selectedArticle.stock_actual) {
        newErrors.cantidad = `No hay suficiente stock. Disponible: ${selectedArticle.stock_actual}`;
      }
    }

    if (formData.tipo === 'transferencia') {
      if (!formData.ubicacion_origen.trim()) {
        newErrors.ubicacion_origen = 'La ubicación de origen es obligatoria para transferencias';
      }
      if (!formData.ubicacion_destino.trim()) {
        newErrors.ubicacion_destino = 'La ubicación de destino es obligatoria para transferencias';
      }
    }

    if (formData.tipo === 'asignacion') {
      if (!formData.asignado_a.trim()) {
        newErrors.asignado_a = 'El campo "Asignado a" es obligatorio para asignaciones';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {movement ? 'Editar Movimiento' : 'Nuevo Movimiento'}
              </h3>
              <p className="text-sm text-gray-600">
                {movement ? 'Modifique los datos del movimiento' : 'Registre una nueva transacción de inventario'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Artículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artículo *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="articulo_id"
                  value={formData.articulo_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.articulo_id ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                >
                  <option value="">Seleccione un artículo</option>
                  {articles.map(article => (
                    <option key={article.id} value={article.id}>
                      {article.nombre} ({article.codigo}) - Stock: {article.stock_actual}
                    </option>
                  ))}
                </select>
              </div>
              {errors.articulo_id && (
                <p className="mt-1 text-sm text-red-600">{errors.articulo_id}</p>
              )}
              {selectedArticle && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Stock actual:</strong> {selectedArticle.stock_actual} unidades
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedArticle.descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Tipo de Movimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Movimiento *
              </label>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="asignacion">Asignación</option>
                  <option value="devolucion">Devolución</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-2xl">{getTypeIcon(formData.tipo)}</span>
                <span>{getTypeDescription(formData.tipo)}</span>
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  min="1"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.cantidad ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.cantidad && (
                <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>
              )}
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.motivo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Ej: Compra, Venta, Transferencia entre áreas"
                />
              </div>
              {errors.motivo && (
                <p className="mt-1 text-sm text-red-600">{errors.motivo}</p>
              )}
            </div>

            {/* Referencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                  placeholder="Ej: OC-001, Ticket-123, Mant-456"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Opcional: Número de orden, ticket, etc.</p>
            </div>

            {/* Ubicación Origen */}
            {formData.tipo === 'transferencia' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Origen *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="ubicacion_origen"
                    value={formData.ubicacion_origen}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.ubicacion_origen ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder="Ej: Almacén Principal, Área A"
                  />
                </div>
                {errors.ubicacion_origen && (
                  <p className="mt-1 text-sm text-red-600">{errors.ubicacion_origen}</p>
                )}
              </div>
            )}

            {/* Ubicación Destino */}
            {formData.tipo === 'transferencia' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Destino *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="ubicacion_destino"
                    value={formData.ubicacion_destino}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.ubicacion_destino ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder="Ej: Área B, Departamento IT"
                  />
                </div>
                {errors.ubicacion_destino && (
                  <p className="mt-1 text-sm text-red-600">{errors.ubicacion_destino}</p>
                )}
              </div>
            )}

            {/* Asignado a */}
            {formData.tipo === 'asignacion' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignado a *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="asignado_a"
                    value={formData.asignado_a}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.asignado_a ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder="Ej: Juan Pérez, Departamento IT"
                  />
                </div>
                {errors.asignado_a && (
                  <p className="mt-1 text-sm text-red-600">{errors.asignado_a}</p>
                )}
              </div>
            )}

            {/* Recibido por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recibido por
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="recibido_por"
                  value={formData.recibido_por}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                  placeholder="Ej: María García, Supervisor"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Opcional: Persona que recibe el artículo</p>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                placeholder="Observaciones adicionales sobre el movimiento..."
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Opcional: Información adicional relevante</p>
          </div>

          {/* Resumen del Movimiento */}
          {selectedArticle && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Resumen del Movimiento</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Artículo:</span>
                  <p className="font-medium">{selectedArticle.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600">Stock Actual:</span>
                  <p className="font-medium">{selectedArticle.stock_actual} unidades</p>
                </div>
                <div>
                  <span className="text-gray-600">Stock Después:</span>
                  <p className="font-medium">
                    {formData.tipo === 'entrada' 
                      ? selectedArticle.stock_actual + formData.cantidad
                      : formData.tipo === 'salida'
                      ? selectedArticle.stock_actual - formData.cantidad
                      : selectedArticle.stock_actual
                    } unidades
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Guardando...' : (movement ? 'Actualizar' : 'Crear')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementForm;