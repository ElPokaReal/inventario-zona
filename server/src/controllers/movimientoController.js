
const AppDataSource = require('../config/database');
const Movimiento = require('../entities/Movimiento');
const Articulo = require('../entities/Articulo');
const Usuario = require('../entities/Usuario');

// Obtener todos los movimientos
exports.getAllMovimientos = async (req, res) => {
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const movimientos = await movimientoRepository.find({ 
            relations: ['articulo', 'usuario'],
            order: { fecha_creacion: 'DESC' }
        });
        res.status(200).json(movimientos);
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener movimientos.' });
    }
};

// Obtener un movimiento por ID
exports.getMovimientoById = async (req, res) => {
    const { id } = req.params;
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const movimiento = await movimientoRepository.findOne({ where: { id }, relations: ['articulo', 'usuario'] });
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado.' });
        }
        res.status(200).json(movimiento);
    } catch (error) {
        console.error(`Error al obtener movimiento con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el movimiento.' });
    }
};

// Crear un nuevo movimiento
exports.createMovimiento = async (req, res) => {
    const { articulo_id, tipo, cantidad, motivo, referencia, ubicacion_origen, ubicacion_destino, asignado_a, recibido_por, observaciones } = req.body;
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const articulo = await articuloRepository.findOne({ where: { id: articulo_id } });
        if (!articulo) {
            return res.status(400).json({ message: 'El artículo especificado no existe.' });
        }

        const usuario = await usuarioRepository.findOne({ where: { id: req.user.id } });
        if (!usuario) {
            return res.status(400).json({ message: 'El usuario que registra el movimiento no existe.' });
        }

        const stock_anterior = articulo.stock_actual;
        let stock_nuevo;

        if (tipo === 'entrada') {
            stock_nuevo = stock_anterior + cantidad;
        } else if (tipo === 'salida') {
            stock_nuevo = stock_anterior - cantidad;
            if (stock_nuevo < 0) {
                return res.status(400).json({ message: 'No hay suficiente stock para realizar la salida.' });
            }
        } else {
            stock_nuevo = stock_anterior; // Para otros tipos de movimiento, el stock no cambia
        }

        const nuevoMovimiento = movimientoRepository.create({
            articulo, usuario, tipo, cantidad, stock_anterior, stock_nuevo, motivo, referencia, ubicacion_origen, ubicacion_destino, asignado_a, recibido_por, observaciones
        });

        articulo.stock_actual = stock_nuevo;
        await articuloRepository.save(articulo);

        await movimientoRepository.save(nuevoMovimiento);
        res.status(201).json({ message: 'Movimiento creado exitosamente.', movimiento: nuevoMovimiento });
    } catch (error) {
        console.error('Error al crear movimiento:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el movimiento.' });
    }
};

// Actualizar un movimiento
exports.updateMovimiento = async (req, res) => {
    const { id } = req.params;
    const { tipo, cantidad, motivo, referencia, ubicacion_origen, ubicacion_destino, asignado_a, recibido_por, observaciones } = req.body;
    
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const articuloRepository = AppDataSource.getRepository(Articulo);

        const movimiento = await movimientoRepository.findOne({ where: { id }, relations: ['articulo'] });
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado.' });
        }

        // Validaciones básicas
        if (!tipo || !motivo) {
            return res.status(400).json({ message: 'El tipo y motivo son obligatorios.' });
        }

        if (cantidad && cantidad <= 0) {
            return res.status(400).json({ message: 'La cantidad debe ser mayor a 0.' });
        }

        // Actualizar campos
        movimiento.tipo = tipo;
        if (cantidad) movimiento.cantidad = cantidad;
        movimiento.motivo = motivo;
        movimiento.referencia = referencia || null;
        movimiento.ubicacion_origen = ubicacion_origen || null;
        movimiento.ubicacion_destino = ubicacion_destino || null;
        movimiento.asignado_a = asignado_a || null;
        movimiento.recibido_por = recibido_por || null;
        movimiento.observaciones = observaciones || null;

        await movimientoRepository.save(movimiento);
        res.status(200).json({ message: 'Movimiento actualizado exitosamente.', movimiento });
    } catch (error) {
        console.error(`Error al actualizar movimiento con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el movimiento.' });
    }
};

// Eliminar un movimiento (hard delete)
exports.deleteMovimiento = async (req, res) => {
    const { id } = req.params;
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const movimiento = await movimientoRepository.findOne({ where: { id } });
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado.' });
        }

        await movimientoRepository.remove(movimiento);
        res.status(200).json({ message: 'Movimiento eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar movimiento con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el movimiento.' });
    }
};

// Obtener movimientos por artículo
exports.getMovimientosByArticulo = async (req, res) => {
    const { articulo_id } = req.params;
    try {
        const movimientoRepository = AppDataSource.getRepository(Movimiento);
        const movimientos = await movimientoRepository.find({ 
            where: { articulo: { id: articulo_id } },
            relations: ['articulo', 'usuario'],
            order: { fecha_creacion: 'DESC' }
        });
        res.status(200).json(movimientos);
    } catch (error) {
        console.error(`Error al obtener movimientos del artículo ${articulo_id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los movimientos.' });
    }
};
