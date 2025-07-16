
const express = require('express');
const router = express.Router();
const asignacionEquipoController = require('../controllers/asignacionEquipoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para asignaciones de equipos
router.get('/', verifyToken, asignacionEquipoController.getAllAsignaciones);
router.get('/:id', verifyToken, asignacionEquipoController.getAsignacionById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'tecnico']), asignacionEquipoController.createAsignacion);

module.exports = router;
