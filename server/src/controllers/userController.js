const bcrypt = require('bcrypt');
const AppDataSource = require('../config/database');
const Usuario = require('../entities/Usuario');
const Rol = require('../entities/Rol');

// Función para registrar un nuevo usuario (solo accesible por administradores)
exports.registerUser = async (req, res) => {
    const { nombre_usuario, nombre_completo, email, contrasena, departamento, posicion, telefono, rol_id } = req.body;

    // Validaciones básicas
    if (!nombre_usuario || nombre_usuario.trim() === '') return res.status(400).json({ message: 'El nombre de usuario es obligatorio.' });
    if (!nombre_completo || nombre_completo.trim() === '') return res.status(400).json({ message: 'El nombre completo es obligatorio.' });
    if (!email || email.trim() === '') return res.status(400).json({ message: 'El email es obligatorio.' });
    if (!contrasena || contrasena.trim() === '') return res.status(400).json({ message: 'La contraseña es obligatoria.' });
    if (!departamento || departamento.trim() === '') return res.status(400).json({ message: 'El departamento es obligatorio.' });
    if (!posicion || posicion.trim() === '') return res.status(400).json({ message: 'La posición es obligatoria.' });
    if (!rol_id) return res.status(400).json({ message: 'El rol es obligatorio.' });

    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const rolRepository = AppDataSource.getRepository(Rol);

        // Verificar si el usuario o email ya existen
        const existingUser = await usuarioRepository.findOne({ where: [{ nombre_usuario }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario o el email ya están registrados.' });
        }

        // Hashear la contraseña
        const hash_contrasena = await bcrypt.hash(contrasena, 10);

        // Buscar el rol
        const rol = await rolRepository.findOne({ where: { id: rol_id } });
        if (!rol) {
            return res.status(400).json({ message: 'El rol especificado no existe.' });
        }

        // Crear nuevo usuario
        const newUser = usuarioRepository.create({
            nombre_usuario,
            nombre_completo,
            email,
            hash_contrasena,
            departamento,
            posicion,
            telefono,
            rol,
            esta_activo: true,
        });

        await usuarioRepository.save(newUser);

        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: { id: newUser.id, nombre_usuario: newUser.nombre_usuario, email: newUser.email } });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const users = await usuarioRepository.find({ relations: ['rol'] });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.' });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const user = await usuarioRepository.findOne({ where: { id }, relations: ['rol'] });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error al obtener usuario con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el usuario.' });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, email, departamento, posicion, telefono, rol_id, esta_activo } = req.body;

    // Validaciones básicas
    if (!nombre_completo || nombre_completo.trim() === '') return res.status(400).json({ message: 'El nombre completo es obligatorio.' });
    if (!email || email.trim() === '') return res.status(400).json({ message: 'El email es obligatorio.' });
    if (!departamento || departamento.trim() === '') return res.status(400).json({ message: 'El departamento es obligatorio.' });
    if (!posicion || posicion.trim() === '') return res.status(400).json({ message: 'La posición es obligatoria.' });
    if (!rol_id) return res.status(400).json({ message: 'El rol es obligatorio.' });

    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const rolRepository = AppDataSource.getRepository(Rol);

        let user = await usuarioRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar si el email ya existe en otro usuario
        if (email && email !== user.email) {
            const existingUser = await usuarioRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está registrado por otro usuario.' });
            }
        }

        let rol;
        if (rol_id) {
            rol = await rolRepository.findOne({ where: { id: rol_id } });
            if (!rol) {
                return res.status(400).json({ message: 'El rol especificado no existe.' });
            }
        }

        user.nombre_completo = nombre_completo;
        user.email = email;
        user.departamento = departamento;
        user.posicion = posicion;
        user.telefono = telefono;
        user.rol = rol;
        user.esta_activo = (esta_activo !== undefined) ? esta_activo : user.esta_activo;

        await usuarioRepository.save(user);
        res.status(200).json({ message: 'Usuario actualizado exitosamente.', user });
    } catch (error) {
        console.error(`Error al actualizar usuario con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el usuario.' });
    }
};

// Eliminar un usuario de la base de datos
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const user = await usuarioRepository.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Eliminar el usuario completamente de la base de datos
        await usuarioRepository.remove(user);

        res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar usuario con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el usuario.' });
    }
};

// Obtener usuarios técnicos (para depuración)
exports.getTechnicians = async (req, res) => {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const technicians = await usuarioRepository.find({ 
            relations: ['rol'],
            where: { rol: { nombre: 'técnico' } } // Buscar por nombre del rol
        });
        
        console.log('Technicians found:', technicians);
        res.status(200).json(technicians);
    } catch (error) {
        console.error('Error al obtener técnicos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener técnicos.' });
    }
};

// Obtener usuarios activos (para formularios)
exports.getActiveUsers = async (req, res) => {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const activeUsers = await usuarioRepository.find({ 
            where: { esta_activo: true },
            relations: ['rol'],
            select: ['id', 'nombre_usuario', 'nombre_completo', 'email', 'departamento', 'posicion']
        });
        
        res.status(200).json(activeUsers);
    } catch (error) {
        console.error('Error al obtener usuarios activos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios activos.' });
    }
};
