
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const AppDataSource = require('./config/database');

const morgan = require('morgan');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rutas de usuarios
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Rutas de roles
const roleRoutes = require('./routes/roleRoutes');
app.use('/api/roles', roleRoutes);

// Rutas de áreas
const areaRoutes = require('./routes/areaRoutes');
app.use('/api/areas', areaRoutes);

// Rutas de categorías
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categorias', categoryRoutes);

// Rutas de artículos
const articuloRoutes = require('./routes/articuloRoutes');
app.use('/api/articulos', articuloRoutes);

// Rutas de equipos
const equipoRoutes = require('./routes/equipoRoutes');
app.use('/api/equipos', equipoRoutes);

// Rutas de movimientos
const movimientoRoutes = require('./routes/movimientoRoutes');
app.use('/api/movimientos', movimientoRoutes);

// Rutas de asignaciones de equipos
const asignacionEquipoRoutes = require('./routes/asignacionEquipoRoutes');
app.use('/api/asignaciones-equipos', asignacionEquipoRoutes);

// Rutas de historial de mantenimiento
const historialMantenimientoRoutes = require('./routes/historialMantenimientoRoutes');
app.use('/api/historial-mantenimiento', historialMantenimientoRoutes);

// Rutas del dashboard
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// Rutas (las crearemos a continuación)
// app.use('/api/usuarios', require('./routes/usuarioRoutes'));

// Ruta de prueba
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Endpoint de prueba para simular expiración de token
app.get('/api/test-expired-token', (req, res) => {
    res.status(401).json({ 
        message: 'Token expirado',
        error: 'Unauthorized'
    });
});

// Endpoint de prueba para obtener usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository("Usuario");
        const usuarios = await userRepository.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = app;
