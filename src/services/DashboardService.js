import { pool } from "../utils/db.js";

export const getData = async () => {
  const [totalEmpleados] = await pool.query(
    "SELECT COUNT(*) total FROM empleado"
  );

  const [empleadosActivos] = await pool.query(
    "SELECT COUNT(*) total FROM empleado WHERE activo = 1"
  );

  const [totalUsuarios] = await pool.query(
    "SELECT COUNT(*) total FROM usuario"
  );

  return {
    totalEmpleados: totalEmpleados[0].total,
    empleadosActivos: empleadosActivos[0].total,
    totalUsuarios: totalUsuarios[0].total,
  };
};