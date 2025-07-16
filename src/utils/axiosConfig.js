import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el error es 401 (No autorizado), significa que el token expiró
    if (error.response && error.response.status === 401) {
      console.log('Token expirado detectado, limpiando sesión...');
      
      // Limpiar datos del usuario
      localStorage.removeItem('currentUser');
      
      // Mostrar mensaje de sesión expirada
      const message = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
      
      // Crear un evento personalizado para notificar la expiración
      const sessionExpiredEvent = new CustomEvent('sessionExpired', {
        detail: { message }
      });
      window.dispatchEvent(sessionExpiredEvent);
      
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        console.log('Redirigiendo al login...');
        window.location.href = '/';
      }, 1000);
    }
    
    return Promise.reject(error);
  }
);

export default api; 