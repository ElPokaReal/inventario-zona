const { EntitySchema } = require("typeorm");

const Rol = new EntitySchema({
    name: "Rol",
    tableName: "roles",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombre: {
            type: "varchar",
            unique: true,
        },
        esta_activo: {
            type: "boolean",
            default: true,
        },
    },
});

module.exports = Rol;
