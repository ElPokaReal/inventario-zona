require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');
const Usuario = require('../entities/Usuario');
const Rol = require('../entities/Rol');

// Función para iniciar sesión
exports.loginUser = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Buscar usuario por nombre de usuario
        const user = await usuarioRepository.findOne({ where: { nombre_usuario }, relations: ['rol'] });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(contrasena, user.hash_contrasena);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Generar JWT con el nombre del rol
        const payload = {
            id: user.id,
            nombre_usuario: user.nombre_usuario,
            role: user.rol ? user.rol.nombre : 'sin_rol' // Usar el nombre del rol
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso.', 
            token,
            role: payload.role, // Nombre del rol
            id: user.id,
            nombre_completo: user.nombre_completo,
            departamento: user.departamento
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

// Función para cerrar sesión (en el lado del servidor, esto es principalmente para invalidar el token si se usa una lista negra)
exports.logoutUser = (req, res) => {
    // Para JWT, el "logout" es principalmente una acción del cliente (eliminar el token).
    // Si se implementa una lista negra de tokens, la lógica iría aquí.
    // Por ahora, simplemente confirmamos que la solicitud de logout fue recibida.
    res.status(200).json({ message: 'Sesión cerrada exitosamente (token debe ser eliminado por el cliente).' });
};
