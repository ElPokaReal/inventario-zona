const { EntitySchema } = require("typeorm");

const AsignacionEquipo = new EntitySchema({
    name: "AsignacionEquipo",
    tableName: "asignaciones_equipos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        fecha_asignacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        fecha_devolucion: {
            type: "timestamp",
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
        asignado_por: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "asignado_por_usuario_id" },
        },
        asignado_a: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "asignado_a_usuario_id" },
        },
    },
});

module.exports = AsignacionEquipo;
