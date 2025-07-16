import React, { useState } from 'react';
import { BarChart3, Download, FileText, Package, RefreshCw, ArrowUpDown, AlertTriangle, Clock, FileSpreadsheet } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import api from '../../utils/axiosConfig';
import toast from 'react-hot-toast';
import RecentActivity from './RecentActivity';

const ReportList = () => {
  const { stats, recentMovements, topCategories, loading, error } = useDashboard();
  const [activeTab, setActiveTab] = useState('reports');

  // Función genérica para generar y descargar reportes de Excel desde la API
  const generateExcelReport = async (endpoint, fileName) => {
    const toastId = toast.loading(`Generando ${fileName}...`);
    try {
      const response = await api.get(endpoint, {
        responseType: 'blob', // Crucial para manejar archivos
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Reporte generado exitosamente.', { id: toastId });
    } catch (err) {
      console.error(`Error al generar ${fileName}:`, err);
      toast.error('No se pudo generar el reporte. Intente de nuevo.', { id: toastId });
    }
  };

  const reports = [
    {
      id: 'dashboard',
      title: 'Dashboard Completo',
      description: 'Reporte Excel con las estadísticas clave y sus detalles.',
      icon: BarChart3,
      color: 'bg-blue-500',
      action: () => generateExcelReport('/reports/dashboard-excel', 'reporte_dashboard_detallado.xlsx'),
      count: stats ? Object.keys(stats).length : 0
    },
    {
      id: 'inventory',
      title: 'Estadísticas de Inventario',
      description: 'Reporte Excel con estadísticas y el detalle de los equipos.',
      icon: Package,
      color: 'bg-green-500',
      action: () => generateExcelReport('/reports/inventory-stats-excel', 'reporte_inventario_stats_detallado.xlsx'),
      count: (stats?.articulos?.total || 0) + (stats?.equipos?.total || 0)
    },
    {
      id: 'movements',
      title: 'Movimientos Recientes',
      description: 'Descarga los últimos 100 movimientos en formato Excel.',
      icon: ArrowUpDown,
      color: 'bg-purple-500',
      action: () => generateExcelReport('/api/reports/movements-excel', 'reporte_movimientos.xlsx'),
      count: recentMovements?.length || 0
    },
    {
      id: 'low_stock',
      title: 'Alertas de Stock',
      description: 'Reporte Excel de artículos con stock bajo o sin stock.',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: () => generateExcelReport('/api/reports/stock-alerts-excel', 'reporte_alertas_stock.xlsx'),
      count: (stats?.articulos?.stockBajo || 0) + (stats?.articulos?.sinStock || 0)
    },
    {
      id: 'categories',
      title: 'Categorías Principales',
      description: 'Reporte Excel de las categorías con más artículos.',
      icon: FileText,
      color: 'bg-orange-500',
      action: () => generateExcelReport('/api/reports/top-categories-excel', 'reporte_categorias.xlsx'),
      count: topCategories?.length || 0
    },
    {
      id: 'excel_comprehensive',
      title: 'Reporte Maestro (Excel)',
      description: 'Descarga un único archivo Excel con todos los datos del sistema.',
      icon: FileSpreadsheet,
      color: 'bg-emerald-600',
      action: () => generateExcelReport('/api/reports/comprehensive-excel', 'reporte_maestro_inventario.xlsx'),
      count: 'Todo'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h2>
          <p className="text-gray-600">Genere reportes detallados del sistema en formato Excel.</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span className="text-sm text-gray-600">Datos actualizados en tiempo real</span>
        </div>
      </div>

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
              <FileSpreadsheet className="w-4 h-4" />
              <span>Reportes Excel</span>
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

      {activeTab === 'reports' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {report.count} {report.id !== 'excel_comprehensive' ? 'registros' : ''}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  </div>

                  <button
                    onClick={report.action}
                    className="w-full mt-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <Download size={18} />
                    <span>Generar Excel</span>
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
