const AppDataSource = require('../config/database');
const Area = require('../entities/Area');
const Usuario = require('../entities/Usuario');

// Obtener todas las áreas
exports.getAllAreas = async (req, res) => {
    try {
        const areaRepository = AppDataSource.getRepository(Area);
        const areas = await areaRepository.find({ 
            relations: ['responsable']
        });
        res.status(200).json(areas);
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener áreas.' });
    }
};

// Obtener usuarios disponibles para ser responsables de áreas
exports.getAvailableResponsables = async (req, res) => {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const usuarios = await usuarioRepository.find({ 
            where: { esta_activo: true },
            select: ['id', 'nombre_completo', 'nombre_usuario', 'email', 'departamento']
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.' });
    }
};

// Obtener un área por ID
exports.getAreaById = async (req, res) => {
    const { id } = req.params;
    try {
        const areaRepository = AppDataSource.getRepository(Area);
        const area = await areaRepository.findOne({ 
            where: { id },
            relations: ['responsable']
        });
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada.' });
        }
        res.status(200).json(area);
    } catch (error) {
        console.error(`Error al obtener área con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el área.' });
    }
};

// Crear una nueva área
exports.createArea = async (req, res) => {
    const { nombre, descripcion, codigo, responsable_id } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre del área es obligatorio.' });
    }

    try {
        const areaRepository = AppDataSource.getRepository(Area);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Verificar si ya existe un área con ese nombre
        const existingArea = await areaRepository.findOne({ where: { nombre } });
        if (existingArea) {
            return res.status(400).json({ message: 'Ya existe un área con ese nombre.' });
        }

        // Verificar si ya existe un área con ese código (si se proporciona)
        if (codigo && codigo.trim() !== '') {
            const existingAreaByCode = await areaRepository.findOne({ where: { codigo } });
            if (existingAreaByCode) {
                return res.status(400).json({ message: 'Ya existe un área con ese código.' });
            }
        }

        // Buscar el responsable si se proporciona
        let responsable = null;
        if (responsable_id) {
            responsable = await usuarioRepository.findOne({ where: { id: responsable_id } });
            if (!responsable) {
                return res.status(400).json({ message: 'El responsable especificado no existe.' });
            }
        }

        const nuevaArea = areaRepository.create({ 
            nombre, 
            descripcion, 
            codigo: codigo || null,
            responsable,
            esta_activa: true 
        });
        
        await areaRepository.save(nuevaArea);
        res.status(201).json({ message: 'Área creada exitosamente.', area: nuevaArea });
    } catch (error) {
        console.error('Error al crear área:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el área.' });
    }
};

// Actualizar un área
exports.updateArea = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, codigo, responsable_id, esta_activa } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre del área es obligatorio.' });
    }

    try {
        const areaRepository = AppDataSource.getRepository(Area);
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        
        let area = await areaRepository.findOne({ where: { id } });
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada.' });
        }

        // Verificar unicidad del nombre si se está cambiando
        if (nombre !== area.nombre) {
            const existingArea = await areaRepository.findOne({ where: { nombre } });
            if (existingArea && existingArea.id !== area.id) {
                return res.status(400).json({ message: 'Ya existe un área con ese nombre.' });
            }
        }

        // Verificar unicidad del código si se está cambiando
        if (codigo && codigo !== area.codigo) {
            const existingAreaByCode = await areaRepository.findOne({ where: { codigo } });
            if (existingAreaByCode && existingAreaByCode.id !== area.id) {
                return res.status(400).json({ message: 'Ya existe un área con ese código.' });
            }
        }

        // Buscar el responsable si se proporciona
        let responsable = null;
        if (responsable_id) {
            responsable = await usuarioRepository.findOne({ where: { id: responsable_id } });
            if (!responsable) {
                return res.status(400).json({ message: 'El responsable especificado no existe.' });
            }
        }

        area.nombre = nombre;
        area.descripcion = descripcion;
        area.codigo = codigo || null;
        area.responsable = responsable;
        if (esta_activa !== undefined) {
            area.esta_activa = esta_activa;
        }
        
        await areaRepository.save(area);
        res.status(200).json({ message: 'Área actualizada exitosamente.', area });
    } catch (error) {
        console.error(`Error al actualizar área con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el área.' });
    }
};

// Eliminar un área de la base de datos
exports.deleteArea = async (req, res) => {
    const { id } = req.params;
    try {
        const areaRepository = AppDataSource.getRepository(Area);
        const area = await areaRepository.findOne({ where: { id } });
        if (!area) {
            return res.status(404).json({ message: 'Área no encontrada.' });
        }

        // Eliminar el área completamente de la base de datos
        await areaRepository.remove(area);

        res.status(200).json({ message: 'Área eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar área con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el área.' });
    }
};