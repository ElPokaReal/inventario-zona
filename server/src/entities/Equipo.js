const { EntitySchema } = require("typeorm");

const Equipo = new EntitySchema({
    name: "Equipo",
    tableName: "equipos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        codigo_inventario: {
            type: "varchar",
            unique: true,
        },
        tipo: {
            type: "enum",
            enum: ['computadora', 'periferico', 'accesorio', 'red', 'audiovisual'],
        },
        marca: {
            type: "varchar",
        },
        modelo: {
            type: "varchar",
        },
        numero_serie: {
            type: "varchar",
            unique: true,
        },
        estado: {
            type: "enum",
            enum: ['activo', 'mantenimiento', 'reparacion', 'retirado', 'extraviado'],
        },
        descripcion: {
            type: "text",
        },
        especificaciones: {
            type: "json",
            nullable: true,
        },
        fecha_creacion: {
            type: "timestamp",
            createDate: true,
        },
        fecha_actualizacion: {
            type: "timestamp",
            updateDate: true,
        },
        esta_activo: {
            type: "boolean",
            default: true,
        },
    },
    relations: {
        ubicacion_actual: {
            target: "Area",
            type: "many-to-one",
            joinColumn: { name: "ubicacion_actual_id" },
        },
        asignado_a: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "asignado_a_usuario_id" },
            nullable: true,
        },
        asignaciones: {
            target: "AsignacionEquipo",
            type: "one-to-many",
            inverseSide: "equipo",
        },
        historial_mantenimiento: {
            target: "HistorialMantenimiento",
            type: "one-to-many",
            inverseSide: "equipo",
        },
    },
});

module.exports = Equipo;
