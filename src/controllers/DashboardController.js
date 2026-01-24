import { pool } from "../utils/db.js";

// =========================================================
// 1. ESTADÍSTICAS (KPIs)
// =========================================================
export const getStatsSummary = async (req, res) => {
    try {
        const [emp] = await pool.query("SELECT COUNT(*) as t FROM empleado");
        const [act] = await pool.query("SELECT COUNT(*) as t FROM empleado WHERE estado_empleado = 'ACTIVO'");
        
        // Contamos hijos desde la tabla nueva 'hijo_empleado'
        const [hij] = await pool.query("SELECT COUNT(*) as t FROM hijo_empleado");
        
        // Tabla correcta: 'departamento_empresa'
        const [dep] = await pool.query("SELECT COUNT(*) as t FROM departamento_empresa");

        res.json({
            totalEmpleados: Number(emp[0]?.t) || 0,
            activos: Number(act[0]?.t) || 0,
            hijos: Number(hij[0]?.t) || 0,
            departamentos: Number(dep[0]?.t) || 0
        });
    } catch (error) {
        console.error("Error KPIs:", error);
        res.status(500).json({ totalEmpleados: 0, activos: 0, hijos: 0, departamentos: 0 });
    }
};

// =========================================================
// 2. CALENDARIO (Citas + Cumpleaños)
// =========================================================
export const getCalendarEvents = async (req, res) => {
    try {
        // A. Citas (Tabla 'cita')
        const [citas] = await pool.query(`
            SELECT 
                id_cita as id, 
                titulo as title, 
                DATE_FORMAT(fecha_inicio, '%Y-%m-%dT%H:%i:%s') as start, 
                DATE_FORMAT(fecha_fin, '%Y-%m-%dT%H:%i:%s') as end, 
                'CITA' as tipo 
            FROM cita
        `);
        
        // B. Cumpleaños (Tabla 'empleado')
        const year = new Date().getFullYear();
        const [cumples] = await pool.query(`
            SELECT 
                CONCAT('bday_', id_cedula) as id, 
                CONCAT('🎂 ', apellidos_nombre) as title, 
                CONCAT(?, DATE_FORMAT(fecha_nacimiento, '-%m-%dT08:00:00')) as start, 
                'CUMPLE' as tipo 
            FROM empleado 
            WHERE estado_empleado = 'ACTIVO'`, 
            [year]
        );

        res.json([...citas, ...cumples]);
    } catch (error) {
        console.error("Error Calendario:", error);
        res.status(500).json([]);
    }
};

// =========================================================
// 3. CREAR EVENTO (Tabla 'cita')
// =========================================================
export const crearEvento = async (req, res) => {
    const { title, start, end } = req.body;
    try {
        // fk_id_usuario_creador = 1 (Temporal mientras implementas auth real)
        await pool.query(
            "INSERT INTO cita (titulo, fecha_inicio, fecha_fin, fk_id_usuario_creador) VALUES (?, ?, ?, 1)",
            [title, start, end]
        );
        res.status(201).json({ message: "Evento creado" });
    } catch (error) {
        console.error("Error crear evento:", error);
        res.status(500).json({ error: "No se pudo guardar" });
    }
};

// =========================================================
// 4. CUMPLEAÑOS DEL MES
// =========================================================
export const getBirthdaysMonth = async (req, res) => {
     try {
        const query = `
            SELECT 
                e.apellidos_nombre, 
                DATE_FORMAT(e.fecha_nacimiento, '%d') as dia, 
                d.nombre_depto as nombre_area
            FROM empleado e
            LEFT JOIN departamento_empresa d ON e.fk_id_depto = d.id_depto
            WHERE MONTH(e.fecha_nacimiento) = MONTH(CURRENT_DATE())
            AND e.estado_empleado = 'ACTIVO'
            ORDER BY DAY(e.fecha_nacimiento) ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) { 
        res.status(500).json([]); 
    }
};

// =========================================================
// 5. CATÁLOGOS GENÉRICOS (Para Selects)
// =========================================================
export const getCatalogos = async (req, res) => {
    try {
        const { tipo } = req.params;
        let q = "";

        switch(tipo) {
            case 'eps': q = "SELECT id_eps as id, nombre_eps as nombre FROM eps"; break;
            case 'pensiones': q = "SELECT id_pension as id, nombre_pension as nombre FROM fondo_pensiones"; break;
            case 'departamentos': q = "SELECT id_depto as id, nombre_depto as nombre FROM departamento_empresa"; break;
            case 'cargos': q = "SELECT id_cargo as id, nombre_cargo as nombre FROM cargo"; break;
            case 'areas': q = "SELECT id_area as id, nombre_area as nombre FROM area"; break;
            case 'profesiones': q = "SELECT id_profesion as id, nombre_profesion as nombre FROM profesion"; break;
            default: return res.json([]);
        }

        const [rows] = await pool.query(q);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};