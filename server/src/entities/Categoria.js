const { EntitySchema } = require("typeorm");

const Categoria = new EntitySchema({
    name: "Categoria",
    tableName: "categorias",
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
        descripcion: {
            type: "text",
            nullable: true,
        },
        codigo: {
            type: "varchar",
            unique: true,
            nullable: true,
        },
        esta_activa: {
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
        articulos: {
            target: "Articulo",
            type: "one-to-many",
            inverseSide: "categoria",
        },
    },
});

module.exports = Categoria;
