const AppDataSource = require('../config/database');
const Equipo = require('../entities/Equipo');
const Area = require('../entities/Area');
const Usuario = require('../entities/Usuario');

// Obtener todos los equipos
exports.getAllEquipos = async (req, res) => {
    try {
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const equipos = await equipoRepository.find({ 
            relations: ['ubicacion_actual', 'asignado_a'],
            order: { fecha_creacion: 'DESC' }
        });
        res.status(200).json(equipos);
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener equipos.' });
    }
};

// Obtener un equipo por ID
exports.getEquipoById = async (req, res) => {
    const { id } = req.params;
    try {
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const equipo = await equipoRepository.findOne({ where: { id }, relations: ['ubicacion_actual', 'asignado_a'] });
        if (!equipo) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }
        res.status(200).json(equipo);
    } catch (error) {
        console.error(`Error al obtener equipo con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el equipo.' });
    }
};

// Crear un nuevo equipo
exports.createEquipo = async (req, res) => {
    const { codigo_inventario, tipo, marca, modelo, numero_serie, estado, descripcion, especificaciones, ubicacion_actual_id, asignado_a_usuario_id } = req.body;

    // Validaciones básicas
    if (!codigo_inventario || codigo_inventario.trim() === '') return res.status(400).json({ message: 'El código de inventario es obligatorio.' });
    if (!tipo || tipo.trim() === '') return res.status(400).json({ message: 'El tipo es obligatorio.' });
    if (!marca || marca.trim() === '') return res.status(400).json({ message: 'La marca es obligatoria.' });
    if (!modelo || modelo.trim() === '') return res.status(400).json({ message: 'El modelo es obligatorio.' });
    if (!numero_serie || numero_serie.trim() === '') return res.status(400).json({ message: 'El número de serie es obligatorio.' });
    if (!estado || estado.trim() === '') return res.status(400).json({ message: 'El estado es obligatorio.' });
    if (!descripcion || descripcion.trim() === '') return res.status(400).json({ message: 'La descripción es obligatoria.' });
    if (!ubicacion_actual_id) return res.status(400).json({ message: 'La ubicación actual es obligatoria.' });

    try {
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const areaRepository = AppDataSource.getRepository(Area);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Verificar unicidad del código de inventario y número de serie
        const existingEquipoByCodigo = await equipoRepository.findOne({ where: { codigo_inventario } });
        if (existingEquipoByCodigo) {
            return res.status(400).json({ message: 'Ya existe un equipo con ese código de inventario.' });
        }
        const existingEquipoBySerie = await equipoRepository.findOne({ where: { numero_serie } });
        if (existingEquipoBySerie) {
            return res.status(400).json({ message: 'Ya existe un equipo con ese número de serie.' });
        }

        const ubicacion_actual = await areaRepository.findOne({ where: { id: ubicacion_actual_id } });
        if (!ubicacion_actual) {
            return res.status(400).json({ message: 'El área de ubicación especificada no existe.' });
        }

        let asignado_a = null;
        if (asignado_a_usuario_id) {
            asignado_a = await usuarioRepository.findOne({ where: { id: asignado_a_usuario_id } });
            if (!asignado_a) {
                return res.status(400).json({ message: 'El usuario asignado especificado no existe.' });
            }
        }

        const nuevoEquipo = equipoRepository.create({
            codigo_inventario, tipo, marca, modelo, numero_serie, estado, descripcion, especificaciones,
            ubicacion_actual, asignado_a, esta_activo: true // Por defecto, un nuevo equipo está activo
        });
        await equipoRepository.save(nuevoEquipo);
        res.status(201).json({ message: 'Equipo creado exitosamente.', equipo: nuevoEquipo });
    } catch (error) {
        console.error('Error al crear equipo:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el equipo.' });
    }
};

// Actualizar un equipo
exports.updateEquipo = async (req, res) => {
    const { id } = req.params;
    const { codigo_inventario, tipo, marca, modelo, numero_serie, estado, descripcion, especificaciones, ubicacion_actual_id, asignado_a_usuario_id, esta_activo } = req.body;

    // Validaciones básicas
    if (!codigo_inventario || codigo_inventario.trim() === '') return res.status(400).json({ message: 'El código de inventario es obligatorio.' });
    if (!tipo || tipo.trim() === '') return res.status(400).json({ message: 'El tipo es obligatorio.' });
    if (!marca || marca.trim() === '') return res.status(400).json({ message: 'La marca es obligatoria.' });
    if (!modelo || modelo.trim() === '') return res.status(400).json({ message: 'El modelo es obligatorio.' });
    if (!numero_serie || numero_serie.trim() === '') return res.status(400).json({ message: 'El número de serie es obligatorio.' });
    if (!estado || estado.trim() === '') return res.status(400).json({ message: 'El estado es obligatorio.' });
    if (!descripcion || descripcion.trim() === '') return res.status(400).json({ message: 'La descripción es obligatoria.' });
    if (!ubicacion_actual_id) return res.status(400).json({ message: 'La ubicación actual es obligatoria.' });

    try {
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const areaRepository = AppDataSource.getRepository(Area);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        let equipo = await equipoRepository.findOne({ where: { id } });
        if (!equipo) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }

        // Verificar unicidad del código de inventario y número de serie si se están cambiando
        if (codigo_inventario !== equipo.codigo_inventario) {
            const existingEquipoByCodigo = await equipoRepository.findOne({ where: { codigo_inventario } });
            if (existingEquipoByCodigo && existingEquipoByCodigo.id !== equipo.id) {
                return res.status(400).json({ message: 'Ya existe un equipo con ese código de inventario.' });
            }
        }
        if (numero_serie !== equipo.numero_serie) {
            const existingEquipoBySerie = await equipoRepository.findOne({ where: { numero_serie } });
            if (existingEquipoBySerie && existingEquipoBySerie.id !== equipo.id) {
                return res.status(400).json({ message: 'Ya existe un equipo con ese número de serie.' });
            }
        }

        const ubicacion_actual = await areaRepository.findOne({ where: { id: ubicacion_actual_id } });
        if (!ubicacion_actual) {
            return res.status(400).json({ message: 'El área de ubicación especificada no existe.' });
        }

        let asignado_a = null;
        if (asignado_a_usuario_id) {
            asignado_a = await usuarioRepository.findOne({ where: { id: asignado_a_usuario_id } });
            if (!asignado_a) {
                return res.status(400).json({ message: 'El usuario asignado especificado no existe.' });
            }
        }

        equipo.codigo_inventario = codigo_inventario;
        equipo.tipo = tipo;
        equipo.marca = marca;
        equipo.modelo = modelo;
        equipo.numero_serie = numero_serie;
        equipo.estado = estado;
        equipo.descripcion = descripcion;
        equipo.especificaciones = especificaciones;
        equipo.ubicacion_actual = ubicacion_actual;
        equipo.asignado_a = asignado_a;
        if (esta_activo !== undefined) {
            equipo.esta_activo = esta_activo;
        }

        await equipoRepository.save(equipo);
        res.status(200).json({ message: 'Equipo actualizado exitosamente.', equipo });
    } catch (error) {
        console.error(`Error al actualizar equipo con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el equipo.' });
    }
};

// Eliminar un equipo (hard delete)
exports.deleteEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const equipo = await equipoRepository.findOne({ where: { id } });
        if (!equipo) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }

        await equipoRepository.remove(equipo);

        res.status(200).json({ message: 'Equipo eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar equipo con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el equipo.' });
    }
};