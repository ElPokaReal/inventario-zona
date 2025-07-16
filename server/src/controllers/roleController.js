const AppDataSource = require('../config/database');
const Rol = require('../entities/Rol');

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
    try {
        const rolRepository = AppDataSource.getRepository(Rol);
        const roles = await rolRepository.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener roles.' });
    }
};

// Obtener un rol por ID
exports.getRoleById = async (req, res) => {
    const { id } = req.params;
    try {
        const rolRepository = AppDataSource.getRepository(Rol);
        const rol = await rolRepository.findOne({ where: { id } });
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }
        res.status(200).json(rol);
    } catch (error) {
        console.error('Error al obtener rol por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener rol.' });
    }
};

// Crear un nuevo rol
exports.createRole = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre del rol es obligatorio.' });
    }

    try {
        const rolRepository = AppDataSource.getRepository(Rol);
        const existingRole = await rolRepository.findOne({ where: { nombre } });
        if (existingRole) {
            return res.status(400).json({ message: 'Ya existe un rol con ese nombre.' });
        }
        const newRole = rolRepository.create({ nombre, esta_activo: true });
        await rolRepository.save(newRole);
        res.status(201).json({ message: 'Rol creado exitosamente.', rol: newRole });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear rol.' });
    }
};

// Actualizar un rol existente
exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { nombre, esta_activo } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre del rol es obligatorio.' });
    }

    try {
        const rolRepository = AppDataSource.getRepository(Rol);
        let rolToUpdate = await rolRepository.findOne({ where: { id } });
        if (!rolToUpdate) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        // Verificar si el nuevo nombre ya existe en otro rol
        if (nombre !== rolToUpdate.nombre) {
            const existingRole = await rolRepository.findOne({ where: { nombre } });
            if (existingRole && existingRole.id !== rolToUpdate.id) {
                return res.status(400).json({ message: 'Ya existe otro rol con ese nombre.' });
            }
        }

        rolToUpdate.nombre = nombre;
        if (esta_activo !== undefined) {
            rolToUpdate.esta_activo = esta_activo;
        }
        await rolRepository.save(rolToUpdate);
        res.status(200).json({ message: 'Rol actualizado exitosamente.', rol: rolToUpdate });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar rol.' });
    }
};

// Eliminar (desactivar) un rol
exports.deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const rolRepository = AppDataSource.getRepository(Rol);
        const rolToDelete = await rolRepository.findOne({ where: { id } });
        if (!rolToDelete) {
            return res.status(404).json({ message: 'Rol no encontrado.' });
        }

        rolToDelete.esta_activo = false; // Soft delete
        await rolRepository.save(rolToDelete);

        res.status(200).json({ message: 'Rol desactivado exitosamente.' });
    } catch (error) {
        console.error('Error al desactivar rol:', error);
        res.status(500).json({ message: 'Error interno del servidor al desactivar rol.' });
    }
};