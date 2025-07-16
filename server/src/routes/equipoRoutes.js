
const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para equipos - Administradores y técnicos
router.get('/', verifyToken, authorizeRoles(['administrador', 'técnico']), equipoController.getAllEquipos);
router.get('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), equipoController.getEquipoById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'técnico']), equipoController.createEquipo);
router.put('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), equipoController.updateEquipo);
router.delete('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), equipoController.deleteEquipo);

module.exports = router;
