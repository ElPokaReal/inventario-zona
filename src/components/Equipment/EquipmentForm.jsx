import React, { useState, useEffect } from 'react';
import { X, Save, Monitor, Hash, FileText, Tag, MapPin, User, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const EquipmentForm = ({ equipment, areas, users, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    codigo_inventario: '',
    tipo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    estado: 'disponible',
    descripcion: '',
    especificaciones: '',
    ubicacion_actual_id: '',
    asignado_a_usuario_id: '',
    esta_activo: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (equipment) {
      setFormData({
        codigo_inventario: equipment.codigo_inventario || '',
        tipo: equipment.tipo || '',
        marca: equipment.marca || '',
        modelo: equipment.modelo || '',
        numero_serie: equipment.numero_serie || '',
        estado: equipment.estado || 'disponible',
        descripcion: equipment.descripcion || '',
        especificaciones: equipment.especificaciones || '',
        ubicacion_actual_id: equipment.ubicacion_actual?.id || '',
        asignado_a_usuario_id: equipment.asignado_a?.id || '',
        esta_activo: equipment.esta_activo !== undefined ? equipment.esta_activo : true
      });
    }
  }, [equipment]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo_inventario.trim()) {
      newErrors.codigo_inventario = 'El código de inventario es obligatorio';
    } else if (formData.codigo_inventario.trim().length < 2) {
      newErrors.codigo_inventario = 'El código debe tener al menos 2 caracteres';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo es obligatorio';
    } else if (formData.tipo.trim().length < 2) {
      newErrors.tipo = 'El tipo debe tener al menos 2 caracteres';
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es obligatoria';
    } else if (formData.marca.trim().length < 2) {
      newErrors.marca = 'La marca debe tener al menos 2 caracteres';
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es obligatorio';
    } else if (formData.modelo.trim().length < 2) {
      newErrors.modelo = 'El modelo debe tener al menos 2 caracteres';
    }

    if (!formData.numero_serie.trim()) {
      newErrors.numero_serie = 'El número de serie es obligatorio';
    } else if (formData.numero_serie.trim().length < 2) {
      newErrors.numero_serie = 'El número de serie debe tener al menos 2 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.ubicacion_actual_id) {
      newErrors.ubicacion_actual_id = 'La ubicación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, complete todos los campos obligatorios.');
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {equipment ? 'Editar Equipo' : 'Nuevo Equipo'}
              </h3>
              <p className="text-sm text-gray-600">
                {equipment ? 'Modifique los datos del equipo' : 'Complete la información del equipo'}
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
            {/* Código de Inventario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Inventario *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="codigo_inventario"
                  value={formData.codigo_inventario}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.codigo_inventario ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Ej: EQ-001"
                />
              </div>
              {errors.codigo_inventario && (
                <p className="mt-1 text-sm text-red-600">{errors.codigo_inventario}</p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Equipo *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.tipo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Ej: Computadora, Impresora, Router"
                />
              </div>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
              )}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <div className="relative">
                <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.marca ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Ej: Dell, HP, Cisco"
                />
              </div>
              {errors.marca && (
                <p className="mt-1 text-sm text-red-600">{errors.marca}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <div className="relative">
                <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.modelo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Ej: OptiPlex 7090, LaserJet Pro"
                />
              </div>
              {errors.modelo && (
                <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
              )}
            </div>

            {/* Número de Serie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Serie *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="numero_serie"
                  value={formData.numero_serie}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.numero_serie ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder="Número de serie del equipo"
                />
              </div>
              {errors.numero_serie && (
                <p className="mt-1 text-sm text-red-600">{errors.numero_serie}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              >
                <option value="disponible">Disponible</option>
                <option value="en_uso">En Uso</option>
                <option value="en_mantenimiento">Mantenimiento</option>
                <option value="en_reparacion">Reparación</option>
                <option value="retirado">Dado de Baja</option>
              </select>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación Actual *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="ubicacion_actual_id"
                  value={formData.ubicacion_actual_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.ubicacion_actual_id ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                >
                  <option value="">Seleccione una ubicación</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.nombre}</option>
                  ))}
                </select>
              </div>
              {errors.ubicacion_actual_id && (
                <p className="mt-1 text-sm text-red-600">{errors.ubicacion_actual_id}</p>
              )}
            </div>

            {/* Asignado a */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignado a
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="asignado_a_usuario_id"
                  value={formData.asignado_a_usuario_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="">Sin asignar</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.nombre_completo}</option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">Opcional: Asignar el equipo a un usuario específico</p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.descripcion ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Descripción detallada del equipo, características principales, etc."
              />
            </div>
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          {/* Especificaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especificaciones Técnicas
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                name="especificaciones"
                value={formData.especificaciones}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                placeholder="Especificaciones técnicas detalladas, configuración, características especiales, etc."
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Opcional: Especificaciones técnicas detalladas del equipo</p>
          </div>

          {/* Estado Activo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado del Equipo
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, esta_activo: !prev.esta_activo }))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  formData.esta_activo
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                {formData.esta_activo ? (
                  <ToggleRight size={18} className="text-green-600" />
                ) : (
                  <ToggleLeft size={18} className="text-gray-600" />
                )}
                <span>{formData.esta_activo ? 'Activo' : 'Inactivo'}</span>
              </button>
              <p className="text-sm text-gray-600">
                {formData.esta_activo 
                  ? 'El equipo estará disponible para uso y asignaciones' 
                  : 'El equipo no estará disponible para uso'
                }
              </p>
            </div>
          </div>

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
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Guardando...' : (equipment ? 'Actualizar' : 'Crear')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;