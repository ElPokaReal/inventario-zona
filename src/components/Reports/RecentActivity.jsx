import React, { useState } from 'react';
import { Clock, RefreshCw, Filter, Calendar, User, Package, Wrench, Users } from 'lucide-react';
import { useRecentActivity } from '../../hooks/useRecentActivity';

const RecentActivity = () => {
  const { activities, loading, error, refreshActivity, getActivityIcon, getActivityColor } = useRecentActivity(50);
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState({});

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const getTypeLabel = (type) => {
    const labels = {
      movement: 'Movimiento',
      maintenance: 'Mantenimiento',
      assignment: 'Asignación'
    };
    return labels[type] || type;
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

  const getMaintenanceStatusLabel = (estado) => {
    const labels = {
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado',
      programado: 'Programado'
    };
    return labels[estado] || estado;
  };

  const toggleDetails = (activityId) => {
    setShowDetails(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando actividad reciente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshActivity}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Actividad Reciente</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {filteredActivities.length} actividades
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Filtros */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las actividades</option>
              <option value="movement">Solo movimientos</option>
              <option value="maintenance">Solo mantenimientos</option>
              <option value="assignment">Solo asignaciones</option>
            </select>
          </div>
          
          {/* Botón de refresh */}
          <button
            onClick={refreshActivity}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icono */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.icon)}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-800 truncate">{activity.title}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getActivityColor(activity.type)}`}>
                        {getTypeLabel(activity.type)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {activity.type === 'maintenance'
                        ? [
                            activity.details.tipo_mantenimiento !== 'Sin tipo' ? activity.details.tipo_mantenimiento : null,
                            activity.details.descripcion_problema !== 'Sin descripción' ? activity.details.descripcion_problema : null,
                            activity.details.observaciones ? activity.details.observaciones : null
                          ].filter(Boolean).join(' - ') || 'Sin detalles'
                        : activity.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{activity.user}</span>
                      </div>
                      <span className="text-blue-600">{getRelativeTime(activity.date)}</span>
                    </div>

                    {/* Detalles expandibles */}
                    {showDetails[activity.id] && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Detalles:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {activity.type === 'movement' && (
                            <>
                              <div>
                                <span className="font-medium">Tipo:</span> {getMovementTypeLabel(activity.details.tipo)}
                              </div>
                              <div>
                                <span className="font-medium">Cantidad:</span> {activity.details.cantidad}
                              </div>
                              {activity.details.ubicacion_origen && (
                                <div>
                                  <span className="font-medium">Origen:</span> {activity.details.ubicacion_origen}
                                </div>
                              )}
                              {activity.details.ubicacion_destino && (
                                <div>
                                  <span className="font-medium">Destino:</span> {activity.details.ubicacion_destino}
                                </div>
                              )}
                            </>
                          )}
                          
                          {activity.type === 'maintenance' && (
                            <>
                              <div>
                                <span className="font-medium">Tipo:</span> {activity.details.tipo_mantenimiento}
                              </div>
                              <div>
                                <span className="font-medium">Estado:</span> {getMaintenanceStatusLabel(activity.details.estado)}
                              </div>
                              {activity.details.costo && (
                                <div>
                                  <span className="font-medium">Costo:</span> ${activity.details.costo}
                                </div>
                              )}
                            </>
                          )}
                          
                          {activity.type === 'assignment' && (
                            <>
                              {activity.details.fecha_inicio && (
                                <div>
                                  <span className="font-medium">Inicio:</span> {new Date(activity.details.fecha_inicio).toLocaleDateString()}
                                </div>
                              )}
                              {activity.details.fecha_fin && (
                                <div>
                                  <span className="font-medium">Fin:</span> {new Date(activity.details.fecha_fin).toLocaleDateString()}
                                </div>
                              )}
                              {activity.details.motivo && (
                                <div>
                                  <span className="font-medium">Motivo:</span> {activity.details.motivo}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Botón para expandir detalles */}
                <button
                  onClick={() => toggleDetails(activity.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showDetails[activity.id] ? '−' : '+'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No hay actividad reciente para mostrar</p>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Movimientos</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {activities.filter(a => a.type === 'movement').length}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Mantenimientos</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {activities.filter(a => a.type === 'maintenance').length}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">Asignaciones</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {activities.filter(a => a.type === 'assignment').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity; 