import { pool } from "../utils/db.js";

// ======================================================
// 1. GESTIÓN DE EMPLEADOS (CRUD)
// ======================================================

// GET: Listar todos
export const getEmpleados = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id_cedula, e.apellidos_nombre, e.email_personal, e.celular, 
                e.estado, e.fecha_ingreso, a.nombre_area, p.nombre_profesion as cargo
            FROM empleado e
            LEFT JOIN area a ON e.fk_id_area = a.id_area
            LEFT JOIN profesion p ON e.fk_id_profesion = p.id_profesion
            ORDER BY e.apellidos_nombre ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Por ID
export const getEmpleadoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM empleado WHERE id_cedula = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Empleado no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear
export const createEmpleado = async (req, res) => {
    try {
        const data = req.body;
        if (!data.id_cedula || !data.apellidos_nombre) return res.status(400).json({ error: "Faltan datos obligatorios" });

        const query = `
            INSERT INTO empleado (
                id_cedula, apellidos_nombre, fecha_nacimiento, lugar_expedicion, fecha_expedicion,
                direccion_residencia, barrio_residencia, ciudad_residencia, telefono, celular, email_personal,
                sexo, rh, tiene_hijos, fecha_ingreso, estado,
                fk_id_tipo_doc, fk_id_depto, fk_id_area, fk_id_perfil, 
                fk_id_eps, fk_id_pension, fk_id_nivel, fk_id_profesion,
                contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            data.id_cedula, data.apellidos_nombre, data.fecha_nacimiento, data.lugar_expedicion, data.fecha_expedicion,
            data.direccion_residencia, data.barrio_residencia, data.ciudad_residencia, data.telefono, data.celular, data.email_personal,
            data.sexo || 'PENDIENTE', data.rh, data.tiene_hijos || 'NO', data.fecha_ingreso,
            data.fk_id_tipo_doc, data.fk_id_depto, data.fk_id_area, data.fk_id_perfil,
            data.fk_id_eps, data.fk_id_pension, data.fk_id_nivel, data.fk_id_profesion,
            data.contacto_emergencia_nombre, data.contacto_emergencia_telefono, data.contacto_emergencia_parentesco
        ];

        await pool.query(query, values);
        res.status(201).json({ message: "Empleado creado", id: data.id_cedula });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') res.status(400).json({ error: "Cédula ya existe" });
        else res.status(500).json({ error: error.message });
    }
};

// PUT: Actualizar
export const updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const fields = Object.keys(data).filter(key => key !== 'id_cedula');
        if (fields.length === 0) return res.status(400).json({ error: "Nada para actualizar" });

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = [...fields.map(f => data[f]), id];

        const [result] = await pool.query(`UPDATE empleado SET ${setClause} WHERE id_cedula = ?`, values);
        if (result.affectedRows === 0) return res.status(404).json({ error: "No encontrado" });

        res.json({ message: "Actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar
export const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM empleado WHERE id_cedula = ?", [id]);
        res.json({ message: "Empleado eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================================================
// 2. GESTIÓN DE HIJOS
// ======================================================
export const getHijosByEmpleado = async (req, res) => {
    const { cedula } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM hijo_empleado WHERE fk_empleado = ?", [cedula]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createHijo = async (req, res) => {
    const { nombre_completo, fecha_nacimiento, fk_empleado } = req.body;
    try {
        await pool.query(
            "INSERT INTO hijo_empleado (nombre_completo, fecha_nacimiento, fk_empleado) VALUES (?, ?, ?)",
            [nombre_completo, fecha_nacimiento, fk_empleado]
        );
        res.status(201).json({ message: "Hijo registrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ... (tienes todo el código anterior aquí)

// ======================================================
// 3. REPORTES ESPECIALES
// ======================================================
// A. REPORTE SEGURIDAD SOCIAL (Corregido nombre de tabla)
export const getReporteSeguridadSocial = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id_cedula, 
                e.apellidos_nombre, 
                COALESCE(eps.nombre_eps, 'NO REGISTRA') as nombre_eps, 
                COALESCE(pen.nombre_pension, 'NO REGISTRA') as nombre_pension
            FROM empleado e
            LEFT JOIN eps ON e.fk_id_eps = eps.id_eps
            LEFT JOIN fondo_pensiones pen ON e.fk_id_pension = pen.id_pension 
            WHERE e.estado = 'ACTIVO'
        `;
        // Nota arriba en la línea del LEFT JOIN: cambié 'fondo_pension' por 'fondo_pensiones'
        
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error SQL Seguridad Social:", error);
        res.status(500).json({ error: "Error al generar reporte de seguridad social" });
    }
};