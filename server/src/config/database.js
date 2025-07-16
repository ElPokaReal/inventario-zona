const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "inventario_db",
    synchronize: false, // ¡Cuidado! true solo para desarrollo, sincroniza el esquema. En producción, usar migraciones.
    logging: false,
    entities: [
        __dirname + "/../entities/Articulo.js",
        __dirname + "/../entities/Area.js",
        __dirname + "/../entities/AsignacionEquipo.js",
        __dirname + "/../entities/Categoria.js",
        __dirname + "/../entities/Equipo.js",
        __dirname + "/../entities/HistorialMantenimiento.js",
        __dirname + "/../entities/Movimiento.js",
        __dirname + "/../entities/Rol.js",
        __dirname + "/../entities/Usuario.js",
    ],
    migrations: [],
    subscribers: [],
});

module.exports = AppDataSource;
