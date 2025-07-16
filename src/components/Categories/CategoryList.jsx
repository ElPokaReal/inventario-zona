import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Tag, AlertTriangle, CheckCircle, XCircle, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import CategoryForm from './CategoryForm';
import CategoryDetail from './CategoryDetail';
import { useAuth } from '../../hooks/useAuth';
import { useExcelExport } from '../../hooks/useExcelExport';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isExporting, exportToExcel } = useExcelExport();

  useEffect(() => {
    fetchCategories();
  }, [user?.token]);

  const fetchCategories = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/categorias', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.descripcion && category.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActive = !filterActive || 
      (filterActive === 'active' && category.esta_activa) ||
      (filterActive === 'inactive' && !category.esta_activa);
    
    return matchesSearch && matchesActive;
  });

  const handleSave = async (categoryData) => {
    try {
      if (selectedCategory) {
        await axios.put(`http://localhost:5000/api/categorias/${selectedCategory.id}`, categoryData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Categoría actualizada exitosamente', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await axios.post('http://localhost:5000/api/categorias', categoryData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Categoría creada exitosamente', {
          duration: 3000,
          icon: '✅',
        });
      }
      fetchCategories();
      setShowForm(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      let errorMessage = 'Error al guardar la categoría';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tiene permisos para guardar categorías.';
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
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.')) {
      try {
        await axios.delete(`http://localhost:5000/api/categorias/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        toast.success('Categoría eliminada exitosamente', {
          duration: 3000,
          icon: '🗑️',
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        let errorMessage = 'Error al eliminar la categoría';
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar categorías.';
              break;
            case 404:
              errorMessage = 'Categoría no encontrada.';
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

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setShowDetail(true);
  };

  const handleExport = () => {
    exportToExcel('/api/reports/export/categorias', 'export_categorias.xlsx');
  };

  const getStatusIcon = (isActive) => {
    return isActive ? CheckCircle : XCircle;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600' : 'text-gray-400';
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
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
          <p className="text-gray-600">Organice y administre las categorías de artículos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            <span>{isExporting ? 'Exportando...' : 'Exportar Excel'}</span>
          </button>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nueva Categoría</span>
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
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredCategories.length} categorías encontradas
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const StatusIcon = getStatusIcon(category.esta_activa);
          
          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.nombre}</h3>
                    <div className="flex items-center space-x-2">
                      <StatusIcon size={14} className={getStatusColor(category.esta_activa)} />
                      <span className={`text-xs ${
                        category.esta_activa ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {category.esta_activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {category.descripcion || 'Sin descripción'}
                </p>
                
                <div className="text-xs text-gray-500">
                  <p>Creada: {new Date(category.fecha_creacion).toLocaleDateString()}</p>
                  {category.fecha_actualizacion && (
                    <p>Actualizada: {new Date(category.fecha_actualizacion).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(category)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Eye size={16} />
                  <span>Ver</span>
                </button>
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron categorías que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <CategoryForm
          category={selectedCategory || undefined}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {showDetail && selectedCategory && (
        <CategoryDetail
          category={selectedCategory}
          onClose={() => {
            setShowDetail(false);
            setSelectedCategory(null);
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

export default CategoryList; 