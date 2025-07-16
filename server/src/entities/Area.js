const { EntitySchema } = require("typeorm");

const Area = new EntitySchema({
    name: "Area",
    tableName: "areas",
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
        responsable: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "responsable_id" },
            nullable: true,
        },
        equipos: {
            target: "Equipo",
            type: "one-to-many",
            inverseSide: "ubicacion_actual",
        },
    },
});

module.exports = Area;
