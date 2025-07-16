const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para usuarios - Solo administradores
router.get('/', verifyToken, authorizeRoles(['administrador']), userController.getAllUsers);
router.get('/:id', verifyToken, authorizeRoles(['administrador']), userController.getUserById);
router.post('/', verifyToken, authorizeRoles(['administrador']), userController.registerUser);
router.put('/:id', verifyToken, authorizeRoles(['administrador']), userController.updateUser);
router.delete('/:id', verifyToken, authorizeRoles(['administrador']), userController.deleteUser);

// Ruta para obtener usuarios activos (para formularios)
router.get('/active/list', verifyToken, userController.getActiveUsers);

module.exports = router;