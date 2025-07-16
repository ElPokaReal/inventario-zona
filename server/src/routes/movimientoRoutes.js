
const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para movimientos - Administradores y técnicos
router.get('/', verifyToken, authorizeRoles(['administrador', 'técnico']), movimientoController.getAllMovimientos);
router.get('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), movimientoController.getMovimientoById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'técnico']), movimientoController.createMovimiento);
router.put('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), movimientoController.updateMovimiento);
router.delete('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), movimientoController.deleteMovimiento);

module.exports = router;
