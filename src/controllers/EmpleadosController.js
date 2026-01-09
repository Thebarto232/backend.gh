import { pool } from "../utils/db.js";

// ======================================================
// 1. GESTIÓN DE EMPLEADOS (CRUD)
// ======================================================

// GET: Listar todos los empleados
export const getEmpleados = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.id_cedula, 
                e.apellidos_nombre, 
                e.email_personal, 
                e.celular, 
                e.estado,
                e.fecha_ingreso,
                a.nombre_area, 
                p.nombre_profesion as cargo
            FROM empleado e
            LEFT JOIN area a ON e.fk_id_area = a.id_area
            LEFT JOIN profesion p ON e.fk_id_profesion = p.id_profesion
            ORDER BY e.apellidos_nombre ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows || []);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener un empleado por ID
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

// POST: Crear empleado
export const createEmpleado = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_cedula || !data.apellidos_nombre) {
            return res.status(400).json({ error: "Cédula y Nombre son obligatorios" });
        }

        const query = `
            INSERT INTO empleado (
                id_cedula, apellidos_nombre, 
                fecha_nacimiento, lugar_expedicion, fecha_expedicion,
                direccion_residencia, barrio_residencia, ciudad_residencia,
                telefono, celular, email_personal,
                sexo, rh, tiene_hijos,
                fecha_ingreso, estado,
                fk_id_tipo_doc, fk_id_depto, fk_id_area, fk_id_perfil, 
                fk_id_eps, fk_id_pension, fk_id_nivel, fk_id_profesion,
                contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_parentesco
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;

        const values = [
            data.id_cedula, 
            data.apellidos_nombre,
            data.fecha_nacimiento || null,
            data.lugar_expedicion || null,
            data.fecha_expedicion || null,
            data.direccion_residencia || null,
            data.barrio_residencia || null,
            data.ciudad_residencia || null,
            data.telefono || null,
            data.celular || null,
            data.email_personal || null,
            data.sexo || 'PENDIENTE',
            data.rh || null,
            data.tiene_hijos || 'NO',
            data.fecha_ingreso || null,
            'ACTIVO', 
            data.fk_id_tipo_doc || null,
            data.fk_id_depto || null,
            data.fk_id_area || null,
            data.fk_id_perfil || null,
            data.fk_id_eps || null,
            data.fk_id_pension || null,
            data.fk_id_nivel || null,
            data.fk_id_profesion || null,
            data.contacto_emergencia_nombre || null,
            data.contacto_emergencia_telefono || null,
            data.contacto_emergencia_parentesco || null
        ];

        await pool.query(query, values);
        res.status(201).json({ message: "Empleado creado correctamente", id: data.id_cedula });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Ya existe un empleado con esa cédula" });
        }
        res.status(500).json({ error: error.message });
    }
};

// PUT: Actualizar empleado
export const updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const fields = Object.keys(data).filter(key => key !== 'id_cedula'); 
        if (fields.length === 0) return res.status(400).json({ error: "No hay datos para actualizar" });

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => data[field]);
        values.push(id);

        const [result] = await pool.query(`UPDATE empleado SET ${setClause} WHERE id_cedula = ?`, values);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: "Empleado no encontrado" });

        res.json({ message: "Empleado actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar empleado
export const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM empleado WHERE id_cedula = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Empleado no encontrado" });
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
        const hijos = rows.map(h => ({
            id: h.id_hijo,
            nombre_hijo: h.nombre_completo,
            fecha: h.fecha_nacimiento,
            genero: 'PENDIENTE' 
        }));
        res.json(hijos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createHijo = async (req, res) => {
    const { nombre_hijo, fecha_nacimiento, fk_id_cedula_padre } = req.body;
    try {
        await pool.query(
            "INSERT INTO hijo_empleado (nombre_completo, fecha_nacimiento, fk_empleado) VALUES (?, ?, ?)",
            [nombre_hijo, fecha_nacimiento, fk_id_cedula_padre]
        );
        res.status(201).json({ message: "Hijo registrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================================================
// 3. GESTIÓN DE EVENTOS (Citas)
// ======================================================

export const getCitas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM evento ORDER BY fecha_inicio DESC");
        res.json(rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCita = async (req, res) => {
    try {
        const { titulo, fecha_inicio, fecha_fin, fk_id_cedula_empleado } = req.body;
        const [result] = await pool.query(
            "INSERT INTO evento (titulo, fecha_inicio, fecha_fin, tipo, fk_empleado) VALUES (?, ?, ?, 'OTRO', ?)",
            [titulo, fecha_inicio, fecha_fin, fk_id_cedula_empleado || null]
        );
        res.status(201).json({ id: result.insertId, message: "Evento creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCita = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM evento WHERE id_evento = ?", [id]);
        res.json({ message: "Evento eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};