import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, ArrowUpDown, Package, Calendar, User, MapPin } from 'lucide-react';
import api from '../../utils/axiosConfig';
import MovementForm from './MovementForm';
import MovementDetail from './MovementDetail';
import { exportToCSV } from '../../utils/exportUtils';
import { useAuth } from '../../hooks/useAuth';

const MovementList = () => {
  const { user } = useAuth();
  const [movements, setMovements] = useState([]);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterArticle, setFilterArticle] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
    fetchArticles();
    fetchUsers();
  }, [user?.token]);

  const fetchMovements = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await api.get('/api/movimientos');
      setMovements(response.data);
    } catch (error) {
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    if (!user?.token) return;
    try {
      const response = await api.get('/api/articulos');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchUsers = async () => {
    if (!user?.token) return;
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.articulo?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.articulo?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.usuario?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || movement.tipo === filterType;
    const matchesArticle = !filterArticle || movement.articulo?.id === parseInt(filterArticle);
    const matchesUser = !filterUser || movement.usuario?.id === parseInt(filterUser);
    const matchesDate = !filterDate || new Date(movement.fecha_creacion).toDateString() === new Date(filterDate).toDateString();
    
    return matchesSearch && matchesType && matchesArticle && matchesUser && matchesDate;
  });

  const handleSave = async (movementData) => {
    try {
      if (selectedMovement) {
        await api.put(`/api/movimientos/${selectedMovement.id}`, movementData);
      } else {
        await api.post('/api/movimientos', movementData);
      }
      fetchMovements();
      setShowForm(false);
      setSelectedMovement(null);
    } catch (error) {
      console.error('Error saving movement:', error);
      alert('Error al guardar el movimiento: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este movimiento? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/api/movimientos/${id}`);
        
        alert('Movimiento eliminado exitosamente');
        fetchMovements();
      } catch (error) {
        console.error('Error deleting movement:', error);
        let errorMessage = 'Error al eliminar el movimiento';
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar movimientos.';
              break;
            case 404:
              errorMessage = 'Movimiento no encontrado.';
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

  const handleEdit = (movement) => {
    setSelectedMovement(movement);
    setShowForm(true);
  };

  const handleView = (movement) => {
    setSelectedMovement(movement);
    setShowDetail(true);
  };

  const handleExport = () => {
    const exportData = filteredMovements.map(movement => ({
      'ID': movement.id,
      'Artículo': movement.articulo?.nombre || 'N/A',
      'Código Artículo': movement.articulo?.codigo || 'N/A',
      'Tipo': getTypeLabel(movement.tipo),
      'Cantidad': movement.cantidad,
      'Stock Anterior': movement.stock_anterior,
      'Stock Nuevo': movement.stock_nuevo,
      'Motivo': movement.motivo,
      'Referencia': movement.referencia || 'N/A',
      'Ubicación Origen': movement.ubicacion_origen || 'N/A',
      'Ubicación Destino': movement.ubicacion_destino || 'N/A',
      'Asignado a': movement.asignado_a || 'N/A',
      'Recibido por': movement.recibido_por || 'N/A',
      'Usuario': movement.usuario?.nombre_completo || 'N/A',
      'Fecha': new Date(movement.fecha_creacion).toLocaleString('es-ES'),
      'Observaciones': movement.observaciones || 'N/A'
    }));
    
    exportToCSV(exportData, 'movimientos');
  };

  const getTypeLabel = (type) => {
    const labels = {
      entrada: 'Entrada',
      salida: 'Salida',
      transferencia: 'Transferencia',
      asignacion: 'Asignación',
      devolucion: 'Devolución',
      mantenimiento: 'Mantenimiento'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      entrada: 'bg-green-100 text-green-800 border-green-200',
      salida: 'bg-red-100 text-red-800 border-red-200',
      transferencia: 'bg-blue-100 text-blue-800 border-blue-200',
      asignacion: 'bg-purple-100 text-purple-800 border-purple-200',
      devolucion: 'bg-orange-100 text-orange-800 border-orange-200',
      mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
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
          <h2 className="text-2xl font-bold text-gray-800">Historial de Movimientos</h2>
          <p className="text-gray-600">Registro de todas las transacciones de inventario</p>
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
              setSelectedMovement(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nuevo Movimiento</span>
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
              placeholder="Buscar movimientos..."
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
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="transferencia">Transferencia</option>
            <option value="asignacion">Asignación</option>
            <option value="devolucion">Devolución</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>

          <select
            value={filterArticle}
            onChange={(e) => setFilterArticle(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los artículos</option>
            {articles.map(article => (
              <option key={article.id} value={article.id}>{article.nombre}</option>
            ))}
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los usuarios</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.nombre_completo}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredMovements.length} movimientos encontrados
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getTypeIcon(movement.tipo)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getTypeLabel(movement.tipo)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {movement.motivo}
                        </div>
                        {movement.referencia && (
                          <div className="text-xs text-gray-400 font-mono">
                            Ref: {movement.referencia}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {movement.articulo?.nombre}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {movement.articulo?.codigo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {movement.cantidad}
                    </div>
                    <div className="text-xs text-gray-500">
                      {movement.stock_anterior} → {movement.stock_nuevo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900">
                        {movement.usuario?.nombre_completo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900">
                        {new Date(movement.fecha_creacion).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(movement.fecha_creacion).toLocaleTimeString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(movement)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(movement)}
                        className="text-amber-600 hover:text-amber-900 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      {user?.role === 'administrador' && (
                        <button
                          onClick={() => handleDelete(movement.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMovements.length === 0 && !loading && (
        <div className="text-center py-12">
          <ArrowUpDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron movimientos que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <MovementForm
          movement={selectedMovement || undefined}
          articles={articles}
          users={users}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedMovement(null);
          }}
        />
      )}

      {showDetail && selectedMovement && (
        <MovementDetail
          movement={selectedMovement}
          onClose={() => {
            setShowDetail(false);
            setSelectedMovement(null);
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

export default MovementList;