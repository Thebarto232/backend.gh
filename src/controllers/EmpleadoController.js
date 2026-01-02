import * as EmpleadoService from "../services/EmpleadoService.js";
import { pool } from "../utils/db.js"; 

// --- GESTIÓN DE EMPLEADOS ---
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await EmpleadoService.getAll();
    res.json(empleados || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEmpleado = async (req, res) => {
  try {
    const empleado = await EmpleadoService.create(req.body);
    res.status(201).json(empleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmpleadoService.update(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmpleadoService.remove(id);
    res.json(result);
  } catch (error) {
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
        fk_id_usuario_creador -- CORREGIDO según tu DB
      FROM cita`
    );
    res.json(rows || []);
  } catch (error) {
    console.error("ERROR GET CITAS >>>", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createCita = async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_fin, fk_id_usuario_creador, fk_id_cedula_empleado } = req.body;
    
    const [result] = await pool.query(
      "INSERT INTO cita (titulo, descripcion, fecha_inicio, fecha_fin, fk_id_cedula_empleado, fk_id_usuario_creador) VALUES (?, ?, ?, ?, ?, ?)",
      [titulo, descripcion, fecha_inicio, fecha_fin, fk_id_cedula_empleado, fk_id_usuario_creador]
    );
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cita WHERE id_cita = ?", [id]);
    res.json({ message: "Cita eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};