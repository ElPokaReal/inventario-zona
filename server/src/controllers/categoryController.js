const AppDataSource = require('../config/database');
const Categoria = require('../entities/Categoria');

// Obtener todas las categorías
exports.getAllCategorias = async (req, res) => {
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categorias = await categoriaRepository.find({
            order: { fecha_creacion: 'DESC' }
        });
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener categorías.' });
    }
};

// Obtener una categoría por ID
exports.getCategoriaById = async (req, res) => {
    const { id } = req.params;
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categoria = await categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        console.error(`Error al obtener categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la categoría.' });
    }
};

// Crear una nueva categoría
exports.createCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);

        const existingCategoria = await categoriaRepository.findOne({ where: { nombre } });
        if (existingCategoria) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
        }

        const nuevaCategoria = categoriaRepository.create({ nombre, descripcion, esta_activa: true });
        await categoriaRepository.save(nuevaCategoria);
        res.status(201).json({ message: 'Categoría creada exitosamente.', categoria: nuevaCategoria });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la categoría.' });
    }
};

// Actualizar una categoría
exports.updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, esta_activa } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        let categoria = await categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // Verificar unicidad del nombre si se está cambiando
        if (nombre !== categoria.nombre) {
            const existingCategoria = await categoriaRepository.findOne({ where: { nombre } });
            if (existingCategoria && existingCategoria.id !== categoria.id) {
                return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
            }
        }

        categoria.nombre = nombre;
        categoria.descripcion = descripcion;
        if (esta_activa !== undefined) {
            categoria.esta_activa = esta_activa;
        }
        await categoriaRepository.save(categoria);
        res.status(200).json({ message: 'Categoría actualizada exitosamente.', categoria });
    } catch (error) {
        console.error(`Error al actualizar categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la categoría.' });
    }
};

// Eliminar una categoría (hard delete)
exports.deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const categoriaRepository = AppDataSource.getRepository(Categoria);
        const categoria = await categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        await categoriaRepository.remove(categoria);

        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error(`Error al eliminar categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la categoría.' });
    }
};