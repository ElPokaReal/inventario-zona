const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para roles - Solo administradores
router.get('/', verifyToken, authorizeRoles(['administrador']), roleController.getAllRoles);
router.get('/:id', verifyToken, authorizeRoles(['administrador']), roleController.getRoleById);
router.post('/', verifyToken, authorizeRoles(['administrador']), roleController.createRole);
router.put('/:id', verifyToken, authorizeRoles(['administrador']), roleController.updateRole);
router.delete('/:id', verifyToken, authorizeRoles(['administrador']), roleController.deleteRole);

module.exports = router;
