# Manejo de Expiración de Sesión

## Descripción

Este sistema implementa un manejo automático de la expiración de tokens JWT. Cuando un token expira, el sistema:

1. Detecta automáticamente el error 401 (Unauthorized)
2. Limpia los datos de sesión del usuario
3. Muestra una notificación de sesión expirada
4. Redirige automáticamente al login

## Componentes Implementados

### 1. Configuración de Axios (`src/utils/axiosConfig.js`)

- **Interceptor de Request**: Agrega automáticamente el token a todas las peticiones
- **Interceptor de Response**: Detecta errores 401 y maneja la expiración de sesión
- **Configuración base**: URL del backend y timeout

### 2. Hook de Autenticación (`src/hooks/useAuth.jsx`)

- **Estado de sesión expirada**: Controla la visibilidad de la notificación
- **Event listener**: Escucha eventos de expiración de sesión
- **Limpieza automática**: Elimina datos del usuario cuando expira la sesión

### 3. Notificación de Sesión Expirada (`src/components/UI/SessionExpiredNotification.jsx`)

- **Diseño responsivo**: Notificación moderna con animaciones
- **Barra de progreso**: Indica el tiempo restante antes del cierre automático
- **Auto-cierre**: Se cierra automáticamente después de 3 segundos

### 4. Componente de Prueba (`src/components/UI/TestSessionExpiration.jsx`)

- **Solo en desarrollo**: Aparece únicamente en modo desarrollo
- **Endpoint de prueba**: Simula una respuesta 401 del servidor
- **Verificación**: Permite probar la funcionalidad sin esperar expiración real

## Flujo de Funcionamiento

### 1. Detección de Expiración
```javascript
// En axiosConfig.js
if (error.response && error.response.status === 401) {
  // Token expirado detectado
}
```

### 2. Limpieza de Sesión
```javascript
// Limpiar datos del usuario
localStorage.removeItem('currentUser');
```

### 3. Notificación al Usuario
```javascript
// Crear evento personalizado
const sessionExpiredEvent = new CustomEvent('sessionExpired', {
  detail: { message: 'Su sesión ha expirado...' }
});
window.dispatchEvent(sessionExpiredEvent);
```

### 4. Redirección Automática
```javascript
// Redirigir al login después de 1 segundo
setTimeout(() => {
  window.location.href = '/';
}, 1000);
```

## Configuración del Backend

### Endpoint de Prueba
```javascript
// En server/src/index.js
app.get('/api/test-expired-token', (req, res) => {
  res.status(401).json({ 
    message: 'Token expirado',
    error: 'Unauthorized'
  });
});
```

## Uso en Componentes

### Importar la configuración de axios
```javascript
import api from '../../utils/axiosConfig';

// Usar en lugar de axios directo
const response = await api.get('/api/endpoint');
```

### El hook de autenticación maneja automáticamente
```javascript
const { user, sessionExpired, sessionMessage } = useAuth();

// La notificación se muestra automáticamente cuando sessionExpired es true
```

## Características

### ✅ Automático
- No requiere intervención manual
- Detecta expiración en cualquier petición HTTP

### ✅ Seguro
- Limpia inmediatamente los datos de sesión
- Previene acceso no autorizado

### ✅ UX Amigable
- Notificación clara y visible
- Redirección automática
- Animaciones suaves

### ✅ Desarrollador Amigable
- Logs en consola para debugging
- Componente de prueba en desarrollo
- Fácil de mantener y extender

## Pruebas

### 1. Prueba Manual
1. Iniciar sesión
2. Hacer clic en "Probar Token Expirado" (solo en desarrollo)
3. Verificar que aparece la notificación
4. Verificar que redirige al login

### 2. Prueba Real
1. Iniciar sesión
2. Esperar a que expire el token JWT
3. Intentar hacer cualquier petición
4. Verificar el comportamiento automático

## Personalización

### Cambiar el mensaje
```javascript
// En axiosConfig.js
const message = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
```

### Cambiar el tiempo de redirección
```javascript
// En axiosConfig.js
setTimeout(() => {
  window.location.href = '/';
}, 1000); // Cambiar 1000 por el tiempo deseado en ms
```

### Cambiar el tiempo de la notificación
```javascript
// En useAuth.jsx
setTimeout(() => {
  setSessionExpired(false);
  setSessionMessage('');
  window.location.href = '/';
}, 3000); // Cambiar 3000 por el tiempo deseado en ms
```

## Notas Importantes

1. **Solo en desarrollo**: El componente de prueba solo aparece en modo desarrollo
2. **Logs**: Se incluyen logs en consola para facilitar el debugging
3. **Eventos**: Se usan eventos personalizados para comunicación entre componentes
4. **Limpieza**: Se limpia automáticamente el localStorage al expirar la sesión
5. **Redirección**: Se usa `window.location.href` para forzar una recarga completa

## Eliminación del Componente de Prueba

Para producción, eliminar o comentar estas líneas en `App.jsx`:

```javascript
// REMOVER EN PRODUCCIÓN
{process.env.NODE_ENV === 'development' && (
  <TestSessionExpiration />
)}
``` 