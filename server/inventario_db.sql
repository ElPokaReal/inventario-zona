-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-08-2025 a las 06:11:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventario_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `esta_activa` tinyint(4) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `fecha_actualizacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `responsable_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id`, `nombre`, `descripcion`, `codigo`, `esta_activa`, `fecha_creacion`, `fecha_actualizacion`, `responsable_id`) VALUES
(1, 'RRHH', 'Departamento de Recursos Humanos', 'RRHH', 1, '2025-07-11 00:38:47.958902', '2025-07-11 00:47:38.000000', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos`
--

CREATE TABLE `articulos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `numero_serie` varchar(255) DEFAULT NULL,
  `stock_actual` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 0,
  `stock_maximo` int(11) DEFAULT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `estado` enum('disponible','en_uso','en_mantenimiento','en_reparacion','retirado') NOT NULL DEFAULT 'disponible',
  `esta_activo` tinyint(4) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `fecha_actualizacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `categoria_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulos`
--

INSERT INTO `articulos` (`id`, `codigo`, `nombre`, `descripcion`, `numero_serie`, `stock_actual`, `stock_minimo`, `stock_maximo`, `ubicacion`, `estado`, `esta_activo`, `fecha_creacion`, `fecha_actualizacion`, `categoria_id`) VALUES
(1, 'MOUSE-001', 'Mouse Logitech', 'Mouse logitech nuevo', '0001', 1, 10, NULL, 'Soporte Técnico', 'disponible', 1, '2025-07-11 01:11:01.841721', '2025-07-11 01:11:01.841721', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciones_equipos`
--

CREATE TABLE `asignaciones_equipos` (
  `id` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_devolucion` timestamp NULL DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `equipo_id` int(11) DEFAULT NULL,
  `asignado_por_usuario_id` int(11) DEFAULT NULL,
  `asignado_a_usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `esta_activa` tinyint(4) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `fecha_actualizacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `codigo`, `esta_activa`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Periféricos', '', NULL, 1, '2025-07-11 01:10:14.999736', '2025-07-11 01:10:14.999736'),
(2, 'Equipos de Computación', '', NULL, 1, '2025-07-11 03:29:28.039495', '2025-07-11 03:29:28.039495');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `codigo_inventario` varchar(255) NOT NULL,
  `tipo` enum('computadora','periferico','accesorio','red','audiovisual') NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `numero_serie` varchar(255) NOT NULL,
  `estado` enum('activo','mantenimiento','reparacion','retirado','extraviado') NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_creacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `fecha_actualizacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `ubicacion_actual_id` int(11) DEFAULT NULL,
  `asignado_a_usuario_id` int(11) DEFAULT NULL,
  `esta_activo` tinyint(4) NOT NULL DEFAULT 1,
  `especificaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`especificaciones`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `codigo_inventario`, `tipo`, `marca`, `modelo`, `numero_serie`, `estado`, `descripcion`, `fecha_creacion`, `fecha_actualizacion`, `ubicacion_actual_id`, `asignado_a_usuario_id`, `esta_activo`, `especificaciones`) VALUES
(1, 'EQ-001', 'computadora', 'Dell', 'OptiPlex 7090', '0001', '', 'Computador ubicado en RRHH 0001', '2025-07-11 01:18:51.516468', '2025-07-11 01:58:29.000000', 1, 5, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_mantenimiento`
--

CREATE TABLE `historial_mantenimiento` (
  `id` int(11) NOT NULL,
  `fecha_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `descripcion_problema` text NOT NULL,
  `estado` enum('pendiente','en_progreso','completado','cancelado') NOT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `equipo_id` int(11) DEFAULT NULL,
  `reportado_por_usuario_id` int(11) DEFAULT NULL,
  `tecnico_usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_mantenimiento`
--

INSERT INTO `historial_mantenimiento` (`id`, `fecha_inicio`, `fecha_fin`, `descripcion_problema`, `estado`, `costo`, `observaciones`, `equipo_id`, `reportado_por_usuario_id`, `tecnico_usuario_id`) VALUES
(1, '2025-07-11 01:58:29', NULL, 'No da video por ningun lado', 'pendiente', 0.00, 'posiblemente haya que cambiar la ram', 1, 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `tipo` enum('entrada','salida','transferencia','asignacion','devolucion','mantenimiento') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `stock_anterior` int(11) NOT NULL,
  `stock_nuevo` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `ubicacion_origen` varchar(255) DEFAULT NULL,
  `ubicacion_destino` varchar(255) DEFAULT NULL,
  `asignado_a` varchar(255) DEFAULT NULL,
  `recibido_por` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `articulo_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `tipo`, `cantidad`, `stock_anterior`, `stock_nuevo`, `motivo`, `referencia`, `ubicacion_origen`, `ubicacion_destino`, `asignado_a`, `recibido_por`, `observaciones`, `fecha_creacion`, `articulo_id`, `usuario_id`) VALUES
(1, 'mantenimiento', 1, 1, 1, 'No se mueve', 'Mant-001', NULL, NULL, NULL, 'José Antonio', NULL, '2025-07-11 02:03:32.091170', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `esta_activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `esta_activo`) VALUES
(1, 'administrador', 1),
(2, 'técnico', 1),
(3, 'usuario', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hash_contrasena` varchar(255) NOT NULL,
  `departamento` varchar(255) NOT NULL,
  `posicion` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `esta_activo` tinyint(4) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `fecha_actualizacion` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `rol_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `nombre_completo`, `email`, `hash_contrasena`, `departamento`, `posicion`, `telefono`, `esta_activo`, `fecha_creacion`, `fecha_actualizacion`, `rol_id`) VALUES
(1, 'admin', 'Administrador del Sistema', 'admin@sistema.com', '$2b$10$nbNAw/Z9lYzwfb8NQpkWROFbd.Z2TRSliFNp9TTRFJgsF6AndqjSq', 'TI', 'Administrador', NULL, 1, '2025-07-07 22:25:58.360455', '2025-07-07 22:25:58.360455', 1),
(5, 'Mario', 'Mario Perez', 'mario@gmail.com', '$2b$10$mYAFIvZAFxSh0ZXVlB9y3O4jEbnSyJXqm8Co3GWfLniQ.OBk40XHK', 'RRHH', 'Gerente', '+584247145280', 1, '2025-07-11 00:44:00.189560', '2025-07-11 00:44:00.189560', 1),
(6, 'joseantonio', 'Jose Antonio', 'jose@gmail.com', '$2b$10$wE6El1yI75hejHM3lEm6buuO4a9TiKUDCga/IfK/cshMVhKZQY.fW', 'Soporte Técnico', 'Técnico', '04124775701', 1, '2025-07-11 01:40:11.035680', '2025-07-11 01:49:55.000000', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_f55462e182e351cad2d7f357e7` (`nombre`),
  ADD UNIQUE KEY `IDX_bb6adb5f2493886fa61c92252a` (`codigo`),
  ADD KEY `FK_112dd5324a279327686addd1d7f` (`responsable_id`);

--
-- Indices de la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_00b413dbf4275dd65278b99f6b` (`codigo`),
  ADD KEY `FK_13570a0a38e3d0c4480e014e86d` (`categoria_id`);

--
-- Indices de la tabla `asignaciones_equipos`
--
ALTER TABLE `asignaciones_equipos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d45caadc524107de88e14c56edc` (`equipo_id`),
  ADD KEY `FK_d40b8eddf1ab447afcfd01573c3` (`asignado_por_usuario_id`),
  ADD KEY `FK_60b2c78bcd7864b5800ca79608c` (`asignado_a_usuario_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ccdf6cd1a34ea90a7233325063` (`nombre`),
  ADD UNIQUE KEY `IDX_0c84ea3592b4f7d7100f8a3d2f` (`codigo`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_cc892c8dff6a6f78c4aac59da9` (`codigo_inventario`),
  ADD UNIQUE KEY `IDX_71e8baf02414bd90b30ac0feb4` (`numero_serie`),
  ADD KEY `FK_8641489fe80cee7317aadad67b9` (`ubicacion_actual_id`),
  ADD KEY `FK_4467438cd99093c81441b14abdf` (`asignado_a_usuario_id`);

--
-- Indices de la tabla `historial_mantenimiento`
--
ALTER TABLE `historial_mantenimiento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_72ec6e086183709be98bc5e40f4` (`equipo_id`),
  ADD KEY `FK_458e5f9d7de637e68aa0436db09` (`reportado_por_usuario_id`),
  ADD KEY `FK_81e2d224413c308726fcee58420` (`tecnico_usuario_id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_84ce5d7aa7cc6dd5ec7ab7a8f39` (`articulo_id`),
  ADD KEY `FK_4c2865c35bf8cd8a08aa438d58e` (`usuario_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_a5be7aa67e759e347b1c6464e1` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_1a7a36f3dffef210b4c0ba5c6c` (`nombre_usuario`),
  ADD UNIQUE KEY `IDX_446adfc18b35418aac32ae0b7b` (`email`),
  ADD KEY `FK_9e519760a660751f4fa21453d3e` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `asignaciones_equipos`
--
ALTER TABLE `asignaciones_equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial_mantenimiento`
--
ALTER TABLE `historial_mantenimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `areas`
--
ALTER TABLE `areas`
  ADD CONSTRAINT `FK_112dd5324a279327686addd1d7f` FOREIGN KEY (`responsable_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD CONSTRAINT `FK_13570a0a38e3d0c4480e014e86d` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
