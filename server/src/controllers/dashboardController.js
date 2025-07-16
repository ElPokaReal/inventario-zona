const AppDataSource = require('../config/database');
const Articulo = require('../entities/Articulo');
const Movimiento = require('../entities/Movimiento');
const Categoria = require('../entities/Categoria');
const Equipo = require('../entities/Equipo');
const HistorialMantenimiento = require('../entities/HistorialMantenimiento');
const { LessThan, MoreThanOrEqual, LessThanOrEqual } = require('typeorm');

// Obtener estadísticas generales del dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const equipoRepository = AppDataSource.getRepository(Equipo);
        const mantenimientoRepository = AppDataSource.getRepository(HistorialMantenimiento);

        // Estadísticas de artículos
        const totalArticulos = await articuloRepository.count();
        const disponiblesArticulos = await articuloRepository.count({ where: { estado: 'disponible' } });
        const enUsoArticulos = await articuloRepository.count({ where: { estado: 'en_uso' } });
        const enMantenimientoArticulos = await articuloRepository.count({ where: { estado: 'en_mantenimiento' } });
        
        // Artículos con stock bajo (menos de 5 unidades)
        const stockBajoArticulos = await articuloRepository.count({ where: { stock_actual: LessThan(5) } });
        const sinStockArticulos = await articuloRepository.count({ where: { stock_actual: 0 } });

        // Estadísticas de equipos
        const totalEquipos = await equipoRepository.count();
        const disponiblesEquipos = await equipoRepository.count({ where: { estado: 'disponible' } });
        const enUsoEquipos = await equipoRepository.count({ where: { estado: 'en_uso' } });
        const enMantenimientoEquipos = await equipoRepository.count({ where: { estado: 'en_mantenimiento' } });

        // Movimientos de hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const movimientosHoy = await movimientoRepository.count({
            where: {
                fecha_creacion: MoreThanOrEqual(today)
            }
        });

        // Mantenimientos activos
        const mantenimientosActivos = await mantenimientoRepository.count({
            where: {
                estado: 'en_progreso'
            }
        });

        // Combinar estadísticas
        const stats = {
            articulos: {
                total: totalArticulos,
                disponibles: disponiblesArticulos,
                enUso: enUsoArticulos,
                enMantenimiento: enMantenimientoArticulos,
                stockBajo: stockBajoArticulos,
                sinStock: sinStockArticulos
            },
            equipos: {
                total: totalEquipos,
                disponibles: disponiblesEquipos,
                enUso: enUsoEquipos,
                enMantenimiento: enMantenimientoEquipos
            },
            movimientos: {
                hoy: movimientosHoy
            },
            mantenimiento: {
                activos: mantenimientosActivos
            }
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas.' });
    }
};

// Obtener movimientos recientes
exports.getRecentMovements = async (req, res) => {
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const limit = parseInt(req.query.limit) || 10;

        const movimientos = await movimientoRepository.find({
            relations: ['articulo', 'usuario'],
            order: { fecha_creacion: 'DESC' },
            take: limit
        });

        res.status(200).json(movimientos);
    } catch (error) {
        console.error('Error al obtener movimientos recientes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener movimientos.' });
    }
};

// Obtener categorías principales
exports.getTopCategories = async (req, res) => {
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const limit = parseInt(req.query.limit) || 5;

        const categorias = await categoriaRepository.find({
            order: { nombre: 'ASC' }
        });

        // Contar artículos por categoría
        const categoriasConStats = await Promise.all(
            categorias.map(async (categoria) => {
                const totalArticulos = await articuloRepository.count({
                    where: { categoria: { id: categoria.id } }
                });

                const disponiblesArticulos = await articuloRepository.count({
                    where: { 
                        categoria: { id: categoria.id },
                        estado: 'disponible'
                    }
                });

                return {
                    id: categoria.id,
                    nombre: categoria.nombre,
                    totalArticulos,
                    disponiblesArticulos
                };
            })
        );

        // Ordenar por total de artículos y tomar los primeros
        const topCategorias = categoriasConStats
            .sort((a, b) => b.totalArticulos - a.totalArticulos)
            .slice(0, limit);

        res.status(200).json(topCategorias);
    } catch (error) {
        console.error('Error al obtener categorías principales:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener categorías.' });
    }
};

// Obtener estado del inventario
exports.getInventoryStatus = async (req, res) => {
    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const equipoRepository = AppDataSource.getRepository(Equipo);

        // Estado de artículos
        const articulosDisponibles = await articuloRepository.count({ where: { estado: 'disponible' } });
        const articulosEnUso = await articuloRepository.count({ where: { estado: 'en_uso' } });
        const articulosEnMantenimiento = await articuloRepository.count({ where: { estado: 'en_mantenimiento' } });
        const articulosStockBajo = await articuloRepository.count({ where: { stock_actual: LessThan(5) } });
        const articulosSinStock = await articuloRepository.count({ where: { stock_actual: 0 } });

        // Estado de equipos
        const equiposDisponibles = await equipoRepository.count({ where: { estado: 'disponible' } });
        const equiposEnUso = await equipoRepository.count({ where: { estado: 'en_uso' } });
        const equiposEnMantenimiento = await equipoRepository.count({ where: { estado: 'en_mantenimiento' } });

        const status = {
            articulos: {
                disponibles: articulosDisponibles,
                enUso: articulosEnUso,
                enMantenimiento: articulosEnMantenimiento,
                stockBajo: articulosStockBajo,
                sinStock: articulosSinStock
            },
            equipos: {
                disponibles: equiposDisponibles,
                enUso: equiposEnUso,
                enMantenimiento: equiposEnMantenimiento
            }
        };

        res.status(200).json(status);
    } catch (error) {
        console.error('Error al obtener estado del inventario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estado del inventario.' });
    }
}; 