import { pool } from "../utils/db.js";

export const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM empleado");
  return rows;
};

export const create = async (data) => {
  // Ajustado a las columnas reales: id_cedula y apellidos_nombre
  const { id_cedula, apellidos_nombre, fk_id_depto, fecha_ingreso } = data;

  const [result] = await pool.query(
    `INSERT INTO empleado (id_cedula, apellidos_nombre, fk_id_depto, fecha_ingreso)
     VALUES (?, ?, ?, ?)`,
    [id_cedula, apellidos_nombre, fk_id_depto, fecha_ingreso]
  );

  return { id_cedula, apellidos_nombre };
};

export const remove = async (id) => {
  // Ajustado para borrar por id_cedula
  const [result] = await pool.query(
    "DELETE FROM empleado WHERE id_cedula = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Empleado no encontrado");
  }

  return { message: "Empleado eliminado correctamente" };
};