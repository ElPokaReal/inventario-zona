# Gestión de Categorías - Sistema de Inventario

## 📋 Descripción

La funcionalidad de **Gestión de Categorías** permite a los administradores organizar y clasificar los artículos del inventario en categorías lógicas. Esta funcionalidad es fundamental para mantener un inventario bien estructurado y facilitar la búsqueda y gestión de artículos.

## 🔐 Permisos de Acceso

- **Solo administradores** pueden acceder a la gestión de categorías
- Los usuarios con roles "usuario" y "técnico" no pueden ver ni gestionar categorías
- Las categorías inactivas no aparecen en los formularios de artículos

## 🚀 Funcionalidades

### 1. **Listado de Categorías**
- Vista en grid con diseño de tarjetas
- Filtros por estado (activas/inactivas)
- Búsqueda por nombre y descripción
- Contador de categorías encontradas
- Exportación a CSV

### 2. **Creación de Categorías**
- Formulario con validaciones en tiempo real
- Campos obligatorios: nombre (2-50 caracteres)
- Campo opcional: descripción (máximo 200 caracteres)
- Toggle para activar/desactivar categoría
- Validación de nombres únicos

### 3. **Edición de Categorías**
- Mismo formulario que creación
- Pre-carga de datos existentes
- Validación de cambios
- Actualización de fechas automática

### 4. **Eliminación de Categorías**
- **Hard delete** (eliminación permanente)
- Confirmación antes de eliminar
- Manejo de errores específicos

### 5. **Vista Detallada**
- Información completa de la categoría
- Fechas de creación y actualización
- Estado visual con iconos
- Información adicional y notas

## 🎨 Interfaz de Usuario

### **Diseño**
- Colores: Gradiente púrpura-rosa para categorías
- Iconos: Tag, FileText, Calendar, CheckCircle, XCircle
- Responsive: Adaptable a móviles y tablets
- Animaciones: Hover effects y transiciones suaves

### **Componentes**
- `CategoryList.jsx` - Lista principal con filtros
- `CategoryForm.jsx` - Formulario de creación/edición
- `CategoryDetail.jsx` - Vista detallada

## 🔧 Backend

### **Controlador** (`categoryController.js`)
- `getAllCategorias()` - Obtener todas las categorías
- `getCategoriaById()` - Obtener categoría por ID
- `createCategoria()` - Crear nueva categoría
- `updateCategoria()` - Actualizar categoría existente
- `deleteCategoria()` - Eliminar categoría (hard delete)

### **Rutas** (`categoryRoutes.js`)
- `GET /api/categorias` - Listar categorías
- `GET /api/categorias/:id` - Obtener categoría específica
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

### **Entidad** (`Categoria.js`)
```javascript
{
  id: number,
  nombre: string (único),
  descripcion: string (opcional),
  esta_activa: boolean,
  fecha_creacion: Date,
  fecha_actualizacion: Date
}
```

## 📊 Categorías de Ejemplo

El sistema incluye 20 categorías predefinidas:

1. **Equipos de Computación** - Computadoras, laptops, tablets
2. **Periféricos** - Mouse, teclados, monitores, impresoras
3. **Cables y Conectores** - Cables de red, USB, HDMI, VGA
4. **Software** - Licencias y aplicaciones
5. **Herramientas** - Herramientas de mantenimiento
6. **Consumibles** - Tintas, cartuchos, papel
7. **Equipos de Red** - Routers, switches, puntos de acceso
8. **Almacenamiento** - Discos duros, SSDs, memorias USB
9. **Equipos de Seguridad** - Cámaras, sistemas de control
10. **Mobiliario** - Escritorios, sillas, estantes
11. **Equipos de Audio/Video** - Micrófonos, altavoces, proyectores
12. **Equipos de Energía** - UPS, estabilizadores, baterías
13. **Equipos de Limpieza** - Aspiradoras, productos de limpieza
14. **Equipos Médicos** - Dispositivos médicos
15. **Equipos de Laboratorio** - Instrumentos científicos
16. **Equipos de Comunicación** - Teléfonos, radios, intercomunicadores
17. **Equipos de Iluminación** - Lámparas, focos LED
18. **Equipos de Climatización** - Aires acondicionados, ventiladores
19. **Equipos de Oficina** - Fotocopiadoras, escáneres, calculadoras
20. **Equipos de Transporte** - Carros, montacargas

## 🚀 Instalación y Configuración

### 1. **Ejecutar Script SQL**
```sql
-- Ejecutar el archivo categorias_ejemplo.sql en la base de datos
source server/categorias_ejemplo.sql
```

### 2. **Verificar Rutas**
- Las rutas ya están registradas en `server/src/index.js`
- El middleware de autorización está configurado

### 3. **Probar Funcionalidad**
1. Iniciar el servidor backend
2. Iniciar el frontend
3. Iniciar sesión como administrador
4. Navegar a "Categorías" en el sidebar

## 🔍 Validaciones

### **Frontend**
- Nombre: 2-50 caracteres, obligatorio
- Descripción: Máximo 200 caracteres, opcional
- Validación en tiempo real
- Mensajes de error específicos

### **Backend**
- Verificación de nombres únicos
- Validación de campos obligatorios
- Manejo de errores de base de datos
- Respuestas HTTP apropiadas

## 📱 Responsive Design

- **Desktop**: Grid de 3 columnas
- **Tablet**: Grid de 2 columnas
- **Mobile**: Grid de 1 columna
- Filtros apilados en móviles
- Modales adaptables

## 🎯 Próximos Pasos

1. **Integración con Artículos**: Las categorías se usan en el formulario de artículos
2. **Estadísticas**: Contar artículos por categoría
3. **Filtros Avanzados**: Filtrar artículos por categoría
4. **Reportes**: Generar reportes por categoría

## 🐛 Solución de Problemas

### **Error 403 - No autorizado**
- Verificar que el usuario sea administrador
- Revisar el token JWT
- Comprobar permisos en la base de datos

### **Error 400 - Nombre duplicado**
- Verificar que el nombre no exista
- Usar nombres únicos para cada categoría

### **Error 500 - Error del servidor**
- Revisar logs del servidor
- Verificar conexión a la base de datos
- Comprobar estructura de la tabla categorias

## 📞 Soporte

Para problemas técnicos o consultas sobre la funcionalidad de categorías, contactar al equipo de desarrollo. 