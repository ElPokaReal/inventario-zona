import React, { useState, useEffect } from 'react';
import { X, Save, Building, Hash, FileText, ToggleLeft, ToggleRight, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const AreaForm = ({ area, onSave, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    responsable_id: '',
    esta_activa: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responsables, setResponsables] = useState([]);
  const [loadingResponsables, setLoadingResponsables] = useState(false);

  useEffect(() => {
    if (area) {
      setFormData({
        nombre: area.nombre || '',
        descripcion: area.descripcion || '',
        codigo: area.codigo || '',
        responsable_id: area.responsable?.id || '',
        esta_activa: area.esta_activa !== undefined ? area.esta_activa : true
      });
    }
  }, [area]);

  useEffect(() => {
    fetchResponsables();
  }, [user?.token]);

  const fetchResponsables = async () => {
    if (!user?.token) return;
    try {
      setLoadingResponsables(true);
      const response = await axios.get('http://localhost:5000/api/areas/responsables', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setResponsables(response.data);
    } catch (error) {
      console.error('Error fetching responsables:', error);
    } finally {
      setLoadingResponsables(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del área es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.codigo && formData.codigo.trim().length < 2) {
      newErrors.codigo = 'El código debe tener al menos 2 caracteres';
    }

    if (formData.descripcion && formData.descripcion.trim().length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {area ? 'Editar Área' : 'Nueva Área'}
              </h3>
              <p className="text-sm text-gray-600">
                {area ? 'Modifique los datos del área' : 'Complete la información del área'}
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
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Área *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Ej: Área de Producción"
              />
            </div>
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  errors.codigo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                }`}
                placeholder="Ej: PROD-001"
              />
            </div>
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Opcional: Código único para identificar el área</p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
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
                placeholder="Descripción detallada del área..."
              />
            </div>
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.descripcion.length}/500 caracteres
            </p>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable del Área
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="responsable_id"
                value={formData.responsable_id}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  errors.responsable_id ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
                }`}
                disabled={loadingResponsables}
              >
                <option value="">Seleccionar responsable...</option>
                {responsables.map((responsable) => (
                  <option key={responsable.id} value={responsable.id}>
                    {responsable.nombre_completo} - {responsable.departamento}
                  </option>
                ))}
              </select>
            </div>
            {errors.responsable_id && (
              <p className="mt-1 text-sm text-red-600">{errors.responsable_id}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Opcional: Usuario responsable de gestionar esta área
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, esta_activa: !prev.esta_activa }))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  formData.esta_activa
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                {formData.esta_activa ? (
                  <ToggleRight size={18} className="text-green-600" />
                ) : (
                  <ToggleLeft size={18} className="text-gray-600" />
                )}
                <span>{formData.esta_activa ? 'Activa' : 'Inactiva'}</span>
              </button>
              <p className="text-sm text-gray-600">
                {formData.esta_activa 
                  ? 'El área estará disponible para asignaciones' 
                  : 'El área no estará disponible para asignaciones'
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
              <span>{isSubmitting ? 'Guardando...' : (area ? 'Actualizar' : 'Crear')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AreaForm; 