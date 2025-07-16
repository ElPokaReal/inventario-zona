import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Wrench, Calendar, User, Monitor, AlertTriangle, CheckCircle, Clock, FileSpreadsheet } from 'lucide-react';
import api from '../../utils/axiosConfig';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceDetail from './MaintenanceDetail';
import { useAuth } from '../../hooks/useAuth';
import { useExcelExport } from '../../hooks/useExcelExport';

const MaintenanceHistoryList = () => {
  const { user } = useAuth();
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  const [filterTechnician, setFilterTechnician] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isExporting, exportToExcel } = useExcelExport();

  useEffect(() => {
    fetchMaintenanceHistory();
    fetchEquipments();
    fetchUsers();
  }, [user?.token]);

  const fetchMaintenanceHistory = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await api.get('/api/historial-mantenimiento');
      setMaintenanceHistory(response.data);
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    if (!user?.token) return;
    try {
      const response = await api.get('/api/equipos');
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
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

  const filteredMaintenance = maintenanceHistory.filter(maintenance => {
    const matchesSearch = maintenance.descripcion_problema.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.equipo?.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.equipo?.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.reportado_por?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.tecnico?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || maintenance.estado === filterStatus;
    const matchesEquipment = !filterEquipment || maintenance.equipo?.id === parseInt(filterEquipment);
    const matchesTechnician = !filterTechnician || maintenance.tecnico?.id === parseInt(filterTechnician);
    const matchesDate = !filterDate || new Date(maintenance.fecha_inicio).toDateString() === new Date(filterDate).toDateString();
    
    return matchesSearch && matchesStatus && matchesEquipment && matchesTechnician && matchesDate;
  });

  const handleSave = async (maintenanceData) => {
    try {
      if (selectedMaintenance) {
        await api.put(`/api/historial-mantenimiento/${selectedMaintenance.id}`, maintenanceData);
      } else {
        await api.post('/api/historial-mantenimiento', maintenanceData);
      }
      fetchMaintenanceHistory();
      setShowForm(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Error saving maintenance:', error);
      alert('Error al guardar el mantenimiento: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro de mantenimiento? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/api/historial-mantenimiento/${id}`);
        
        alert('Registro de mantenimiento eliminado exitosamente');
        fetchMaintenanceHistory();
      } catch (error) {
        console.error('Error deleting maintenance:', error);
        let errorMessage = 'Error al eliminar el registro de mantenimiento';
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para eliminar registros de mantenimiento.';
              break;
            case 404:
              errorMessage = 'Registro de mantenimiento no encontrado.';
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

  const handleEdit = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowForm(true);
  };

  const handleView = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowDetail(true);
  };

  const handleExport = () => {
    exportToExcel('/api/reports/export/mantenimientos', 'export_mantenimientos.xlsx');
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: 'Pendiente',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_progreso: 'bg-blue-100 text-blue-800 border-blue-200',
      completado: 'bg-green-100 text-green-800 border-green-200',
      cancelado: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <Clock size={16} className="text-yellow-600" />;
      case 'en_progreso':
        return <Wrench size={16} className="text-blue-600" />;
      case 'completado':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelado':
        return <AlertTriangle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getTechnicians = () => {
    return users.filter(user => user.rol?.id === 2); // ID 2 = técnico
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
          <h2 className="text-2xl font-bold text-gray-800">Historial de Mantenimiento</h2>
          <p className="text-gray-600">Registro de mantenimientos y reparaciones de equipos</p>
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
              setSelectedMaintenance(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Nuevo Mantenimiento</span>
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
              placeholder="Buscar mantenimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={filterEquipment}
            onChange={(e) => setFilterEquipment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los equipos</option>
            {equipments.map(equipment => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.codigo_inventario} - {equipment.tipo}
              </option>
            ))}
          </select>

          <select
            value={filterTechnician}
            onChange={(e) => setFilterTechnician(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          >
            <option value="">Todos los técnicos</option>
            {getTechnicians().map(technician => (
              <option key={technician.id} value={technician.id}>{technician.nombre_completo}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredMaintenance.length} registros encontrados
            </span>
            <Filter size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Maintenance History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mantenimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
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
              {filteredMaintenance.map((maintenance) => (
                <tr key={maintenance.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{maintenance.id}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {maintenance.descripcion_problema}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {maintenance.equipo?.codigo_inventario}
                        </div>
                        <div className="text-sm text-gray-500">
                          {maintenance.equipo?.tipo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(maintenance.estado)}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(maintenance.estado)}`}>
                        {getStatusLabel(maintenance.estado)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900">
                        {maintenance.tecnico?.nombre_completo || 'Sin asignar'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900">
                        {new Date(maintenance.fecha_inicio).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(maintenance.fecha_inicio).toLocaleTimeString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(maintenance)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(maintenance)}
                        className="text-amber-600 hover:text-amber-900 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      {user?.role === 'administrador' && (
                        <button
                          onClick={() => handleDelete(maintenance.id)}
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

      {filteredMaintenance.length === 0 && !loading && (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron registros de mantenimiento que coincidan con los filtros.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <MaintenanceForm
          maintenance={selectedMaintenance || undefined}
          equipments={equipments}
          users={users}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedMaintenance(null);
          }}
        />
      )}

      {showDetail && selectedMaintenance && (
        <MaintenanceDetail
          maintenance={selectedMaintenance}
          onClose={() => {
            setShowDetail(false);
            setSelectedMaintenance(null);
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

export default MaintenanceHistoryList; 