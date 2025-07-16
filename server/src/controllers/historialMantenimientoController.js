
const AppDataSource = require('../config/database');
const HistorialMantenimiento = require('../entities/HistorialMantenimiento');
const Equipo = require('../entities/Equipo');
const Usuario = require('../entities/Usuario');

// Obtener todo el historial de mantenimiento
exports.getAllHistorial = async (req, res) => {
    try {
        const historialRepository = AppDataSource.getRepository(HistorialMantenimiento);
        const historial = await historialRepository.find({ 
            relations: ['equipo', 'reportado_por', 'tecnico'],
            order: { fecha_inicio: 'DESC' }
        });
        res.status(200).json(historial);
    } catch (error) {
        console.error('Error al obtener historial de mantenimiento:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial.' });
    }
};

// Obtener un registro de mantenimiento por ID
exports.getHistorialById = async (req, res) => {
    const { id } = req.params;
    try {
        const historialRepository = AppDataSource.getRepository(HistorialMantenimiento);
        const historial = await historialRepository.findOne({ where: { id }, relations: ['equipo', 'reportado_por', 'tecnico'] });
        if (!historial) {
            return res.status(404).json({ message: 'Registro de mantenimiento no encontrado.' });
        }
        res.status(200).json(historial);
    } catch (error) {
        console.error(`Error al obtener historial con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial.' });
    }
};

// Crear un nuevo registro de mantenimiento
exports.createHistorial = async (req, res) => {
    const { equipo_id, descripcion_problema, estado, costo, observaciones, tecnico_usuario_id } = req.body;
    try {
        const historialRepository = AppDataSource.getRepository(HistorialMantenimiento);
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const equipo = await equipoRepository.findOne({ where: { id: equipo_id } });
        if (!equipo) {
            return res.status(400).json({ message: 'El equipo especificado no existe.' });
        }

        const reportado_por = await usuarioRepository.findOne({ where: { id: req.user.id } });
        if (!reportado_por) {
            return res.status(400).json({ message: 'El usuario que reporta el problema no existe.' });
        }

        let tecnico = null;
        if (tecnico_usuario_id) {
            tecnico = await usuarioRepository.findOne({ where: { id: tecnico_usuario_id } });
            if (!tecnico) {
                return res.status(400).json({ message: 'El técnico asignado no existe.' });
            }
        }

        const nuevoHistorial = historialRepository.create({
            equipo, reportado_por, tecnico, descripcion_problema, estado, costo, observaciones
        });

        equipo.estado = 'en_mantenimiento';
        await equipoRepository.save(equipo);

        await historialRepository.save(nuevoHistorial);
        res.status(201).json({ message: 'Registro de mantenimiento creado exitosamente.', historial: nuevoHistorial });
    } catch (error) {
        console.error('Error al crear historial de mantenimiento:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el historial.' });
    }
};

// Actualizar un registro de mantenimiento
exports.updateHistorial = async (req, res) => {
    const { id } = req.params;
    const { descripcion_problema, estado, costo, observaciones, tecnico_usuario_id, fecha_fin } = req.body;
    
    try {
        const historialRepository = AppDataSource.getRepository(HistorialMantenimiento);
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const historial = await historialRepository.findOne({ where: { id }, relations: ['equipo'] });
        if (!historial) {
            return res.status(404).json({ message: 'Registro de mantenimiento no encontrado.' });
        }

        // Validaciones básicas
        if (!descripcion_problema || !estado) {
            return res.status(400).json({ message: 'La descripción del problema y el estado son obligatorios.' });
        }

        // Actualizar campos
        historial.descripcion_problema = descripcion_problema;
        historial.estado = estado;
        historial.costo = costo || null;
        historial.observaciones = observaciones || null;
        historial.fecha_fin = fecha_fin || null;

        // Actualizar técnico si se proporciona
        if (tecnico_usuario_id) {
            const tecnico = await usuarioRepository.findOne({ where: { id: tecnico_usuario_id } });
            if (!tecnico) {
                return res.status(400).json({ message: 'El técnico asignado no existe.' });
            }
            historial.tecnico = tecnico;
        }

        // Actualizar estado del equipo según el estado del mantenimiento
        if (estado === 'completado' || estado === 'cancelado') {
            historial.equipo.estado = 'disponible';
            await equipoRepository.save(historial.equipo);
        } else if (estado === 'en_progreso') {
            historial.equipo.estado = 'en_mantenimiento';
            await equipoRepository.save(historial.equipo);
        }

        await historialRepository.save(historial);
        res.status(200).json({ message: 'Registro de mantenimiento actualizado exitosamente.', historial });
    } catch (error) {
        console.error(`Error al actualizar historial con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el historial.' });
    }
};

// Eliminar un registro de mantenimiento (hard delete)
exports.deleteHistorial = async (req, res) => {
    const { id } = req.params;
    try {
        const historialRepository = AppDataSource.getRepository(HistorialMantenimiento);
        const historial = await historialRepository.findOne({ where: { id } });
        if (!historial) {
            return res.status(404).json({ message: 'Registro de mantenimiento no encontrado.' });
        }

        await historialRepository.remove(historial);
        res.status(200).json({ message: 'Registro de mantenimiento eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar historial con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el historial.' });
    }
};

// Obtener historial por equipo
exports.getHistorialByEquipo = async (req, res) => {
    const { equipo_id } = req.params;
    try {
        const historialRepository = AppDataSource.getRepository(HistorialMantenimiento);
        const historial = await historialRepository.find({ 
            where: { equipo: { id: equipo_id } },
            relations: ['equipo', 'reportado_por', 'tecnico'],
            order: { fecha_inicio: 'DESC' }
        });
        res.status(200).json(historial);
    } catch (error) {
        console.error(`Error al obtener historial del equipo ${equipo_id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial.' });
    }
};
