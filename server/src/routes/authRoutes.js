const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para iniciar sesión
router.post('/login', authController.loginUser);

// Ruta para cerrar sesión
router.post('/logout', authController.logoutUser);

module.exports = router;
