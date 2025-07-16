
const AppDataSource = require('../config/database');
const AsignacionEquipo = require('../entities/AsignacionEquipo');
const Equipo = require('../entities/Equipo');
const Usuario = require('../entities/Usuario');

// Obtener todas las asignaciones de equipos
exports.getAllAsignaciones = async (req, res) => {
    try {
        const asignacionRepository = AppDataSource.getRepository(AsignacionEquipo);
        const asignaciones = await asignacionRepository.find({ relations: ['equipo', 'asignado_por', 'asignado_a'] });
        res.status(200).json(asignaciones);
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener asignaciones.' });
    }
};

// Obtener una asignación por ID
exports.getAsignacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const asignacionRepository = AppDataSource.getRepository(AsignacionEquipo);
        const asignacion = await asignacionRepository.findOne({ where: { id }, relations: ['equipo', 'asignado_por', 'asignado_a'] });
        if (!asignacion) {
            return res.status(404).json({ message: 'Asignación no encontrada.' });
        }
        res.status(200).json(asignacion);
    } catch (error) {
        console.error(`Error al obtener asignación con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la asignación.' });
    }
};

// Crear una nueva asignación de equipo
exports.createAsignacion = async (req, res) => {
    const { equipo_id, asignado_a_usuario_id, observaciones } = req.body;
    try {
        const asignacionRepository = AppDataSource.getRepository(AsignacionEquipo);
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const equipo = await equipoRepository.findOne({ where: { id: equipo_id } });
        if (!equipo) {
            return res.status(400).json({ message: 'El equipo especificado no existe.' });
        }

        const asignado_por = await usuarioRepository.findOne({ where: { id: req.user.id } });
        if (!asignado_por) {
            return res.status(400).json({ message: 'El usuario que asigna el equipo no existe.' });
        }

        const asignado_a = await usuarioRepository.findOne({ where: { id: asignado_a_usuario_id } });
        if (!asignado_a) {
            return res.status(400).json({ message: 'El usuario al que se asigna el equipo no existe.' });
        }

        const nuevaAsignacion = asignacionRepository.create({
            equipo, asignado_por, asignado_a, observaciones
        });

        equipo.asignado_a = asignado_a;
        equipo.estado = 'en_uso';
        await equipoRepository.save(equipo);

        await asignacionRepository.save(nuevaAsignacion);
        res.status(201).json({ message: 'Asignación de equipo creada exitosamente.', asignacion: nuevaAsignacion });
    } catch (error) {
        console.error('Error al crear asignación de equipo:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la asignación.' });
    }
};
