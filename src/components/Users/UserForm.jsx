import React, { useState, useEffect } from 'react';
import { X, Save, User as UserIcon, Mail, Lock, Briefcase, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const UserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    nombre_completo: '',
    email: '',
    contrasena: '', // New field for password
    departamento: '',
    posicion: '',
    telefono: '',
    rol_id: 3, // Default to 'Técnico' (user)
    esta_activo: true
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre_usuario: user.nombre_usuario || '',
        nombre_completo: user.nombre_completo || '',
        email: user.email || '',
        contrasena: '', // Password is not pre-filled for security
        departamento: user.departamento || '',
        posicion: user.posicion || '',
        telefono: user.telefono || '',
        rol_id: user.rol ? user.rol.id : 3, // Map backend rol.id
        esta_activo: user.esta_activo
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre_usuario.trim()) newErrors.nombre_usuario = 'El nombre de usuario es requerido';
    if (!formData.nombre_completo.trim()) newErrors.nombre_completo = 'El nombre completo es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.departamento.trim()) newErrors.departamento = 'El departamento es requerido';
    if (!formData.posicion.trim()) newErrors.posicion = 'La posición es requerida';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';

    // Password is required only for new users
    if (!user && !formData.contrasena.trim()) newErrors.contrasena = 'La contraseña es requerida';

    // Email validation
    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    } else {
      // Mostrar toast de error de validación
      toast.error('Por favor corrija los errores en el formulario', {
        duration: 4000,
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.nombre_usuario}
                  onChange={(e) => handleChange('nombre_usuario', e.target.value)}
                  className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre_usuario ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="usuario123"
                />
              </div>
              {errors.nombre_usuario && <p className="text-red-500 text-sm mt-1">{errors.nombre_usuario}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => handleChange('nombre_completo', e.target.value)}
                  className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre_completo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Juan Pérez"
                />
              </div>
              {errors.nombre_completo && <p className="text-red-500 text-sm mt-1">{errors.nombre_completo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="usuario@empresa.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.contrasena}
                    onChange={(e) => handleChange('contrasena', e.target.value)}
                    className={`w-full pl-10 pr-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contrasena ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={formData.rol_id}
                  onChange={(e) => handleChange('rol_id', parseInt(e.target.value))}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Técnico</option>
                  <option value={3}>Usuario</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.departamento}
                  onChange={(e) => handleChange('departamento', e.target.value)}
                  className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.departamento ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Soporte Técnico"
                />
              </div>
              {errors.departamento && <p className="text-red-500 text-sm mt-1">{errors.departamento}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.posicion}
                  onChange={(e) => handleChange('posicion', e.target.value)}
                  className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.posicion ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Técnico de Soporte"
                />
              </div>
              {errors.posicion && <p className="text-red-500 text-sm mt-1">{errors.posicion}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className={`w-full pl-10 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.telefono ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+1234567890"
                />
              </div>
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.esta_activo}
                  onChange={(e) => handleChange('esta_activo', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Usuario activo</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Save size={18} />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;