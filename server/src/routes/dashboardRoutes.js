const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para el dashboard - Administradores y técnicos
router.get('/stats', verifyToken, authorizeRoles(['administrador', 'técnico']), dashboardController.getDashboardStats);
router.get('/movements', verifyToken, authorizeRoles(['administrador', 'técnico']), dashboardController.getRecentMovements);
router.get('/categories', verifyToken, authorizeRoles(['administrador', 'técnico']), dashboardController.getTopCategories);
router.get('/inventory-status', verifyToken, authorizeRoles(['administrador', 'técnico']), dashboardController.getInventoryStatus);

module.exports = router; 