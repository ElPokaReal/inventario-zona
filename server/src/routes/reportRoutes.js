const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Middleware de autorización para administradores
const isAdmin = authorizeRoles(['administrador']);

// --- Ruta para el Reporte Completo ---
router.get('/comprehensive-excel', verifyToken, isAdmin, reportController.generateComprehensiveReport);

// --- Rutas para Reportes Individuales en Excel ---

// Reporte del Dashboard con detalles
router.get('/dashboard-excel', verifyToken, isAdmin, reportController.generateDashboardReportExcel);

// Reporte de Estadísticas de Inventario con detalles
router.get('/inventory-stats-excel', verifyToken, isAdmin, reportController.generateInventoryStatsReportExcel);

// Reporte de Movimientos Recientes
router.get('/movements-excel', verifyToken, isAdmin, reportController.generateRecentMovementsReportExcel);

// Reporte de Alertas de Stock
router.get('/stock-alerts-excel', verifyToken, isAdmin, reportController.generateStockAlertsReportExcel);

// Reporte de Categorías Principales
router.get('/top-categories-excel', verifyToken, isAdmin, reportController.generateTopCategoriesReportExcel);

// --- Rutas para Exportación Directa desde las listas ---
router.get('/export/users', verifyToken, isAdmin, reportController.generateUsersExcel);
router.get('/export/articulos', verifyToken, isAdmin, reportController.generateArticulosExcel);
router.get('/export/equipos', verifyToken, isAdmin, reportController.generateEquiposExcel);
router.get('/export/areas', verifyToken, isAdmin, reportController.generateAreasExcel);
router.get('/export/categorias', verifyToken, isAdmin, reportController.generateCategoriasExcel);
router.get('/export/mantenimientos', verifyToken, isAdmin, reportController.generateMantenimientosExcel);
router.get('/export/movimientos', verifyToken, isAdmin, reportController.generateMovimientosExcel);

module.exports = router;
