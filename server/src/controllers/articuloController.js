const AppDataSource = require('../config/database');
const Articulo = require('../entities/Articulo');
const Categoria = require('../entities/Categoria');

// Obtener todos los artículos
exports.getAllArticulos = async (req, res) => {
    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const articulos = await articuloRepository.find({ 
            relations: ['categoria'],
            order: { fecha_creacion: 'DESC' }
        });
        res.status(200).json(articulos);
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener artículos.' });
    }
};

// Obtener un artículo por ID
exports.getArticuloById = async (req, res) => {
    const { id } = req.params;
    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const articulo = await articuloRepository.findOne({ where: { id }, relations: ['categoria'] });
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }
        res.status(200).json(articulo);
    } catch (error) {
        console.error(`Error al obtener artículo con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el artículo.' });
    }
};

// Crear un nuevo artículo
exports.createArticulo = async (req, res) => {
    const { codigo, nombre, descripcion, categoria_id, numero_serie, stock_actual, stock_minimo, stock_maximo, ubicacion, estado } = req.body;

    // Validaciones básicas
    if (!codigo || codigo.trim() === '') return res.status(400).json({ message: 'El código es obligatorio.' });
    if (!nombre || nombre.trim() === '') return res.status(400).json({ message: 'El nombre es obligatorio.' });
    if (!descripcion || descripcion.trim() === '') return res.status(400).json({ message: 'La descripción es obligatoria.' });
    if (!categoria_id) return res.status(400).json({ message: 'La categoría es obligatoria.' });
    if (stock_actual === undefined || stock_actual < 0) return res.status(400).json({ message: 'El stock actual debe ser un número no negativo.' });
    if (stock_minimo === undefined || stock_minimo < 0) return res.status(400).json({ message: 'El stock mínimo debe ser un número no negativo.' });
    if (!ubicacion || ubicacion.trim() === '') return res.status(400).json({ message: 'La ubicación es obligatoria.' });

    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const categoriaRepository = AppDataSource.getRepository(Categoria);

        // Verificar si el código ya existe
        const existingArticulo = await articuloRepository.findOne({ where: { codigo } });
        if (existingArticulo) {
            return res.status(400).json({ message: 'Ya existe un artículo con ese código.' });
        }

        const categoria = await categoriaRepository.findOne({ where: { id: categoria_id } });
        if (!categoria) {
            return res.status(400).json({ message: 'La categoría especificada no existe.' });
        }

        const nuevoArticulo = articuloRepository.create({
            codigo, nombre, descripcion, categoria, numero_serie, stock_actual, stock_minimo, stock_maximo, ubicacion, estado,
            esta_activo: true // Por defecto, un nuevo artículo está activo
        });
        await articuloRepository.save(nuevoArticulo);
        res.status(201).json({ message: 'Artículo creado exitosamente.', articulo: nuevoArticulo });
    } catch (error) {
        console.error('Error al crear artículo:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el artículo.' });
    }
};

// Actualizar un artículo
exports.updateArticulo = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, descripcion, categoria_id, numero_serie, stock_actual, stock_minimo, stock_maximo, ubicacion, estado, esta_activo } = req.body;

    // Validaciones básicas
    if (!codigo || codigo.trim() === '') return res.status(400).json({ message: 'El código es obligatorio.' });
    if (!nombre || nombre.trim() === '') return res.status(400).json({ message: 'El nombre es obligatorio.' });
    if (!descripcion || descripcion.trim() === '') return res.status(400).json({ message: 'La descripción es obligatoria.' });
    if (!categoria_id) return res.status(400).json({ message: 'La categoría es obligatoria.' });
    if (stock_actual === undefined || stock_actual < 0) return res.status(400).json({ message: 'El stock actual debe ser un número no negativo.' });
    if (stock_minimo === undefined || stock_minimo < 0) return res.status(400).json({ message: 'El stock mínimo debe ser un número no negativo.' });
    if (!ubicacion || ubicacion.trim() === '') return res.status(400).json({ message: 'La ubicación es obligatoria.' });

    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const categoriaRepository = AppDataSource.getRepository(Categoria);

        let articulo = await articuloRepository.findOne({ where: { id } });
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        // Verificar unicidad del código si se está cambiando
        if (codigo !== articulo.codigo) {
            const existingArticulo = await articuloRepository.findOne({ where: { codigo } });
            if (existingArticulo && existingArticulo.id !== articulo.id) {
                return res.status(400).json({ message: 'Ya existe un artículo con ese código.' });
            }
        }

        const categoria = await categoriaRepository.findOne({ where: { id: categoria_id } });
        if (!categoria) {
            return res.status(400).json({ message: 'La categoría especificada no existe.' });
        }

        articulo.codigo = codigo;
        articulo.nombre = nombre;
        articulo.descripcion = descripcion;
        articulo.categoria = categoria;
        articulo.numero_serie = numero_serie;
        articulo.stock_actual = stock_actual;
        articulo.stock_minimo = stock_minimo;
        articulo.stock_maximo = stock_maximo;
        articulo.ubicacion = ubicacion;
        articulo.estado = estado;
        if (esta_activo !== undefined) {
            articulo.esta_activo = esta_activo;
        }

        await articuloRepository.save(articulo);
        res.status(200).json({ message: 'Artículo actualizado exitosamente.', articulo });
    } catch (error) {
        console.error(`Error al actualizar artículo con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el artículo.' });
    }
};

// Eliminar un artículo (hard delete)
exports.deleteArticulo = async (req, res) => {
    const { id } = req.params;
    try {
        const articuloRepository = AppDataSource.getRepository(Articulo);
        const articulo = await articuloRepository.findOne({ where: { id } });
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado.' });
        }

        await articuloRepository.remove(articulo);

        res.status(200).json({ message: 'Artículo eliminado exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar artículo con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el artículo.' });
    }
};