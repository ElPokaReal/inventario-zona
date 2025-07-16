import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMovements, setRecentMovements] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
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

      // Obtener estadísticas generales
      const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`, config);
      setStats(statsResponse.data);

      // Obtener movimientos recientes
      const movementsResponse = await axios.get(`${API_BASE_URL}/dashboard/movements?limit=5`, config);
      setRecentMovements(movementsResponse.data);

      // Obtener categorías principales
      const categoriesResponse = await axios.get(`${API_BASE_URL}/dashboard/categories?limit=5`, config);
      setTopCategories(categoriesResponse.data);

      // Obtener estado del inventario
      const statusResponse = await axios.get(`${API_BASE_URL}/dashboard/inventory-status`, config);
      setInventoryStatus(statusResponse.data);

    } catch (err) {
      console.error('Error al obtener datos del dashboard:', err);
      setError(err.response?.data?.message || 'Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    stats,
    recentMovements,
    topCategories,
    inventoryStatus,
    loading,
    error,
    refreshData
  };
}; 