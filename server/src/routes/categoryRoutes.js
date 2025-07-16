
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas para categorías - Administradores y técnicos
router.get('/', verifyToken, authorizeRoles(['administrador', 'técnico']), categoryController.getAllCategorias);
router.get('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), categoryController.getCategoriaById);
router.post('/', verifyToken, authorizeRoles(['administrador', 'técnico']), categoryController.createCategoria);
router.put('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), categoryController.updateCategoria);
router.delete('/:id', verifyToken, authorizeRoles(['administrador', 'técnico']), categoryController.deleteCategoria);

module.exports = router;
