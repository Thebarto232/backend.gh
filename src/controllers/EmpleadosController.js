import * as EmpleadoService from "../services/EmpleadoService.js"; // Ajusta ruta si es necesario
import { pool } from "../utils/db.js"; // Para consultas directas simples como Hijos

// CRUD EMPLEADOS
export const getEmpleados = async (req, res) => {
    try {
        const empleados = await EmpleadoService.getAll();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEmpleado = async (req, res) => {
    try {
        await EmpleadoService.create(req.body);
        res.status(201).json({ message: "Empleado creado exitosamente" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') res.status(400).json({ error: "La cédula ya existe" });
        else res.status(500).json({ error: error.message });
    }
};

export const getEmpleadoById = async (req, res) => {
    // Implementación rápida directa
    try {
        const [rows] = await pool.query("SELECT * FROM empleado WHERE id_cedula = ?", [req.params.id]);
        if(rows.length === 0) return res.status(404).json({error: "No encontrado"});
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateEmpleado = async (req, res) => {
    try {
        const result = await EmpleadoService.update(req.params.id, req.body);
        if (result && result.affectedRows > 0) res.json({ message: "Actualizado" });
        else res.status(404).json({ error: "No encontrado o sin cambios" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteEmpleado = async (req, res) => {
    try {
        await EmpleadoService.remove(req.params.id);
        res.json({ message: "Eliminado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// GESTIÓN DE HIJOS (Directa en controlador para simplicidad)
export const getHijosByEmpleado = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM hijo_empleado WHERE fk_empleado_cedula = ?", [req.params.cedula]);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createHijo = async (req, res) => {
    const { nombre_completo, fecha_nacimiento, genero, fk_empleado_cedula } = req.body;
    try {
        await pool.query(
            "INSERT INTO hijo_empleado (nombre_completo, fecha_nacimiento, genero, fk_empleado_cedula) VALUES (?, ?, ?, ?)",
            [nombre_completo, fecha_nacimiento, genero, fk_empleado_cedula]
        );
        res.status(201).json({ message: "Hijo registrado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

// REPORTES
export const getReporteSeguridadSocial = async (req, res) => {
    try {
        const query = `
            SELECT e.id_cedula, e.apellidos_nombre, 
                   COALESCE(eps.nombre_eps, 'NO REGISTRA') as nombre_eps, 
                   COALESCE(fp.nombre_pension, 'NO REGISTRA') as nombre_pension
            FROM empleado e
            LEFT JOIN eps ON e.fk_id_eps = eps.id_eps
            LEFT JOIN fondo_pensiones fp ON e.fk_id_pension = fp.id_pension 
            WHERE e.estado_empleado = 'ACTIVO'
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
};