require('dotenv').config();
require("reflect-metadata");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const AppDataSource = require("./src/config/database");
const app = require("./src/index");
const Rol = require("./src/entities/Rol");
const Usuario = require("./src/entities/Usuario");

async function setupDatabase() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST || "localhost",
            port: DB_PORT || 3306,
            user: DB_USER || "root",
            password: DB_PASSWORD || "",
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME || "inventario_db"}\``);
        console.log(`Base de datos "${DB_NAME || "inventario_db"}" asegurada.`);
        await connection.end();
    } catch (error) {
        console.error("Error al configurar la base de datos:", error);
        throw error;
    }
}

async function seedDatabase() {
    try {
        const rolRepository = AppDataSource.getRepository(Rol);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // 1. Crear rol de administrador si no existe
        let adminRol = await rolRepository.findOne({ where: { nombre: "administrador" } });
        if (!adminRol) {
            adminRol = rolRepository.create({ nombre: "administrador" });
            await rolRepository.save(adminRol);
            console.log("Rol 'administrador' creado.");
        }

        // 2. Crear usuario administrador si no existe
        const adminUserExists = await usuarioRepository.findOne({ where: { nombre_usuario: "admin" } });
        if (!adminUserExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const adminUser = usuarioRepository.create({
                nombre_usuario: "admin",
                hash_contrasena: hashedPassword,
                rol: adminRol,
                nombre_completo: "Administrador del Sistema",
                email: "admin@sistema.com",
                departamento: "TI",
                posicion: "Administrador",
                esta_activo: true,
            });
            await usuarioRepository.save(adminUser);
            console.log("Usuario 'admin' creado.");
        }
    } catch (error) {
        console.error("Error en el seeder de la base de datos:", error);
    }
}

async function main() {
    try {
        await setupDatabase();
        await AppDataSource.initialize();
        console.log("Conexión con TypeORM inicializada.");

        await seedDatabase();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

main();