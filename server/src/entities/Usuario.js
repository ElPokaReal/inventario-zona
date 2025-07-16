const { EntitySchema } = require("typeorm");

const Usuario = new EntitySchema({
    name: "Usuario", // Nombre de la entidad
    tableName: "usuarios", // Nombre de la tabla en la base de datos
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombre_usuario: {
            type: "varchar",
            unique: true,
        },
        nombre_completo: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        hash_contrasena: {
            type: "varchar",
        },
        departamento: {
            type: "varchar",
        },
        posicion: {
            type: "varchar",
        },
        telefono: {
            type: "varchar",
            nullable: true,
        },
        esta_activo: {
            type: "boolean",
            default: true,
        },
        fecha_creacion: {
            type: "timestamp",
            createDate: true,
        },
        fecha_actualizacion: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        rol: {
            target: "Rol",
            type: "many-to-one",
            joinColumn: { name: "rol_id" },
            eager: true, // Carga el rol automáticamente
        },
    },
});

module.exports = Usuario;
