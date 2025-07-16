import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Monitor, AlertTriangle, CheckCircle, XCircle, MapPin, User } from 'lucide-react';
import axios from 'axios';
import EquipmentForm from './EquipmentForm';
import EquipmentDetail from './EquipmentDetail';
import { exportToCSV } from '../../utils/exportUtils';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const EquipmentList = () => {
  const { user } = useAuth();
  const [equipments, setEquipments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
    fetchAreas();
    fetchUsers();
  }, [user?.token]);

  const fetchEquipments = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/equipos', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    if (!user?.token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/areas', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAreas(response.data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

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
    }
  };

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (equipment.descripcion && equipment.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || equipment.tipo === filterType;
    const matchesStatus = !filterStatus || equipment.estado === filterStatus;
    const matchesArea = !filterArea || equipment.ubicacion_actual?.id === parseInt(filterArea);
    const matchesActive = !filterActive || 
      (filterActive === 'active' && equipment.esta_activo) ||
      (filterActive === 'inactive' && !equipment.esta_activo);
    
    return matchesSearch && matchesType && matchesStatus && matchesArea && matchesActive;
  });

  const handleSave = async (equipmentData) => {
    try {
      if (selectedEquipment) {
        await axios.put(`http://localhost:5000/api/equipos/${selectedEquipment.id}`, equipmentData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Equipo actualizado exitosamente', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await axios.post('http://localhost:5000/api/equipos', equipmentData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Equipo creado exitosamente', {
          duration: 3000,
          icon: '✅',
        });
      }
      fetchEquipments();
      setShowForm(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Error saving equipment:', error);
      let errorMessage = 'Error al guardar el equipo';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tiene permisos para guardar equipos.';
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
      
      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este equipo? Esta acción no se puede deshacer.')) {
      try {
        await axios.delete(`http://localhost:5000/api/equipos/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        toast.success('Equipo eliminado exitosamente', {
          duration: 3000,
          icon: '🗑️',
        });
        fetchEquipments();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        let errorMessage = 'Error al eliminar el equipo';
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar equipos.';
              break;
            case 404:
              errorMessage = 'Equipo no encontrado.';
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
        
        toast.error(errorMessage, {
          duration: 4000,
        });
      }
    }
  };

  const handleEdit = (equipment) => {
    setSelectedEquipment(equipment);
    setShowForm(true);
  };

  const handleView = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDetail(true);
  };

  const handleExport = () => {
    try {
      const exportData = filteredEquipments.map(equipment => ({
        'Código Inventario': equipment.codigo_inventario,
        'Tipo': equipment.tipo,
        'Marca': equipment.marca,
        'Modelo': equipment.modelo,
        'Número de Serie': equipment.numero_serie,
        'Estado': getStatusLabel(equipment.estado),
        'Ubicación': equipment.ubicacion_actual?.nombre || 'Sin ubicación',
        'Asignado a': equipment.asignado_a?.nombre_completo || 'Sin asignar',
        'Descripción': equipment.descripcion,
        'Activo': equipment.esta_activo ? 'Sí' : 'No',
        'Fecha Creación': new Date(equipment.fecha_creacion).toLocaleDateString(),
        'Fecha Actualización': equipment.fecha_actualizacion ? new Date(equipment.fecha_actualizacion).toLocaleDateString() : 'N/A'
      }));
      
      exportToCSV(exportData, 'equipos');
      toast.success(`Exportación completada: ${exportData.length} equipos exportados`, {
        duration: 3000,
        icon: '📊',
      });
    } catch (error) {
      toast.error('Error al exportar los datos', {
        duration: 4000,
      });
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
      disponible: 'bg-green-100 text-green-800',
      en_uso: 'bg-blue-100 text-blue-800',
      en_mantenimiento: 'bg-yellow-100 text-yellow-800',
      en_reparacion: 'bg-orange-100 text-orange-800',
      retirado: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEquipmentTypes = () => {
    const types = [...new Set(equipments.map(eq => eq.tipo))];
    return types.sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Equipos</h2>
          <p className="text-gray-600">Administre el inventario de equipos y dispositivos</p>
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
              setSelectedEquipment(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nuevo Equipo</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los tipos</option>
            {getEquipmentTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="en_uso">En Uso</option>
            <option value="en_mantenimiento">Mantenimiento</option>
            <option value="en_reparacion">Reparación</option>
            <option value="retirado">Dado de Baja</option>
          </select>

          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todas las áreas</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>{area.nombre}</option>
            ))}
          </select>

          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredEquipments.length} equipos encontrados
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Equipments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{equipment.tipo}</h3>
                  <p className="text-sm text-gray-600 font-mono">{equipment.codigo_inventario}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(equipment.estado)}`}>
                  {getStatusLabel(equipment.estado)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  equipment.esta_activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {equipment.esta_activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <h4 className="font-medium text-gray-800">{equipment.marca} {equipment.modelo}</h4>
                <p className="text-sm text-gray-600 font-mono">S/N: {equipment.numero_serie}</p>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {equipment.descripcion}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-gray-600">
                    {equipment.ubicacion_actual?.nombre || 'Sin ubicación'}
                  </span>
                </div>
                
                {equipment.asignado_a && (
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-gray-600">
                      {equipment.asignado_a.nombre_completo}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleView(equipment)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye size={16} />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleEdit(equipment)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
              {user?.role === 'administrador' && (
                <button
                  onClick={() => handleDelete(equipment.id)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEquipments.length === 0 && !loading && (
        <div className="text-center py-12">
          <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron equipos que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <EquipmentForm
          equipment={selectedEquipment || undefined}
          areas={areas}
          users={users}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedEquipment(null);
          }}
        />
      )}

      {showDetail && selectedEquipment && (
        <EquipmentDetail
          equipment={selectedEquipment}
          onClose={() => {
            setShowDetail(false);
            setSelectedEquipment(null);
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

export default EquipmentList;