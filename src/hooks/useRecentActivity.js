import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const useRecentActivity = (limit = 20) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const user = JSON.parse(currentUser);
      const token = user.token;
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const allActivities = [];

      try {
        // Obtener movimientos recientes
        const movementsResponse = await axios.get(`${API_BASE_URL}/movimientos?limit=${limit}`, config);
        allActivities.push(...movementsResponse.data.map(movement => ({
          id: `movement-${movement.id}`,
          type: 'movement',
          title: `Movimiento de ${movement.articulo?.nombre || 'Artículo'}`,
          description: `${movement.tipo} - ${movement.motivo}`,
          date: new Date(movement.fecha_creacion),
          user: movement.usuario?.nombre || 'Usuario',
          details: {
            cantidad: movement.cantidad,
            ubicacion_origen: movement.ubicacion_origen,
            ubicacion_destino: movement.ubicacion_destino,
            tipo: movement.tipo
          },
          icon: 'ArrowUpDown'
        })));
      } catch (err) {
        console.warn('Error al obtener movimientos:', err);
      }

      try {
        // Obtener mantenimientos recientes
        const maintenanceResponse = await axios.get(`${API_BASE_URL}/historial-mantenimiento?limit=${limit}`, config);
        allActivities.push(...maintenanceResponse.data.map(maintenance => ({
          id: `maintenance-${maintenance.id}`,
          type: 'maintenance',
          title: `Mantenimiento de ${maintenance.equipo?.nombre || 'Equipo'}`,
          description: `${maintenance.tipo_mantenimiento || 'Sin tipo'} - ${maintenance.descripcion_problema || 'Sin descripción'}` + (maintenance.observaciones ? ` - ${maintenance.observaciones}` : ''),
          date: new Date(maintenance.fecha_inicio),
          user: maintenance.tecnico?.nombre || 'Técnico',
          details: {
            estado: maintenance.estado || 'Sin estado',
            costo: maintenance.costo ?? 'Sin costo',
            tipo_mantenimiento: maintenance.tipo_mantenimiento || 'Sin tipo',
            descripcion_problema: maintenance.descripcion_problema || 'Sin descripción',
            observaciones: maintenance.observaciones || ''
          },
          icon: 'Wrench'
        })));
      } catch (err) {
        console.warn('Error al obtener mantenimientos:', err);
      }

      try {
        // Obtener asignaciones recientes
        const assignmentsResponse = await axios.get(`${API_BASE_URL}/asignaciones-equipos?limit=${limit}`, config);
        allActivities.push(...assignmentsResponse.data.map(assignment => ({
          id: `assignment-${assignment.id}`,
          type: 'assignment',
          title: `Asignación de ${assignment.equipo?.nombre || 'Equipo'}`,
          description: `Asignado a ${assignment.asignado_a?.nombre || 'Usuario'}`,
          date: new Date(assignment.fecha_asignacion || assignment.fecha_creacion),
          user: assignment.asignado_a?.nombre || 'Usuario',
          details: {
            fecha_inicio: assignment.fecha_inicio,
            fecha_fin: assignment.fecha_fin,
            motivo: assignment.observaciones
          },
          icon: 'Users'
        })));
      } catch (err) {
        console.warn('Error al obtener asignaciones:', err);
      }

      // Ordenar por fecha y limitar
      const sortedActivities = allActivities
        .sort((a, b) => b.date - a.date)
        .slice(0, limit);

      setActivities(sortedActivities);

    } catch (err) {
      console.error('Error al obtener actividad reciente:', err);
      setError(err.response?.data?.message || 'Error al cargar actividad reciente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [limit]);

  const refreshActivity = () => {
    fetchRecentActivity();
  };

  const getActivityIcon = (iconName) => {
    const icons = {
      ArrowUpDown: '🔄',
      Wrench: '🔧',
      Users: '👥',
      Package: '📦',
      AlertTriangle: '⚠️'
    };
    return icons[iconName] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      movement: 'text-blue-600 bg-blue-100',
      maintenance: 'text-yellow-600 bg-yellow-100',
      assignment: 'text-purple-600 bg-purple-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  return {
    activities,
    loading,
    error,
    refreshActivity,
    getActivityIcon,
    getActivityColor
  };
}; 