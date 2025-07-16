const { EntitySchema } = require("typeorm");

const Movimiento = new EntitySchema({
    name: "Movimiento",
    tableName: "movimientos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        tipo: {
            type: "enum",
            enum: ['entrada', 'salida', 'transferencia', 'asignacion', 'devolucion', 'mantenimiento'],
        },
        cantidad: {
            type: "int",
        },
        stock_anterior: {
            type: "int",
        },
        stock_nuevo: {
            type: "int",
        },
        motivo: {
            type: "varchar",
        },
        referencia: {
            type: "varchar",
            nullable: true,
        },
        ubicacion_origen: {
            type: "varchar",
            nullable: true,
        },
        ubicacion_destino: {
            type: "varchar",
            nullable: true,
        },
        asignado_a: {
            type: "varchar",
            nullable: true,
        },
        recibido_por: {
            type: "varchar",
            nullable: true,
        },
        observaciones: {
            type: "text",
            nullable: true,
        },
        fecha_creacion: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        articulo: {
            target: "Articulo",
            type: "many-to-one",
            joinColumn: { name: "articulo_id" },
        },
        usuario: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "usuario_id" },
        },
    },
});

module.exports = Movimiento;
