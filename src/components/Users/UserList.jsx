import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, User, Shield } from 'lucide-react';
import axios from 'axios';
import UserForm from './UserForm';
import UserDetail from './UserDetail';
import { exportToCSV } from '../../utils/exportUtils';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [user?.token]); // Refetch users when token changes

  const fetchUsers = async () => {
    if (!user?.token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error, e.g., redirect to login if token is invalid
    }
  };

  const filteredUsers = users.filter(u => {
    // Exclude the current logged-in user from the list
    if (user?.id && u.id === user.id) {
      return false;
    }
    const matchesSearch = u.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || u.rol.id === parseInt(filterRole);
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && u.esta_activo) ||
      (filterStatus === 'inactive' && !u.esta_activo);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        await axios.put(`http://localhost:5000/api/users/${selectedUser.id}`, userData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      } else {
        await axios.post('http://localhost:5000/api/users/register', userData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
      fetchUsers(); // Refresh the list
      setShowForm(false);
      setSelectedUser(null);
      toast.success('Usuario guardado exitosamente');
    } catch (error) {
      console.error('Error saving user:', error);
      // Handle error, e.g., show an alert to the user
      let errorMessage = 'Error al guardar el usuario';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        switch (status) {
          case 401:
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tiene permisos para guardar usuarios.';
            break;
          case 404:
            errorMessage = 'Usuario no encontrado.';
            break;
          case 400:
            errorMessage = data.message || 'Solicitud inválida.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor.';
            break;
          default:
            errorMessage = data.message || `Error ${status}: ${data.message || 'Error desconocido'}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        console.log('Intentando eliminar usuario con ID:', id);
        const response = await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        console.log('Respuesta del servidor:', response.data);
        
        // Mostrar mensaje de éxito
        toast.success('Usuario eliminado exitosamente');
        
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        
        // Mostrar mensaje de error más específico
        let errorMessage = 'Error al eliminar el usuario';
        
        if (error.response) {
          // El servidor respondió con un código de estado de error
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar usuarios.';
              break;
            case 404:
              errorMessage = 'Usuario no encontrado.';
              break;
            case 400:
              errorMessage = data.message || 'Solicitud inválida.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor.';
              break;
            default:
              errorMessage = data.message || `Error ${status}: ${data.message || 'Error desconocido'}`;
          }
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          errorMessage = 'No se pudo conectar con el servidor.';
        } else {
          // Algo más causó el error
          errorMessage = error.message || 'Error desconocido';
        }
        
        toast.error(`Error: ${errorMessage}`);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleExport = () => {
    try {
      const exportData = filteredUsers.map(user => ({
        'Usuario': user.nombre_usuario,
        'Nombre': user.nombre_completo,
        'Email': user.email,
        'Rol': getRoleLabel(user.rol.id),
        'Departamento': user.departamento,
        'Posición': user.posicion,
        'Teléfono': user.telefono,
        'Estado': user.esta_activo ? 'Activo' : 'Inactivo',
        'Fecha Creación': new Date(user.fecha_creacion).toLocaleDateString()
      }));
      
      exportToCSV(exportData, 'usuarios-sistema');
      toast.success(`Exportación completada: ${exportData.length} usuarios exportados`, {
        duration: 3000,
        icon: '📊',
      });
    } catch (error) {
      toast.error('Error al exportar los datos', {
        duration: 4000,
      });
    }
  };

  const getRoleLabel = (rol_id) => {
    const labels = {
      1: 'Administrador',
      2: 'Técnico',
      3: 'Usuario'
    };
    return labels[rol_id];
  };

  const getRoleColor = (rol_id) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-green-100 text-green-800'
    };
    return colors[rol_id];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administre los usuarios del sistema de soporte técnico</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los roles</option>
            <option value={1}>Administrador</option>
            <option value={2}>Usuario</option>
            <option value={3}>Técnico</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredUsers.length} usuarios encontrados
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.nombre_usuario}</h3>
                  <p className="text-sm text-gray-600">{user.departamento}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.rol.id)}`}>
                  {getRoleLabel(user.rol.id)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.esta_activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.esta_activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-gray-800">{user.nombre_completo}</h4>
              <p className="text-sm text-gray-600">{user.posicion}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.telefono}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleView(user)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye size={16} />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleEdit(user)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron usuarios que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <UserForm
          user={selectedUser || undefined}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showDetail && selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => {
            setShowDetail(false);
            setSelectedUser(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};

export default UserList;