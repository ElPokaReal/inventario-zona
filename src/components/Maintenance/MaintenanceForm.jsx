import React, { useState, useEffect } from 'react';
import { X, Save, Wrench, Monitor, User, FileText, DollarSign, Calendar, Clock } from 'lucide-react';

const MaintenanceForm = ({ maintenance, equipments, users, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    equipo_id: '',
    descripcion_problema: '',
    estado: 'pendiente',
    costo: '',
    observaciones: '',
    tecnico_usuario_id: '',
    fecha_fin: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    if (maintenance) {
      setFormData({
        equipo_id: maintenance.equipo?.id || '',
        descripcion_problema: maintenance.descripcion_problema || '',
        estado: maintenance.estado || 'pendiente',
        costo: maintenance.costo || '',
        observaciones: maintenance.observaciones || '',
        tecnico_usuario_id: maintenance.tecnico?.id || '',
        fecha_fin: maintenance.fecha_fin ? new Date(maintenance.fecha_fin).toISOString().split('T')[0] : ''
      });
      setSelectedEquipment(maintenance.equipo);
    }
  }, [maintenance]);

  useEffect(() => {
    if (formData.equipo_id) {
      const equipment = equipments.find(e => e.id === parseInt(formData.equipo_id));
      setSelectedEquipment(equipment);
    } else {
      setSelectedEquipment(null);
    }
  }, [formData.equipo_id, equipments]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.equipo_id) {
      newErrors.equipo_id = 'El equipo es obligatorio';
    }

    if (!formData.descripcion_problema.trim()) {
      newErrors.descripcion_problema = 'La descripción del problema es obligatoria';
    } else if (formData.descripcion_problema.trim().length < 10) {
      newErrors.descripcion_problema = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData.costo && parseFloat(formData.costo) < 0) {
      newErrors.costo = 'El costo no puede ser negativo';
    }

    if (formData.estado === 'completado' && !formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de finalización es obligatoria para mantenimientos completados';
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
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      pendiente: 'Mantenimiento reportado, esperando asignación',
      en_progreso: 'Mantenimiento en curso, técnico trabajando',
      completado: 'Mantenimiento finalizado exitosamente',
      cancelado: 'Mantenimiento cancelado o pospuesto'
    };
    return descriptions[status] || '';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return '⏳';
      case 'en_progreso':
        return '🔧';
      case 'completado':
        return '✅';
      case 'cancelado':
        return '❌';
      default:
        return '📋';
    }
  };

  const getTechnicians = () => {
    console.log('All users:', users);
    const technicians = users.filter(user => {
      console.log('User:', user.nombre_completo, 'Role ID:', user.rol?.id);
      return user.rol?.id === 2; // ID 2 = técnico
    });
    console.log('Filtered technicians:', technicians);
    return technicians;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {maintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
              </h3>
              <p className="text-sm text-gray-600">
                {maintenance ? 'Modifique los datos del mantenimiento' : 'Registre un nuevo mantenimiento o reparación'}
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
            {/* Equipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo *
              </label>
              <div className="relative">
                <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="equipo_id"
                  value={formData.equipo_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.equipo_id ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                >
                  <option value="">Seleccione un equipo</option>
                  {equipments.map(equipment => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.codigo_inventario} - {equipment.tipo} ({equipment.marca} {equipment.modelo})
                    </option>
                  ))}
                </select>
              </div>
              {errors.equipo_id && (
                <p className="mt-1 text-sm text-red-600">{errors.equipo_id}</p>
              )}
              {selectedEquipment && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Estado actual:</strong> {selectedEquipment.estado}
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedEquipment.descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-2xl">{getStatusIcon(formData.estado)}</span>
                <span>{getStatusDescription(formData.estado)}</span>
              </div>
            </div>

            {/* Técnico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Técnico Asignado
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="tecnico_usuario_id"
                  value={formData.tecnico_usuario_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="">Sin asignar</option>
                  {getTechnicians().map(technician => (
                    <option key={technician.id} value={technician.id}>
                      {technician.nombre_completo} - {technician.departamento}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">Opcional: Asignar un técnico específico</p>
            </div>

            {/* Costo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.costo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.costo && (
                <p className="mt-1 text-sm text-red-600">{errors.costo}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Opcional: Costo del mantenimiento en dólares</p>
            </div>

            {/* Fecha de Finalización */}
            {formData.estado === 'completado' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Finalización *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.fecha_fin ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.fecha_fin && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>
                )}
              </div>
            )}
          </div>

          {/* Descripción del Problema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Problema *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                name="descripcion_problema"
                value={formData.descripcion_problema}
                onChange={handleChange}
                rows={4}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.descripcion_problema ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Describa detalladamente el problema o falla del equipo..."
              />
            </div>
            {errors.descripcion_problema && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion_problema}</p>
            )}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                placeholder="Observaciones adicionales sobre el mantenimiento, repuestos utilizados, etc."
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Opcional: Información adicional sobre el mantenimiento</p>
          </div>

          {/* Resumen del Mantenimiento */}
          {selectedEquipment && (
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Resumen del Mantenimiento</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Equipo:</span>
                  <p className="font-medium">{selectedEquipment.codigo_inventario}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <p className="font-medium">{selectedEquipment.tipo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Estado Actual:</span>
                  <p className="font-medium">{selectedEquipment.estado}</p>
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
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Guardando...' : (maintenance ? 'Actualizar' : 'Crear')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm; 