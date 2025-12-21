import { pool } from "../utils/db.js";

export const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM empleado"
  );
  return rows;
};

export const create = async (data) => {
  const { documento, nombres, apellidos } = data;

  const [result] = await pool.query(
    `INSERT INTO empleado (documento, nombres, apellidos)
     VALUES (?, ?, ?)`,
    [documento, nombres, apellidos]
  );

  return {
    id_empleado: result.insertId,
    documento,
    nombres,
    apellidos
  };
};
export const update = async (id, data) => {
  const { documento, nombres, apellidos, activo } = data;

  const [result] = await pool.query(
    `
    UPDATE empleado
    SET documento = ?, nombres = ?, apellidos = ?, activo = ?
    WHERE id_empleado = ?
    `,
    [documento, nombres, apellidos, activo, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Empleado no encontrado");
  }

  return { message: "Empleado actualizado correctamente" };
};

export const remove = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM empleado WHERE id_empleado = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Empleado no encontrado");
  }

  return { message: "Empleado eliminado correctamente" };
};
