import { useState, useEffect, createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);

    // Escuchar eventos de expiración de sesión
    const handleSessionExpired = (event) => {
      setSessionExpired(true);
      setSessionMessage(event.detail.message);
      setUser(null);
      
      // Mostrar notificación y redirigir
      setTimeout(() => {
        setSessionExpired(false);
        setSessionMessage('');
        window.location.href = '/';
      }, 3000);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    // Cleanup del event listener
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_usuario: username, contrasena: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const data = await response.json();
      const loggedInUser = {
        username: username,
        token: data.token,
        role: data.role, // Nombre del rol
        id: data.id,
        nombre_completo: data.nombre_completo,
        departamento: data.departamento,
      };
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setIsLoading(false);
      
      // Mostrar notificación de éxito
      toast.success(`¡Bienvenido, ${data.nombre_completo}!`, {
        duration: 3000,
        icon: '👋',
      });
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
      
      // Mostrar notificación de error
      toast.error(error.message || 'Error en el inicio de sesión', {
        duration: 4000,
      });
      
      return false;
    }
  };

  const logout = () => {
    const userName = user?.nombre_completo || user?.username || 'Usuario';
    setUser(null);
    localStorage.removeItem('currentUser');
    
    // Mostrar notificación de logout
    toast.success(`¡Hasta luego, ${userName}! Sesión cerrada correctamente.`, {
      duration: 3000,
      icon: '👋',
    });
  };

  const handleSessionExpired = () => {
    setSessionExpired(true);
    setSessionMessage('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      sessionExpired, 
      sessionMessage, 
      handleSessionExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
};