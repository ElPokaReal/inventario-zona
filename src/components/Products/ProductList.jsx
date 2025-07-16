import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';
import { exportToCSV } from '../../utils/exportUtils';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [user?.token]);

  const fetchProducts = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/articulos', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!user?.token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/categorias', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || product.categoria?.id === parseInt(filterCategory);
    const matchesStatus = !filterStatus || product.estado === filterStatus;
    const matchesActive = !filterActive || 
      (filterActive === 'active' && product.esta_activo) ||
      (filterActive === 'inactive' && !product.esta_activo);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesActive;
  });

  const handleSave = async (productData) => {
    try {
      if (selectedProduct) {
        await axios.put(`http://localhost:5000/api/articulos/${selectedProduct.id}`, productData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Artículo actualizado exitosamente', {
          duration: 3000,
          icon: '✅',
        });
      } else {
        await axios.post('http://localhost:5000/api/articulos', productData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Artículo creado exitosamente', {
          duration: 3000,
          icon: '✅',
        });
      }
      fetchProducts();
      setShowForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      let errorMessage = 'Error al guardar el artículo';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tiene permisos para guardar artículos.';
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
    if (window.confirm('¿Está seguro de que desea eliminar este artículo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/articulos/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        toast.success('Artículo eliminado exitosamente', {
          duration: 3000,
          icon: '🗑️',
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        let errorMessage = 'Error al eliminar el artículo';
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar artículos.';
              break;
            case 404:
              errorMessage = 'Artículo no encontrado.';
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

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleExport = () => {
    try {
      const exportData = filteredProducts.map(product => ({
        'Código': product.codigo,
        'Nombre': product.nombre,
        'Descripción': product.descripcion,
        'Categoría': product.categoria?.nombre || 'Sin categoría',
        'Número de Serie': product.numero_serie || 'N/A',
        'Stock Actual': product.stock_actual,
        'Stock Mínimo': product.stock_minimo,
        'Stock Máximo': product.stock_maximo || 'N/A',
        'Ubicación': product.ubicacion,
        'Estado': getStatusLabel(product.estado),
        'Activo': product.esta_activo ? 'Sí' : 'No',
        'Fecha Creación': new Date(product.fecha_creacion).toLocaleDateString(),
        'Fecha Actualización': product.fecha_actualizacion ? new Date(product.fecha_actualizacion).toLocaleDateString() : 'N/A'
      }));
      
      exportToCSV(exportData, 'inventario-articulos');
      toast.success(`Exportación completada: ${exportData.length} artículos exportados`, {
        duration: 3000,
        icon: '📊',
      });
    } catch (error) {
      toast.error('Error al exportar los datos', {
        duration: 4000,
      });
    }
  };

  const getStockStatus = (product) => {
    if (product.stock_actual === 0) {
      return { label: 'Sin Stock', color: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (product.stock_actual <= product.stock_minimo) {
      return { label: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    } else if (product.stock_maximo && product.stock_actual > product.stock_maximo) {
      return { label: 'Sobrestock', color: 'bg-purple-100 text-purple-800', icon: AlertTriangle };
    } else {
      return { label: 'Normal', color: 'bg-green-100 text-green-800', icon: CheckCircle };
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
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Artículos</h2>
          <p className="text-gray-600">Administre el inventario de artículos y consumibles</p>
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
              setSelectedProduct(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
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
              {filteredProducts.length} artículos encontrados
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const StockIcon = stockStatus.icon;
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.nombre}</h3>
                    <p className="text-sm text-gray-600">{product.codigo}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.estado)}`}>
                    {getStatusLabel(product.estado)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.esta_activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.esta_activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.descripcion}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Categoría: {product.categoria?.nombre || 'Sin categoría'}</span>
                  <div className="flex items-center space-x-1">
                    <StockIcon size={14} className={stockStatus.color.replace('bg-', 'text-').split(' ')[0]} />
                    <span className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="font-medium text-gray-800">{product.stock_actual}</p>
                    <p className="text-gray-500">Actual</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-800">{product.stock_minimo}</p>
                    <p className="text-gray-500">Mínimo</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-800">{product.stock_maximo || '∞'}</p>
                    <p className="text-gray-500">Máximo</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Ubicación: {product.ubicacion}</p>
                  {product.numero_serie && <p>Serie: {product.numero_serie}</p>}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(product)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Eye size={16} />
                  <span>Ver</span>
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron artículos que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={selectedProduct || undefined}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => {
            setShowDetail(false);
            setSelectedProduct(null);
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

export default ProductList;