const { EntitySchema } = require("typeorm");

const HistorialMantenimiento = new EntitySchema({
    name: "HistorialMantenimiento",
    tableName: "historial_mantenimiento",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        fecha_inicio: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        fecha_fin: {
            type: "timestamp",
            nullable: true,
        },
        descripcion_problema: {
            type: "text",
        },
        estado: {
            type: "enum",
            enum: ['pendiente', 'en_progreso', 'completado', 'cancelado'],
        },
        costo: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
        },
        observaciones: {
            type: "text",
            nullable: true,
        },
    },
    relations: {
        equipo: {
            target: "Equipo",
            type: "many-to-one",
            joinColumn: { name: "equipo_id" },
        },
        reportado_por: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "reportado_por_usuario_id" },
        },
        tecnico: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "tecnico_usuario_id" },
            nullable: true,
        },
    },
});

module.exports = HistorialMantenimiento;
