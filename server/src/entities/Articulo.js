const { EntitySchema } = require("typeorm");

const Articulo = new EntitySchema({
    name: "Articulo",
    tableName: "articulos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        codigo: {
            type: "varchar",
            unique: true,
        },
        nombre: {
            type: "varchar",
        },
        descripcion: {
            type: "text",
        },
        numero_serie: {
            type: "varchar",
            nullable: true,
        },
        stock_actual: {
            type: "int",
            default: 0,
        },
        stock_minimo: {
            type: "int",
            default: 0,
        },
        stock_maximo: {
            type: "int",
            nullable: true,
        },
        ubicacion: {
            type: "varchar",
        },
        estado: {
            type: "enum",
            enum: ['disponible', 'en_uso', 'en_mantenimiento', 'en_reparacion', 'retirado'],
            default: 'disponible',
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
        categoria: {
            target: "Categoria",
            type: "many-to-one",
            joinColumn: { name: "categoria_id" },
        },
        movimientos: {
            target: "Movimiento",
            type: "one-to-many",
            inverseSide: "articulo",
        },
    },
});

module.exports = Articulo;
