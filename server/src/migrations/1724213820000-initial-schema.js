const ignorableError = (err) => {
  const code = err && (err.code || err.errno);
  const msg = String(err && err.message || "");
  const ignorable = [1050, 1060, 1061, 1068, 1826, 'ER_TABLE_EXISTS_ERROR', 'ER_DUP_FIELDNAME', 'ER_DUP_KEYNAME', 'ER_MULTIPLE_PRI_KEY', 'ER_FK_DUP_NAME'];
  return ignorable.includes(code) || /already exists/i.test(msg) || /Duplicate/i.test(msg);
};

module.exports = class initialSchema1724213820000 {
  name = 'initialSchema1724213820000'

  async up(queryRunner) {
    const queries = [
      // CREATE TABLES
      `CREATE TABLE IF NOT EXISTS roles (
        id int(11) NOT NULL,
        nombre varchar(255) NOT NULL,
        esta_activo tinyint(4) NOT NULL DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS usuarios (
        id int(11) NOT NULL,
        nombre_usuario varchar(255) NOT NULL,
        nombre_completo varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        hash_contrasena varchar(255) NOT NULL,
        departamento varchar(255) NOT NULL,
        posicion varchar(255) NOT NULL,
        telefono varchar(255) DEFAULT NULL,
        esta_activo tinyint(4) NOT NULL DEFAULT 1,
        fecha_creacion timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        fecha_actualizacion timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        rol_id int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS categorias (
        id int(11) NOT NULL,
        nombre varchar(255) NOT NULL,
        descripcion text DEFAULT NULL,
        codigo varchar(255) DEFAULT NULL,
        esta_activa tinyint(4) NOT NULL DEFAULT 1,
        fecha_creacion timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        fecha_actualizacion timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS articulos (
        id int(11) NOT NULL,
        codigo varchar(255) NOT NULL,
        nombre varchar(255) NOT NULL,
        descripcion text NOT NULL,
        numero_serie varchar(255) DEFAULT NULL,
        stock_actual int(11) NOT NULL DEFAULT 0,
        stock_minimo int(11) NOT NULL DEFAULT 0,
        stock_maximo int(11) DEFAULT NULL,
        ubicacion varchar(255) NOT NULL,
        estado enum('disponible','en_uso','en_mantenimiento','en_reparacion','retirado') NOT NULL DEFAULT 'disponible',
        esta_activo tinyint(4) NOT NULL DEFAULT 1,
        fecha_creacion timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        fecha_actualizacion timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        categoria_id int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS areas (
        id int(11) NOT NULL,
        nombre varchar(255) NOT NULL,
        descripcion text DEFAULT NULL,
        codigo varchar(255) DEFAULT NULL,
        esta_activa tinyint(4) NOT NULL DEFAULT 1,
        fecha_creacion timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        fecha_actualizacion timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        responsable_id int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS equipos (
        id int(11) NOT NULL,
        codigo_inventario varchar(255) NOT NULL,
        tipo enum('computadora','periferico','accesorio','red','audiovisual') NOT NULL,
        marca varchar(255) NOT NULL,
        modelo varchar(255) NOT NULL,
        numero_serie varchar(255) NOT NULL,
        estado enum('activo','mantenimiento','reparacion','retirado','extraviado') NOT NULL,
        descripcion text NOT NULL,
        fecha_creacion timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        fecha_actualizacion timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        ubicacion_actual_id int(11) DEFAULT NULL,
        asignado_a_usuario_id int(11) DEFAULT NULL,
        esta_activo tinyint(4) NOT NULL DEFAULT 1,
        especificaciones longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(especificaciones))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS movimientos (
        id int(11) NOT NULL,
        tipo enum('entrada','salida','transferencia','asignacion','devolucion','mantenimiento') NOT NULL,
        cantidad int(11) NOT NULL,
        stock_anterior int(11) NOT NULL,
        stock_nuevo int(11) NOT NULL,
        motivo varchar(255) NOT NULL,
        referencia varchar(255) DEFAULT NULL,
        ubicacion_origen varchar(255) DEFAULT NULL,
        ubicacion_destino varchar(255) DEFAULT NULL,
        asignado_a varchar(255) DEFAULT NULL,
        recibido_por varchar(255) DEFAULT NULL,
        observaciones text DEFAULT NULL,
        fecha_creacion timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        articulo_id int(11) DEFAULT NULL,
        usuario_id int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS asignaciones_equipos (
        id int(11) NOT NULL,
        fecha_asignacion timestamp NOT NULL DEFAULT current_timestamp(),
        fecha_devolucion timestamp NULL DEFAULT NULL,
        observaciones text DEFAULT NULL,
        equipo_id int(11) DEFAULT NULL,
        asignado_por_usuario_id int(11) DEFAULT NULL,
        asignado_a_usuario_id int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      `CREATE TABLE IF NOT EXISTS historial_mantenimiento (
        id int(11) NOT NULL,
        fecha_inicio timestamp NOT NULL DEFAULT current_timestamp(),
        fecha_fin timestamp NULL DEFAULT NULL,
        descripcion_problema text NOT NULL,
        estado enum('pendiente','en_progreso','completado','cancelado') NOT NULL,
        costo decimal(10,2) DEFAULT NULL,
        observaciones text DEFAULT NULL,
        equipo_id int(11) DEFAULT NULL,
        reportado_por_usuario_id int(11) DEFAULT NULL,
        tecnico_usuario_id int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

      // PRIMARY KEYS & UNIQUE & INDEXES
      `ALTER TABLE roles ADD PRIMARY KEY (id)`,
      `ALTER TABLE roles ADD UNIQUE KEY IDX_a5be7aa67e759e347b1c6464e1 (nombre)`,

      `ALTER TABLE usuarios ADD PRIMARY KEY (id)`,
      `ALTER TABLE usuarios ADD UNIQUE KEY IDX_1a7a36f3dffef210b4c0ba5c6c (nombre_usuario)`,
      `ALTER TABLE usuarios ADD UNIQUE KEY IDX_446adfc18b35418aac32ae0b7b (email)`,

      `ALTER TABLE categorias ADD PRIMARY KEY (id)`,
      `ALTER TABLE categorias ADD UNIQUE KEY IDX_ccdf6cd1a34ea90a7233325063 (nombre)`,
      `ALTER TABLE categorias ADD UNIQUE KEY IDX_0c84ea3592b4f7d7100f8a3d2f (codigo)`,

      `ALTER TABLE articulos ADD PRIMARY KEY (id)`,
      `ALTER TABLE articulos ADD UNIQUE KEY IDX_00b413dbf4275dd65278b99f6b (codigo)`,
      `ALTER TABLE articulos ADD KEY FK_13570a0a38e3d0c4480e014e86d (categoria_id)`,

      `ALTER TABLE areas ADD PRIMARY KEY (id)`,
      `ALTER TABLE areas ADD UNIQUE KEY IDX_f55462e182e351cad2d7f357e7 (nombre)`,
      `ALTER TABLE areas ADD UNIQUE KEY IDX_bb6adb5f2493886fa61c92252a (codigo)`,
      `ALTER TABLE areas ADD KEY FK_112dd5324a279327686addd1d7f (responsable_id)`,

      `ALTER TABLE equipos ADD PRIMARY KEY (id)`,
      `ALTER TABLE equipos ADD UNIQUE KEY IDX_cc892c8dff6a6f78c4aac59da9 (codigo_inventario)`,
      `ALTER TABLE equipos ADD UNIQUE KEY IDX_71e8baf02414bd90b30ac0feb4 (numero_serie)`,
      `ALTER TABLE equipos ADD KEY FK_8641489fe80cee7317aadad67b9 (ubicacion_actual_id)`,
      `ALTER TABLE equipos ADD KEY FK_4467438cd99093c81441b14abdf (asignado_a_usuario_id)`,

      `ALTER TABLE movimientos ADD PRIMARY KEY (id)`,
      `ALTER TABLE movimientos ADD KEY FK_84ce5d7aa7cc6dd5ec7ab7a8f39 (articulo_id)`,
      `ALTER TABLE movimientos ADD KEY FK_4c2865c35bf8cd8a08aa438d58e (usuario_id)`,

      `ALTER TABLE asignaciones_equipos ADD PRIMARY KEY (id)`,
      `ALTER TABLE asignaciones_equipos ADD KEY FK_d45caadc524107de88e14c56edc (equipo_id)`,
      `ALTER TABLE asignaciones_equipos ADD KEY FK_d40b8eddf1ab447afcfd01573c3 (asignado_por_usuario_id)`,
      `ALTER TABLE asignaciones_equipos ADD KEY FK_60b2c78bcd7864b5800ca79608c (asignado_a_usuario_id)`,

      `ALTER TABLE historial_mantenimiento ADD PRIMARY KEY (id)`,
      `ALTER TABLE historial_mantenimiento ADD KEY FK_72ec6e086183709be98bc5e40f4 (equipo_id)`,
      `ALTER TABLE historial_mantenimiento ADD KEY FK_458e5f9d7de637e68aa0436db09 (reportado_por_usuario_id)`,
      `ALTER TABLE historial_mantenimiento ADD KEY FK_81e2d224413c308726fcee58420 (tecnico_usuario_id)`,

      // AUTO_INCREMENT
      `ALTER TABLE areas MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE articulos MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE asignaciones_equipos MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE categorias MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE equipos MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE historial_mantenimiento MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE movimientos MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE roles MODIFY id int(11) NOT NULL AUTO_INCREMENT`,
      `ALTER TABLE usuarios MODIFY id int(11) NOT NULL AUTO_INCREMENT`,

      // FOREIGN KEYS
      `ALTER TABLE usuarios ADD CONSTRAINT FK_9e519760a660751f4fa21453d3e FOREIGN KEY (rol_id) REFERENCES roles (id)`,

      `ALTER TABLE articulos ADD CONSTRAINT FK_13570a0a38e3d0c4480e014e86d FOREIGN KEY (categoria_id) REFERENCES categorias (id)`,

      `ALTER TABLE areas ADD CONSTRAINT FK_112dd5324a279327686addd1d7f FOREIGN KEY (responsable_id) REFERENCES usuarios (id)`,

      `ALTER TABLE equipos ADD CONSTRAINT FK_8641489fe80cee7317aadad67b9 FOREIGN KEY (ubicacion_actual_id) REFERENCES areas (id)`,
      `ALTER TABLE equipos ADD CONSTRAINT FK_4467438cd99093c81441b14abdf FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios (id)`,

      `ALTER TABLE movimientos ADD CONSTRAINT FK_84ce5d7aa7cc6dd5ec7ab7a8f39 FOREIGN KEY (articulo_id) REFERENCES articulos (id)`,
      `ALTER TABLE movimientos ADD CONSTRAINT FK_4c2865c35bf8cd8a08aa438d58e FOREIGN KEY (usuario_id) REFERENCES usuarios (id)`,

      `ALTER TABLE asignaciones_equipos ADD CONSTRAINT FK_d45caadc524107de88e14c56edc FOREIGN KEY (equipo_id) REFERENCES equipos (id)`,
      `ALTER TABLE asignaciones_equipos ADD CONSTRAINT FK_d40b8eddf1ab447afcfd01573c3 FOREIGN KEY (asignado_por_usuario_id) REFERENCES usuarios (id)`,
      `ALTER TABLE asignaciones_equipos ADD CONSTRAINT FK_60b2c78bcd7864b5800ca79608c FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios (id)`,

      `ALTER TABLE historial_mantenimiento ADD CONSTRAINT FK_72ec6e086183709be98bc5e40f4 FOREIGN KEY (equipo_id) REFERENCES equipos (id)`,
      `ALTER TABLE historial_mantenimiento ADD CONSTRAINT FK_458e5f9d7de637e68aa0436db09 FOREIGN KEY (reportado_por_usuario_id) REFERENCES usuarios (id)`,
      `ALTER TABLE historial_mantenimiento ADD CONSTRAINT FK_81e2d224413c308726fcee58420 FOREIGN KEY (tecnico_usuario_id) REFERENCES usuarios (id)`
    ];

    for (const stmt of queries) {
      try {
        await queryRunner.query(stmt);
      } catch (err) {
        if (ignorableError(err)) {
          continue;
        }
        throw err;
      }
    }
  }

  async down(queryRunner) {
    const tables = [
      'historial_mantenimiento',
      'asignaciones_equipos',
      'movimientos',
      'equipos',
      'areas',
      'articulos',
      'categorias',
      'usuarios',
      'roles'
    ];

    for (const t of tables) {
      try {
        await queryRunner.query(`DROP TABLE IF EXISTS \`${t}\``);
      } catch (_err) {
        // ignore
      }
    }
  }
}
