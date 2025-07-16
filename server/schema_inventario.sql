-- =================================================================
-- Esquema de Base de Datos para Sistema de Inventario
-- =================================================================

--
-- Base de datos: `inventario_db`
--
CREATE DATABASE IF NOT EXISTS `inventario_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `inventario_db`;

-- --------------------------------------------------------

--
-- Tabla para los roles de usuario
--
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del rol (ej: administrador, supervisor, técnico)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--
INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'administrador'),
(2, 'usuario'),
(3, 'técnico');

-- --------------------------------------------------------

--
-- Tabla principal de usuarios
--
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_usuario` VARCHAR(100) NOT NULL UNIQUE,
  `nombre_completo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `hash_contrasena` VARCHAR(255) NOT NULL COMMENT 'Contraseña cifrada (hash)',
  `rol_id` INT NOT NULL,
  `departamento` VARCHAR(150) NOT NULL,
  `posicion` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(50),
  `esta_activo` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de categorías para los artículos
--
CREATE TABLE `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL UNIQUE,
  `descripcion` TEXT,
  `codigo` VARCHAR(50) UNIQUE,
  `esta_activa` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de artículos (productos/consumibles)
--
CREATE TABLE `articulos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(100) NOT NULL UNIQUE,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `categoria_id` INT NOT NULL,
  `numero_serie` VARCHAR(255) COMMENT 'Puede ser un rango o nulo si no aplica',
  `stock_actual` INT NOT NULL DEFAULT 0,
  `stock_minimo` INT NOT NULL DEFAULT 0,
  `stock_maximo` INT,
  `ubicacion` VARCHAR(255) NOT NULL COMMENT 'Ubicación física en el almacén',
  `estado` ENUM('disponible', 'en_uso', 'en_mantenimiento', 'en_reparacion', 'retirado') DEFAULT 'disponible',
  `esta_activo` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de áreas o departamentos de la empresa
--
CREATE TABLE `areas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL UNIQUE,
  `descripcion` TEXT,
  `codigo` VARCHAR(50) UNIQUE,
  `responsable_id` INT,
  `esta_activa` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`responsable_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de equipos (activos fijos)
--
CREATE TABLE `equipos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo_inventario` VARCHAR(100) NOT NULL UNIQUE,
  `tipo` ENUM('computadora', 'periferico', 'accesorio', 'red', 'audiovisual') NOT NULL,
  `marca` VARCHAR(100) NOT NULL,
  `modelo` VARCHAR(150) NOT NULL,
  `numero_serie` VARCHAR(255) NOT NULL UNIQUE,
  `estado` ENUM('activo', 'mantenimiento', 'reparacion', 'retirado', 'extraviado') NOT NULL,
  `ubicacion_actual_id` INT NOT NULL COMMENT 'ID del área donde se encuentra',
  `asignado_a_usuario_id` INT COMMENT 'ID del usuario al que está asignado',
  `descripcion` TEXT NOT NULL,
  `especificaciones` JSON COMMENT 'Para guardar detalles técnicos como RAM, CPU, etc.',
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`ubicacion_actual_id`) REFERENCES `areas`(`id`),
  FOREIGN KEY (`asignado_a_usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de historial de movimientos de los artículos
--
CREATE TABLE `movimientos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `articulo_id` INT NOT NULL,
  `usuario_id` INT NOT NULL COMMENT 'Usuario que registra el movimiento',
  `tipo` ENUM('entrada', 'salida', 'transferencia', 'asignacion', 'devolucion', 'mantenimiento') NOT NULL,
  `cantidad` INT NOT NULL,
  `stock_anterior` INT NOT NULL,
  `stock_nuevo` INT NOT NULL,
  `motivo` VARCHAR(255) NOT NULL,
  `referencia` VARCHAR(150) COMMENT 'Código de referencia (orden, ticket, etc.)',
  `ubicacion_origen` VARCHAR(255),
  `ubicacion_destino` VARCHAR(255),
  `asignado_a` VARCHAR(255) COMMENT 'Nombre de la persona o área que recibe',
  `recibido_por` VARCHAR(255),
  `observaciones` TEXT,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`articulo_id`) REFERENCES `articulos`(`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de historial de asignaciones de equipos a usuarios
--
CREATE TABLE `asignaciones_equipos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `equipo_id` INT NOT NULL,
  `asignado_por_usuario_id` INT NOT NULL,
  `asignado_a_usuario_id` INT NOT NULL,
  `fecha_asignacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_devolucion` TIMESTAMP,
  `observaciones` TEXT,
  FOREIGN KEY (`equipo_id`) REFERENCES `equipos`(`id`),
  FOREIGN KEY (`asignado_por_usuario_id`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`asignado_a_usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabla de historial de mantenimientos para equipos
--
CREATE TABLE `historial_mantenimiento` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `equipo_id` INT NOT NULL,
  `reportado_por_usuario_id` INT NOT NULL,
  `tecnico_usuario_id` INT,
  `fecha_inicio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` TIMESTAMP,
  `descripcion_problema` TEXT NOT NULL,
  `estado` ENUM('pendiente', 'en_progreso', 'completado', 'cancelado') NOT NULL,
  `costo` DECIMAL(10, 2),
  `observaciones` TEXT,
  FOREIGN KEY (`equipo_id`) REFERENCES `equipos`(`id`),
  FOREIGN KEY (`reportado_por_usuario_id`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`tecnico_usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- Fin del script
-- =================================================================
