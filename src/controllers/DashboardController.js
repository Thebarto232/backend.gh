import { pool } from "../utils/db.js";

// 1. ESTADÍSTICAS (KPIs)
export const getStatsSummary = async (req, res) => {
    try {
        const [empTotal] = await pool.query("SELECT COUNT(*) as total FROM empleado");
        const [empActivos] = await pool.query("SELECT COUNT(*) as total FROM empleado WHERE estado = 'ACTIVO'");
        const [hijosTotal] = await pool.query("SELECT COUNT(*) as total FROM hijo_empleado");
        const [deptoTotal] = await pool.query("SELECT COUNT(*) as total FROM departamento");

        res.json({
            totalEmpleados: empTotal[0].total,
            activos: empActivos[0].total,
            hijos: hijosTotal[0].total,
            departamentos: deptoTotal[0].total
        });
    } catch (error) {
        console.error("Error dashboard:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// 2. CALENDARIO
export const getCalendarEvents = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear(); 

        // Eventos Manuales
        const [eventosManuales] = await pool.query(`
            SELECT id_evento as id, titulo as title, fecha_inicio as start, fecha_fin as end, 
            CASE 
                WHEN tipo = 'CUMPLEANOS' THEN 'CUMPLE'
                WHEN tipo = 'ANIVERSARIO' THEN 'ANIVERSARIO'
                ELSE 'CITA'
            END as tipo
            FROM evento
        `);

        // Cumpleaños
        const [cumples] = await pool.query(`
            SELECT CONCAT('bday_', id_cedula) as id, CONCAT('🎂 ', apellidos_nombre) as title, 
            CONCAT(?, DATE_FORMAT(fecha_nacimiento, '-%m-%d 08:00:00')) as start,
            CONCAT(?, DATE_FORMAT(fecha_nacimiento, '-%m-%d 18:00:00')) as end,
            'CUMPLE' as tipo
            FROM empleado WHERE estado = 'ACTIVO'
        `, [currentYear, currentYear]);

        // Aniversarios
        const [aniversarios] = await pool.query(`
            SELECT CONCAT('aniv_', id_cedula) as id, CONCAT('🎖️ ', apellidos_nombre) as title, 
            CONCAT(?, DATE_FORMAT(fecha_ingreso, '-%m-%d 08:00:00')) as start,
            CONCAT(?, DATE_FORMAT(fecha_ingreso, '-%m-%d 18:00:00')) as end,
            'ANIVERSARIO' as tipo
            FROM empleado WHERE estado = 'ACTIVO'
        `, [currentYear, currentYear]);

        res.json([...eventosManuales, ...cumples, ...aniversarios]);
    } catch (error) {
        res.status(500).json({ message: "Error eventos", error: error.message });
    }
};

// 3. CATÁLOGOS
export const getCatalogos = async (req, res) => {
    const { tipo } = req.params;
    const consultas = {
        'eps': "SELECT id_eps as id, nombre_eps as nombre FROM eps ORDER BY nombre_eps",
        'pensiones': "SELECT id_pension as id, nombre_pension as nombre FROM fondo_pensiones ORDER BY nombre_pension",
        'departamentos': "SELECT id_depto as id, nombre_depto as nombre FROM departamento ORDER BY nombre_depto",
        'areas': "SELECT id_area as id, nombre_area as nombre FROM area ORDER BY nombre_area",
        'perfiles': "SELECT id_perfil as id, nombre_perfil as nombre FROM perfil_ocupacional ORDER BY nombre_perfil",
        'niveles': "SELECT id_nivel as id, nombre_nivel as nombre FROM nivel_educativo ORDER BY nombre_nivel",
        'profesiones': "SELECT id_profesion as id, nombre_profesion as nombre FROM profesion ORDER BY nombre_profesion",
        'roles': "SELECT id_rol as id, nombre_rol as nombre FROM rol ORDER BY nombre_rol"
    };

    const query = consultas[tipo];
    if (!query) return res.status(400).json({ error: "Catálogo no encontrado" });

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. CREAR EVENTO
export const crearEvento = async (req, res) => {
    const { titulo, fecha_inicio, fecha_fin, tipo, fk_empleado } = req.body;
    try {
        const sql = `INSERT INTO evento (titulo, fecha_inicio, fecha_fin, tipo, fk_empleado) VALUES (?, ?, ?, ?, ?)`;
        const tipoEvento = tipo || 'OTRO';
        await pool.query(sql, [titulo, fecha_inicio, fecha_fin, tipoEvento, fk_empleado || null]);
        res.status(201).json({ message: "Evento creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. CUMPLEAÑOS MES (Lista Lateral)
export const getBirthdaysMonth = async (req, res) => {
    try {
        const query = `
            SELECT e.apellidos_nombre, DATE_FORMAT(e.fecha_nacimiento, '%d') as dia, a.nombre_area
            FROM empleado e
            LEFT JOIN area a ON e.fk_id_area = a.id_area
            WHERE MONTH(e.fecha_nacimiento) = MONTH(CURRENT_DATE())
            AND e.estado = 'ACTIVO'
            ORDER BY DAY(e.fecha_nacimiento) ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};