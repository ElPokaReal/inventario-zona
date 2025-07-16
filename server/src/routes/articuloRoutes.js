
const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para artículos - Solo administradores
router.get('/', verifyToken, authorizeRoles(['administrador', 'tecnico']), articuloController.getAllArticulos);
router.get('/:id', verifyToken, authorizeRoles(['administrador', 'tecnico']), articuloController.getArticuloById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'tecnico']), articuloController.createArticulo);
router.put('/:id', verifyToken, authorizeRoles(['administrador', 'tecnico']), articuloController.updateArticulo);
router.delete('/:id', verifyToken, authorizeRoles(['administrador']), articuloController.deleteArticulo);

module.exports = router;
