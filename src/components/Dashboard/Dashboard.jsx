import React from 'react';
import { Package, Users, ArrowUpDown, AlertTriangle, Monitor, Wrench, RefreshCw } from 'lucide-react';
import StatsCard from './StatsCard';
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
  const { 
    stats, 
    recentMovements, 
    topCategories, 
    inventoryStatus, 
    loading, 
    error, 
    refreshData 
  } = useDashboard();

  const getMovementTypeLabel = (tipo) => {
    const labels = {
      entrada: 'Entrada',
      salida: 'Salida',
      transferencia: 'Transferencia',
      asignacion: 'Asignación',
      devolucion: 'Devolución',
      mantenimiento: 'Mantenimiento'
    };
    return labels[tipo] || tipo;
  };

  const getMovementTypeColor = (tipo) => {
    const colors = {
      entrada: 'text-green-600 bg-green-100',
      salida: 'text-red-600 bg-red-100',
      transferencia: 'text-blue-600 bg-blue-100',
      asignacion: 'text-purple-600 bg-purple-100',
      devolucion: 'text-orange-600 bg-orange-100',
      mantenimiento: 'text-yellow-600 bg-yellow-100'
    };
    return colors[tipo] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  // Calcular totales combinados de artículos y equipos
  const totalItems = (stats.articulos?.total || 0) + (stats.equipos?.total || 0);
  const availableItems = (stats.articulos?.disponibles || 0) + (stats.equipos?.disponibles || 0);
  const inUseItems = (stats.articulos?.enUso || 0) + (stats.equipos?.enUso || 0);
  const maintenanceItems = (stats.articulos?.enMantenimiento || 0) + (stats.equipos?.enMantenimiento || 0);

  return (
    <div className="space-y-6">
      {/* Header con botón de refresh */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={refreshData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Artículos"
          value={totalItems}
          icon={Package}
          color="blue"
          change={{ value: stats.movimientos?.hoy || 0, trend: 'up' }}
        />
        <StatsCard
          title="Disponibles"
          value={availableItems}
          icon={Monitor}
          color="green"
        />
        <StatsCard
          title="En Uso"
          value={inUseItems}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="En Mantenimiento"
          value={maintenanceItems}
          icon={Wrench}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Stock Bajo"
          value={stats.articulos?.stockBajo || 0}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Sin Stock"
          value={stats.articulos?.sinStock || 0}
          icon={Package}
          color="red"
        />
        <StatsCard
          title="Movimientos Hoy"
          value={stats.movimientos?.hoy || 0}
          icon={ArrowUpDown}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Movimientos Recientes</h3>
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentMovements.length > 0 ? (
              recentMovements.map((movimiento) => (
                <div key={movimiento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {movimiento.articulo?.nombre || 'Artículo no encontrado'}
                    </p>
                    <p className="text-sm text-gray-600">{movimiento.motivo}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(movimiento.fecha_creacion).toLocaleDateString()} - {movimiento.cantidad} unidades
                    </p>
                    {movimiento.usuario && (
                      <p className="text-xs text-blue-600">Usuario: {movimiento.usuario.nombre}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getMovementTypeColor(movimiento.tipo)}`}>
                      {getMovementTypeLabel(movimiento.tipo)}
                    </span>
                    {movimiento.ubicacion_destino && (
                      <p className="text-sm text-gray-600 mt-1">{movimiento.ubicacion_destino}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay movimientos recientes</p>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Categorías Principales</h3>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topCategories.length > 0 ? (
              topCategories.map((categoria, index) => (
                <div key={categoria.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{categoria.nombre}</p>
                      <p className="text-sm text-gray-600">{categoria.totalArticulos} artículos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{categoria.disponiblesArticulos} disponibles</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay categorías disponibles</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Overview */}
      {inventoryStatus && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Estado del Inventario</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { 
                label: 'Disponible', 
                count: (inventoryStatus.articulos?.disponibles || 0) + (inventoryStatus.equipos?.disponibles || 0), 
                color: 'bg-green-500' 
              },
              { 
                label: 'En Uso', 
                count: (inventoryStatus.articulos?.enUso || 0) + (inventoryStatus.equipos?.enUso || 0), 
                color: 'bg-blue-500' 
              },
              { 
                label: 'Mantenimiento', 
                count: (inventoryStatus.articulos?.enMantenimiento || 0) + (inventoryStatus.equipos?.enMantenimiento || 0), 
                color: 'bg-yellow-500' 
              },
              { 
                label: 'Stock Bajo', 
                count: inventoryStatus.articulos?.stockBajo || 0, 
                color: 'bg-orange-500' 
              },
              { 
                label: 'Sin Stock', 
                count: inventoryStatus.articulos?.sinStock || 0, 
                color: 'bg-red-500' 
              }
                         ].map((status) => {
               const totalItemsCount = totalItems || 1;
               const percentage = (status.count / totalItemsCount) * 100;
              
              return (
                <div key={status.label} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={status.color}
                        strokeWidth="2"
                        strokeDasharray={`${percentage}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{status.label}</p>
                  <p className="text-lg font-bold text-gray-900">{status.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;