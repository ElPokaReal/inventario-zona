import React, { useState } from 'react';
import { BarChart3, Download, FileText, Calendar, Package, ArrowUpDown, Users, AlertTriangle, Clock } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { exportToCSV } from '../../utils/exportUtils';
import RecentActivity from './RecentActivity';

const ReportList = () => {
  const { stats, recentMovements, topCategories, inventoryStatus, loading, error } = useDashboard();
  const [selectedReport, setSelectedReport] = useState('');
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' o 'activity'

  const generateInventoryReport = () => {
    if (!stats) return;
    
    const reportData = [
      {
        'Métrica': 'Total Artículos',
        'Valor': stats.articulos?.total || 0,
        'Descripción': 'Total de artículos en inventario'
      },
      {
        'Métrica': 'Artículos Disponibles',
        'Valor': stats.articulos?.disponibles || 0,
        'Descripción': 'Artículos disponibles para uso'
      },
      {
        'Métrica': 'Artículos en Uso',
        'Valor': stats.articulos?.enUso || 0,
        'Descripción': 'Artículos actualmente en uso'
      },
      {
        'Métrica': 'Artículos en Mantenimiento',
        'Valor': stats.articulos?.enMantenimiento || 0,
        'Descripción': 'Artículos en proceso de mantenimiento'
      },
      {
        'Métrica': 'Stock Bajo',
        'Valor': stats.articulos?.stockBajo || 0,
        'Descripción': 'Artículos con stock por debajo del mínimo'
      },
      {
        'Métrica': 'Sin Stock',
        'Valor': stats.articulos?.sinStock || 0,
        'Descripción': 'Artículos sin stock disponible'
      },
      {
        'Métrica': 'Total Equipos',
        'Valor': stats.equipos?.total || 0,
        'Descripción': 'Total de equipos en el sistema'
      },
      {
        'Métrica': 'Equipos Disponibles',
        'Valor': stats.equipos?.disponibles || 0,
        'Descripción': 'Equipos disponibles para asignación'
      },
      {
        'Métrica': 'Equipos en Uso',
        'Valor': stats.equipos?.enUso || 0,
        'Descripción': 'Equipos actualmente en uso'
      },
      {
        'Métrica': 'Equipos en Mantenimiento',
        'Valor': stats.equipos?.enMantenimiento || 0,
        'Descripción': 'Equipos en proceso de mantenimiento'
      },
      {
        'Métrica': 'Movimientos Hoy',
        'Valor': stats.movimientos?.hoy || 0,
        'Descripción': 'Movimientos realizados hoy'
      },
      {
        'Métrica': 'Mantenimientos Activos',
        'Valor': stats.mantenimiento?.activos || 0,
        'Descripción': 'Mantenimientos en progreso'
      }
    ];
    
    exportToCSV(reportData, 'reporte-inventario-estadisticas');
  };

  const generateMovementsReport = () => {
    if (!recentMovements) return;
    
    const reportData = recentMovements.map(movement => ({
      'Fecha': new Date(movement.fecha_creacion).toLocaleDateString(),
      'Hora': new Date(movement.fecha_creacion).toLocaleTimeString(),
      'Tipo Movimiento': getMovementTypeLabel(movement.tipo),
      'Artículo': movement.articulo?.nombre || 'N/A',
      'Código Artículo': movement.articulo?.codigo || 'N/A',
      'Cantidad': movement.cantidad,
      'Motivo': movement.motivo,
      'Usuario': movement.usuario?.nombre || 'N/A',
      'Ubicación Origen': movement.ubicacion_origen || 'N/A',
      'Ubicación Destino': movement.ubicacion_destino || 'N/A'
    }));
    
    exportToCSV(reportData, 'reporte-movimientos-recientes');
  };

  const generateLowStockReport = () => {
    if (!stats) return;
    
    const reportData = [
      {
        'Métrica': 'Stock Bajo',
        'Cantidad': stats.articulos?.stockBajo || 0,
        'Descripción': 'Artículos con stock por debajo del mínimo establecido',
        'Prioridad': 'Media'
      },
      {
        'Métrica': 'Sin Stock',
        'Cantidad': stats.articulos?.sinStock || 0,
        'Descripción': 'Artículos sin stock disponible',
        'Prioridad': 'Alta'
      },
      {
        'Métrica': 'Total Crítico',
        'Cantidad': (stats.articulos?.stockBajo || 0) + (stats.articulos?.sinStock || 0),
        'Descripción': 'Total de artículos que requieren atención',
        'Prioridad': 'Crítica'
      }
    ];
    
    exportToCSV(reportData, 'reporte-stock-bajo');
  };

  const generateCategoryReport = () => {
    if (!topCategories) return;
    
    const reportData = topCategories.map((categoria, index) => ({
      'Posición': index + 1,
      'Categoría': categoria.nombre,
      'Total Artículos': categoria.totalArticulos,
      'Disponibles': categoria.disponiblesArticulos,
      'En Uso': categoria.totalArticulos - categoria.disponiblesArticulos,
      'Porcentaje Disponible': categoria.totalArticulos > 0 
        ? `${Math.round((categoria.disponiblesArticulos / categoria.totalArticulos) * 100)}%`
        : '0%'
    }));
    
    exportToCSV(reportData, 'reporte-categorias-principales');
  };

  const generateDashboardReport = () => {
    if (!stats || !topCategories) return;
    
    const reportData = [
      {
        'Sección': 'RESUMEN GENERAL',
        'Métrica': 'Total Artículos',
        'Valor': stats.articulos?.total || 0,
        'Descripción': 'Total de artículos en inventario'
      },
      {
        'Sección': 'RESUMEN GENERAL',
        'Métrica': 'Total Equipos',
        'Valor': stats.equipos?.total || 0,
        'Descripción': 'Total de equipos en el sistema'
      },
      {
        'Sección': 'RESUMEN GENERAL',
        'Métrica': 'Movimientos Hoy',
        'Valor': stats.movimientos?.hoy || 0,
        'Descripción': 'Movimientos realizados hoy'
      },
      {
        'Sección': 'ESTADO ARTÍCULOS',
        'Métrica': 'Disponibles',
        'Valor': stats.articulos?.disponibles || 0,
        'Descripción': 'Artículos disponibles para uso'
      },
      {
        'Sección': 'ESTADO ARTÍCULOS',
        'Métrica': 'En Uso',
        'Valor': stats.articulos?.enUso || 0,
        'Descripción': 'Artículos actualmente en uso'
      },
      {
        'Sección': 'ESTADO ARTÍCULOS',
        'Métrica': 'En Mantenimiento',
        'Valor': stats.articulos?.enMantenimiento || 0,
        'Descripción': 'Artículos en proceso de mantenimiento'
      },
      {
        'Sección': 'ALERTAS',
        'Métrica': 'Stock Bajo',
        'Valor': stats.articulos?.stockBajo || 0,
        'Descripción': 'Artículos con stock por debajo del mínimo'
      },
      {
        'Sección': 'ALERTAS',
        'Métrica': 'Sin Stock',
        'Valor': stats.articulos?.sinStock || 0,
        'Descripción': 'Artículos sin stock disponible'
      },
      {
        'Sección': 'MANTENIMIENTO',
        'Métrica': 'Mantenimientos Activos',
        'Valor': stats.mantenimiento?.activos || 0,
        'Descripción': 'Mantenimientos en progreso'
      }
    ];
    
    exportToCSV(reportData, 'reporte-dashboard-completo');
  };

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

  const reports = [
    {
      id: 'dashboard',
      title: 'Dashboard Completo',
      description: 'Reporte completo con todas las estadísticas del sistema',
      icon: BarChart3,
      color: 'bg-blue-500',
      action: generateDashboardReport,
      count: stats ? Object.keys(stats).length : 0
    },
    {
      id: 'inventory',
      title: 'Estadísticas de Inventario',
      description: 'Reporte detallado de estadísticas de artículos y equipos',
      icon: Package,
      color: 'bg-green-500',
      action: generateInventoryReport,
      count: stats?.articulos?.total || 0
    },
    {
      id: 'movements',
      title: 'Movimientos Recientes',
      description: 'Registro de movimientos recientes del sistema',
      icon: ArrowUpDown,
      color: 'bg-purple-500',
      action: generateMovementsReport,
      count: recentMovements?.length || 0
    },
    {
      id: 'low_stock',
      title: 'Alertas de Stock',
      description: 'Reporte de artículos con stock bajo o sin stock',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: generateLowStockReport,
      count: (stats?.articulos?.stockBajo || 0) + (stats?.articulos?.sinStock || 0)
    },
    {
      id: 'categories',
      title: 'Categorías Principales',
      description: 'Estadísticas de las categorías con más artículos',
      icon: FileText,
      color: 'bg-orange-500',
      action: generateCategoryReport,
      count: topCategories?.length || 0
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando reportes...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h2>
          <p className="text-gray-600">Genere reportes detallados del sistema de inventario</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span className="text-sm text-gray-600">Datos actualizados en tiempo real</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Reportes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Actividad Reciente</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'reports' ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Artículos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats?.articulos?.total || 0}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Movimientos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats?.movimientos?.hoy || 0}</p>
                </div>
                <ArrowUpDown className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(stats?.articulos?.stockBajo || 0) + (stats?.articulos?.sinStock || 0)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorías</p>
                  <p className="text-2xl font-bold text-gray-800">{topCategories?.length || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                      {report.count} registros
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>

                  <button
                    onClick={report.action}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    <Download size={18} />
                    <span>Generar Reporte</span>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <RecentActivity />
      )}
    </div>
  );
};

export default ReportList;