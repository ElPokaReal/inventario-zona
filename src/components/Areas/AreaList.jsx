import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, MapPin, Building, User } from 'lucide-react';
import axios from 'axios';
import AreaForm from './AreaForm';
import AreaDetail from './AreaDetail';
import { exportToCSV } from '../../utils/exportUtils';
import { useAuth } from '../../hooks/useAuth';

const AreaList = () => {
  const { user } = useAuth();
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, [user?.token]);

  const fetchAreas = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/areas', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAreas(response.data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (area.descripcion && area.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (area.codigo && area.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && area.esta_activa) ||
      (filterStatus === 'inactive' && !area.esta_activa);
    return matchesSearch && matchesStatus;
  });

  const handleSave = async (areaData) => {
    try {
      if (selectedArea) {
        await axios.put(`http://localhost:5000/api/areas/${selectedArea.id}`, areaData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      } else {
        await axios.post('http://localhost:5000/api/areas', areaData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
      fetchAreas();
      setShowForm(false);
      setSelectedArea(null);
    } catch (error) {
      console.error('Error saving area:', error);
      alert('Error al guardar el área: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta área?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/areas/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        alert('Área eliminada exitosamente');
        fetchAreas();
      } catch (error) {
        console.error('Error deleting area:', error);
        let errorMessage = 'Error al eliminar el área';
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar áreas.';
              break;
            case 404:
              errorMessage = 'Área no encontrada.';
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
        
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleEdit = (area) => {
    setSelectedArea(area);
    setShowForm(true);
  };

  const handleView = (area) => {
    setSelectedArea(area);
    setShowDetail(true);
  };

  const handleExport = () => {
    const exportData = filteredAreas.map(area => ({
      'Código': area.codigo || 'N/A',
      'Nombre': area.nombre,
      'Descripción': area.descripcion || 'N/A',
      'Responsable': area.responsable ? `${area.responsable.nombre_completo} (${area.responsable.departamento})` : 'N/A',
      'Estado': area.esta_activa ? 'Activa' : 'Inactiva',
      'Fecha Creación': new Date(area.fecha_creacion).toLocaleDateString(),
      'Fecha Actualización': area.fecha_actualizacion ? new Date(area.fecha_actualizacion).toLocaleDateString() : 'N/A'
    }));
    
    exportToCSV(exportData, 'areas-sistema');
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
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Áreas</h2>
          <p className="text-gray-600">Administre las áreas y ubicaciones del sistema</p>
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
              setSelectedArea(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nueva Área</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar áreas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredAreas.length} áreas encontradas
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <div key={area.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{area.nombre}</h3>
                  <p className="text-sm text-gray-600">{area.codigo || 'Sin código'}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  area.esta_activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {area.esta_activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {area.descripcion || 'Sin descripción'}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={14} className="mr-1" />
                <span>Ubicación registrada</span>
              </div>
              {area.responsable && (
                <div className="flex items-center text-sm text-gray-500">
                  <User size={14} className="mr-1" />
                  <span>Responsable: {area.responsable.nombre_completo}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleView(area)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye size={16} />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleEdit(area)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(area.id)}
                className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAreas.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron áreas que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <AreaForm
          area={selectedArea || undefined}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedArea(null);
          }}
        />
      )}

      {showDetail && selectedArea && (
        <AreaDetail
          area={selectedArea}
          onClose={() => {
            setShowDetail(false);
            setSelectedArea(null);
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

export default AreaList; 