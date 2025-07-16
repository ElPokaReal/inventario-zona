
const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para áreas - Administradores y técnicos
router.get('/', verifyToken, authorizeRoles(['administrador', 'técnico']), areaController.getAllAreas);
router.get('/responsables', verifyToken, areaController.getAvailableResponsables);
router.get('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), areaController.getAreaById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'técnico']), areaController.createArea);
router.put('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), areaController.updateArea);
router.delete('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), areaController.deleteArea);

module.exports = router;
