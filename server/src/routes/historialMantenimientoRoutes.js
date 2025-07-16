
const express = require('express');
const router = express.Router();
const historialMantenimientoController = require('../controllers/historialMantenimientoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para historial de mantenimiento - Administradores y técnicos
router.get('/', verifyToken, authorizeRoles(['administrador', 'técnico']), historialMantenimientoController.getAllHistorial);
router.get('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), historialMantenimientoController.getHistorialById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'técnico']), historialMantenimientoController.createHistorial);
router.put('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), historialMantenimientoController.updateHistorial);
router.delete('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), historialMantenimientoController.deleteHistorial);

module.exports = router;
