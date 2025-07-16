const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjuntar el payload decodificado al objeto de solicitud
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware para autorizar roles
exports.authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no definido.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos necesarios.' });
        }
        next();
    };
};
