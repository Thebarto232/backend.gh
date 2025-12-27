import * as EmpleadoService from "../services/EmpleadoService.js";
import { pool } from "../utils/db.js"; 

// --- GESTIÓN DE EMPLEADOS ---

export const getEmpleados = async (req, res) => {
  try {
    const empleados = await EmpleadoService.getAll();
    res.json(empleados || []);
  } catch (error) {
    console.error("ERROR GET EMPLEADOS >>>", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

export const createEmpleado = async (req, res) => {
  try {
    const empleado = await EmpleadoService.create(req.body);
    res.status(201).json(empleado);
  } catch (error) {
    console.error("ERROR CREATE EMPLEADO >>>", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmpleadoService.update(id, req.body);
    res.json(result);
  } catch (error) {
    console.error("ERROR UPDATE EMPLEADO >>>", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmpleadoService.remove(id);
    res.json(result);
  } catch (error) {
    console.error("ERROR DELETE EMPLEADO >>>", error);
    res.status(500).json({ error: error.message });
  }
};

// --- GESTIÓN DE CITAS (RRHH) ---

export const getCitas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        id_cita AS id, 
        titulo AS title, 
        fecha_inicio AS start, 
        fecha_fin AS end, 
        descripcion,
        fk_id_usuario
      FROM cita`
    );
    res.json(rows || []); // Siempre devolvemos un array para evitar errores en el frontend
  } catch (error) {
    console.error("ERROR GET CITAS >>>", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createCita = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_fin, fk_id_usuario } = req.body;

    // Validación de seguridad: Asegurar que el usuario esté presente
    if (!fk_id_usuario) {
      return res.status(400).json({ error: "El ID de usuario es obligatorio para agendar" });
    }
    
    const [result] = await pool.query(
      "INSERT INTO cita (titulo, descripcion, fecha_inicio, fecha_fin, fk_id_usuario) VALUES (?, ?, ?, ?, ?)",
      [titulo, descripcion, fecha_inicio, fecha_fin, fk_id_usuario]
    );
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("ERROR CREATE CITA >>>", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM cita WHERE id_cita = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "La cita no existe" });
    }
    
    res.json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    console.error("ERROR DELETE CITA >>>", error.message);
    res.status(500).json({ error: error.message });
  }
};