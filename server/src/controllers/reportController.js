const AppDataSource = require('../config/database');
const Articulo = require('../entities/Articulo');
const Movimiento = require('../entities/Movimiento');
const Categoria = require('../entities/Categoria');
const Equipo = require('../entities/Equipo');
const HistorialMantenimiento = require('../entities/HistorialMantenimiento');
const Area = require('../entities/Area');
const Usuario = require('../entities/Usuario');
const ExcelJS = require('exceljs');
const { LessThanOrEqual, MoreThanOrEqual, In } = require('typeorm');

// --- Endpoint Principal: Reporte Completo ---
exports.generateComprehensiveReport = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SistemaDeInventario';
    workbook.created = new Date();

    try {
        await createInventoryStatsSheet(workbook, 'Estadísticas de Inventario');
        await createStockAlertsSheet(workbook, 'Alertas de Stock');
        await createRecentMovementsSheet(workbook, 'Movimientos Recientes');
        await createEquiposSheet(workbook, 'Equipos');
        await createArticulosSheet(workbook, 'Inventario General');
        await createMaintenanceHistorySheet(workbook, 'Mantenimientos');
        await createCategoriesSheet(workbook, 'Categorías');
        await createAreasSheet(workbook, 'Áreas');
        await createUsersSheet(workbook, 'Usuarios');

        sendWorkbook(res, workbook, 'reporte_completo_inventario.xlsx');
    } catch (error) {
        handleError(res, error, 'generar el reporte completo');
    }
};

// --- Endpoints para Reportes Individuales (Mejorados con detalles) ---

exports.generateDashboardReportExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createDashboardSheet(workbook, 'Resumen Dashboard');
        await createStockAlertsSheet(workbook, 'Detalle Alertas Stock');
        await createActiveMaintenanceSheet(workbook, 'Detalle Mantenimientos Activos');
        sendWorkbook(res, workbook, 'reporte_dashboard_detallado.xlsx');
    } catch (error) {
        handleError(res, error, 'generar el reporte del dashboard');
    }
};

exports.generateInventoryStatsReportExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createInventoryStatsSheet(workbook, 'Resumen Estadísticas');
        await createStockAlertsSheet(workbook, 'Detalle Stock Bajo');
        await createEquipmentByStatusSheet(workbook, 'Detalle Equipos en Mantenimiento', ['mantenimiento']);
        await createEquipmentByStatusSheet(workbook, 'Detalle Equipos Retirados', ['retirado']);
        sendWorkbook(res, workbook, 'reporte_estadisticas_detallado.xlsx');
    } catch (error) {
        handleError(res, error, 'generar el reporte de estadísticas');
    }
};

exports.generateRecentMovementsReportExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createRecentMovementsSheet(workbook, 'Movimientos Recientes');
        sendWorkbook(res, workbook, 'reporte_movimientos.xlsx');
    } catch (error) {
        handleError(res, error, 'generar el reporte de movimientos');
    }
};

exports.generateStockAlertsReportExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createStockAlertsSheet(workbook, 'Alertas de Stock');
        sendWorkbook(res, workbook, 'reporte_alertas_stock.xlsx');
    } catch (error) {
        handleError(res, error, 'generar el reporte de alertas de stock');
    }
};

exports.generateTopCategoriesReportExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createTopCategoriesSheet(workbook, 'Categorías Principales');
        sendWorkbook(res, workbook, 'reporte_categorias.xlsx');
    } catch (error) {
        handleError(res, error, 'generar el reporte de categorías');
    }
};

// --- Endpoints para Exportación Directa ---

exports.generateUsersExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createUsersSheet(workbook, 'Usuarios');
        sendWorkbook(res, workbook, 'export_usuarios.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar la lista de usuarios');
    }
};

exports.generateArticulosExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createArticulosSheet(workbook, 'Articulos');
        sendWorkbook(res, workbook, 'export_articulos.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar la lista de articulos');
    }
};

exports.generateEquiposExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createEquiposSheet(workbook, 'Equipos');
        sendWorkbook(res, workbook, 'export_equipos.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar la lista de equipos');
    }
};

exports.generateAreasExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createAreasSheet(workbook, 'Áreas');
        sendWorkbook(res, workbook, 'export_areas.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar la lista de áreas');
    }
};

exports.generateCategoriasExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createCategoriesSheet(workbook, 'Categorías');
        sendWorkbook(res, workbook, 'export_categorias.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar la lista de categorías');
    }
};

exports.generateMantenimientosExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createMaintenanceHistorySheet(workbook, 'Mantenimientos');
        sendWorkbook(res, workbook, 'export_mantenimientos.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar el historial de mantenimientos');
    }
};

exports.generateMovimientosExcel = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    try {
        await createRecentMovementsSheet(workbook, 'Movimientos');
        sendWorkbook(res, workbook, 'export_movimientos.xlsx');
    } catch (error) {
        handleError(res, error, 'exportar la lista de movimientos');
    }
};


// --- Funciones auxiliares para construir cada hoja ---

// Hoja de Resumen del Dashboard
async function createDashboardSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    // ... (código idéntico a la versión anterior)
}

// Hoja de Resumen de Estadísticas
async function createInventoryStatsSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    // ... (código idéntico a la versión anterior)
}

// Hoja con el detalle de Alertas de Stock
async function createStockAlertsSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const articuloRepo = AppDataSource.getRepository(Articulo);
    const stockAlerts = await articuloRepo.createQueryBuilder("articulo")
        .where("articulo.stock_actual <= articulo.stock_minimo")
        .getMany();

    sheet.columns = [
        { header: 'Código', key: 'codigo', width: 20 },
        { header: 'Nombre', key: 'nombre', width: 40 },
        { header: 'Stock Actual', key: 'stock_actual', width: 15 },
        { header: 'Stock Mínimo', key: 'stock_minimo', width: 15 },
    ];
    stockAlerts.forEach(item => sheet.addRow(item));
}

// Hoja con el detalle de Mantenimientos Activos
async function createActiveMaintenanceSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const mantRepo = AppDataSource.getRepository(HistorialMantenimiento);
    const mantenimientos = await mantRepo.find({ 
        where: { estado: 'en_progreso' },
        relations: ['equipo', 'tecnico'] 
    });

    sheet.columns = [
        { header: 'Equipo', key: 'equipo', width: 40 },
        { header: 'Fecha Inicio', key: 'inicio', width: 20 },
        { header: 'Técnico Asignado', key: 'tecnico', width: 30 },
        { header: 'Problema Reportado', key: 'problema', width: 50 },
    ];

    mantenimientos.forEach(mant => {
        sheet.addRow({
            equipo: `${mant.equipo.marca} ${mant.equipo.modelo} (S/N: ${mant.equipo.numero_serie})`,
            inicio: mant.fecha_inicio.toLocaleString(),
            tecnico: mant.tecnico ? mant.tecnico.nombre_completo : 'No asignado',
            problema: mant.descripcion_problema,
        });
    });
}

// Hoja genérica para listar equipos por estado
async function createEquipmentByStatusSheet(workbook, sheetName, statuses) {
    const sheet = workbook.addWorksheet(sheetName);
    const equipoRepo = AppDataSource.getRepository(Equipo);
    const equipos = await equipoRepo.find({ 
        where: { estado: In(statuses) },
        relations: ['ubicacion_actual', 'asignado_a']
    });

    sheet.columns = [
        { header: 'Código Inventario', key: 'codigo', width: 20 },
        { header: 'Marca', key: 'marca', width: 20 },
        { header: 'Modelo', key: 'modelo', width: 25 },
        { header: 'N/S', key: 'serie', width: 30 },
        { header: 'Ubicación', key: 'ubicacion', width: 30 },
    ];

    equipos.forEach(eq => {
        sheet.addRow({
            codigo: eq.codigo_inventario,
            marca: eq.marca,
            modelo: eq.modelo,
            serie: eq.numero_serie,
            ubicacion: eq.ubicacion_actual ? eq.ubicacion_actual.nombre : 'N/A',
        });
    });
}

// El resto de funciones para crear hojas (createRecentMovementsSheet, createEquiposSheet, etc.)
// permanecen igual que en la versión anterior, ya que ya generan listas detalladas.

// ... (pegar aquí el resto de las funciones de creación de hojas: createDashboardSheet, createInventoryStatsSheet, createTopCategoriesSheet, createRecentMovementsSheet, createEquiposSheet, createArticulosSheet, createMaintenanceHistorySheet, createCategoriesSheet, createAreasSheet, createUsersSheet)

// --- Funciones de utilidad ---

async function sendWorkbook(res, workbook, fileName) {
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
    );
    await workbook.xlsx.write(res);
    res.end();
}

function handleError(res, error, context) {
    console.error(`Error al ${context}:`, error);
    res.status(500).json({ message: `Error interno del servidor al ${context}.` });
}


// --- Implementación completa de las funciones de hojas que no cambian ---

async function createDashboardSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const articuloRepo = AppDataSource.getRepository(Articulo);
    const equipoRepo = AppDataSource.getRepository(Equipo);
    const movimientoRepo = AppDataSource.getRepository(Movimiento);
    const mantenimientoRepo = AppDataSource.getRepository(HistorialMantenimiento);

    sheet.columns = [
        { header: 'Sección', key: 'section', width: 25 },
        { header: 'Métrica', key: 'metric', width: 40 },
        { header: 'Valor', key: 'value', width: 15 },
    ];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = [
        { section: 'RESUMEN GENERAL', metric: 'Total Artículos', value: await articuloRepo.count() },
        { section: 'RESUMEN GENERAL', metric: 'Total Equipos', value: await equipoRepo.count() },
        { section: 'RESUMEN GENERAL', metric: 'Movimientos Hoy', value: await movimientoRepo.count({ where: { fecha_creacion: MoreThanOrEqual(today) } }) },
        { section: 'ESTADO ARTÍCULOS', metric: 'Disponibles', value: await articuloRepo.count({ where: { estado: 'disponible' } }) },
        { section: 'ESTADO ARTÍCULOS', metric: 'En Uso', value: await articuloRepo.count({ where: { estado: 'en_uso' } }) },
        { section: 'ALERTAS', metric: 'Stock Bajo', value: await articuloRepo.count({ where: { stock_actual: LessThanOrEqual(5) } }) },
        { section: 'ALERTAS', metric: 'Sin Stock', value: await articuloRepo.count({ where: { stock_actual: 0 } }) },
        { section: 'MANTENIMIENTO', metric: 'Mantenimientos Activos', value: await mantenimientoRepo.count({ where: { estado: 'en_progreso' } }) },
    ];

    stats.forEach(stat => sheet.addRow(stat));
}

async function createInventoryStatsSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const articuloRepo = AppDataSource.getRepository(Articulo);
    const equipoRepo = AppDataSource.getRepository(Equipo);

    sheet.columns = [
        { header: 'Métrica', key: 'metric', width: 40 },
        { header: 'Valor', key: 'value', width: 20 },
    ];

    const stats = [
        { metric: 'Total de Tipos de Artículos', value: await articuloRepo.count() },
        { metric: 'Artículos con Stock Bajo (<= 5)', value: await articuloRepo.count({ where: { stock_actual: LessThanOrEqual(5) } }) },
        { metric: 'Artículos sin Stock', value: await articuloRepo.count({ where: { stock_actual: 0 } }) },
        { metric: 'Total de Equipos Registrados', value: await equipoRepo.count() },
        { metric: 'Equipos Activos', value: await equipoRepo.count({ where: { estado: 'activo' } }) },
        { metric: 'Equipos en Mantenimiento', value: await equipoRepo.count({ where: { estado: 'mantenimiento' } }) },
        { metric: 'Equipos Retirados', value: await equipoRepo.count({ where: { estado: 'retirado' } }) },
    ];

    stats.forEach(stat => sheet.addRow(stat));
}

async function createTopCategoriesSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const categoriaRepo = AppDataSource.getRepository(Categoria);
    const articuloRepo = AppDataSource.getRepository(Articulo);

    const categorias = await categoriaRepo.find({ order: { nombre: 'ASC' } });
    const categoriasConStats = await Promise.all(
        categorias.map(async (cat) => {
            const totalArticulos = await articuloRepo.count({ where: { categoria: { id: cat.id } } });
            return { ...cat, totalArticulos };
        })
    );

    const topCategorias = categoriasConStats
        .sort((a, b) => b.totalArticulos - a.totalArticulos)
        .slice(0, 10); // Top 10

    sheet.columns = [
        { header: 'Categoría', key: 'nombre', width: 30 },
        { header: 'Total de Artículos', key: 'total', width: 20 },
    ];

    topCategorias.forEach(cat => {
        sheet.addRow({ nombre: cat.nombre, total: cat.totalArticulos });
    });
}

async function createRecentMovementsSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const movimientoRepo = AppDataSource.getRepository(Movimiento);
    const movements = await movimientoRepo.find({
        relations: ['articulo', 'usuario'],
        order: { fecha_creacion: 'DESC' },
        take: 100,
    });

    sheet.columns = [
        { header: 'Fecha', key: 'fecha', width: 20 },
        { header: 'Artículo', key: 'articulo', width: 40 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Cantidad', key: 'cantidad', width: 10 },
        { header: 'Usuario', key: 'usuario', width: 30 },
        { header: 'Motivo', key: 'motivo', width: 50 },
    ];

    movements.forEach(mov => {
        sheet.addRow({
            fecha: mov.fecha_creacion.toLocaleString(),
            articulo: mov.articulo.nombre,
            tipo: mov.tipo,
            cantidad: mov.cantidad,
            usuario: mov.usuario.nombre_completo,
            motivo: mov.motivo,
        });
    });
}

async function createEquiposSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const equipos = await AppDataSource.getRepository(Equipo).find({ relations: ['ubicacion_actual', 'asignado_a'] });

    sheet.columns = [
        { header: 'Código Inventario', key: 'codigo', width: 20 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Marca', key: 'marca', width: 20 },
        { header: 'Modelo', key: 'modelo', width: 25 },
        { header: 'N/S', key: 'serie', width: 30 },
        { header: 'Estado', key: 'estado', width: 15 },
        { header: 'Ubicación', key: 'ubicacion', width: 30 },
        { header: 'Asignado a', key: 'asignado', width: 30 },
    ];

    equipos.forEach(eq => {
        sheet.addRow({
            codigo: eq.codigo_inventario,
            tipo: eq.tipo,
            marca: eq.marca,
            modelo: eq.modelo,
            serie: eq.numero_serie,
            estado: eq.estado,
            ubicacion: eq.ubicacion_actual ? eq.ubicacion_actual.nombre : 'N/A',
            asignado: eq.asignado_a ? eq.asignado_a.nombre_completo : 'No asignado',
        });
    });
}

async function createArticulosSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const articulos = await AppDataSource.getRepository(Articulo).find({ relations: ['categoria'] });

    sheet.columns = [
        { header: 'Código', key: 'codigo', width: 20 },
        { header: 'Nombre', key: 'nombre', width: 40 },
        { header: 'Categoría', key: 'categoria', width: 25 },
        { header: 'Stock Actual', key: 'stock', width: 15 },
        { header: 'Ubicación', key: 'ubicacion', width: 30 },
        { header: 'Estado', key: 'estado', width: 15 },
    ];

    articulos.forEach(item => {
        sheet.addRow({
            codigo: item.codigo,
            nombre: item.nombre,
            categoria: item.categoria.nombre,
            stock: item.stock_actual,
            ubicacion: item.ubicacion,
            estado: item.estado,
        });
    });
}

async function createMaintenanceHistorySheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const mantenimientos = await AppDataSource.getRepository(HistorialMantenimiento).find({ relations: ['equipo', 'reportado_por', 'tecnico'] });

    sheet.columns = [
        { header: 'Equipo', key: 'equipo', width: 30 },
        { header: 'Fecha Inicio', key: 'inicio', width: 20 },
        { header: 'Fecha Fin', key: 'fin', width: 20 },
        { header: 'Estado', key: 'estado', width: 15 },
        { header: 'Técnico', key: 'tecnico', width: 30 },
        { header: 'Problema', key: 'problema', width: 50 },
    ];

    mantenimientos.forEach(mant => {
        sheet.addRow({
            equipo: `${mant.equipo.marca} ${mant.equipo.modelo} (S/N: ${mant.equipo.numero_serie})`,
            inicio: mant.fecha_inicio.toLocaleString(),
            fin: mant.fecha_fin ? mant.fecha_fin.toLocaleString() : 'Pendiente',
            estado: mant.estado,
            tecnico: mant.tecnico ? mant.tecnico.nombre_completo : 'No asignado',
            problema: mant.descripcion_problema,
        });
    });
}

async function createCategoriesSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const categorias = await AppDataSource.getRepository(Categoria).find();

    sheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Descripción', key: 'descripcion', width: 60 },
        { header: 'Estado', key: 'estado', width: 15 },
    ];

    categorias.forEach(cat => {
        sheet.addRow({
            nombre: cat.nombre,
            descripcion: cat.descripcion,
            estado: cat.esta_activa ? 'Activa' : 'Inactiva',
        });
    });
}

async function createAreasSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const areas = await AppDataSource.getRepository(Area).find({ relations: ['responsable'] });

    sheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Código', key: 'codigo', width: 15 },
        { header: 'Responsable', key: 'responsable', width: 30 },
        { header: 'Estado', key: 'estado', width: 15 },
    ];

    areas.forEach(area => {
        sheet.addRow({
            nombre: area.nombre,
            codigo: area.codigo || 'N/A',
            responsable: area.responsable ? area.responsable.nombre_completo : 'No asignado',
            estado: area.esta_activa ? 'Activa' : 'Inactiva',
        });
    });
}

async function createUsersSheet(workbook, sheetName) {
    const sheet = workbook.addWorksheet(sheetName);
    const usuarios = await AppDataSource.getRepository(Usuario).find({ relations: ['rol'] });

    sheet.columns = [
        { header: 'Nombre de Usuario', key: 'username', width: 25 },
        { header: 'Nombre Completo', key: 'fullname', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Rol', key: 'rol', width: 20 },
        { header: 'Departamento', key: 'departamento', width: 25 },
        { header: 'Estado', key: 'estado', width: 15 },
    ];

    usuarios.forEach(user => {
        sheet.addRow({
            username: user.nombre_usuario,
            fullname: user.nombre_completo,
            email: user.email,
            rol: user.rol ? user.rol.nombre : 'Sin rol',
            departamento: user.departamento,
            estado: user.esta_activo ? 'Activo' : 'Inactivo',
        });
    });
}