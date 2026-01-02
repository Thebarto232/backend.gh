import { pool } from "../utils/db.js";

export const getDashboardStats = async () => {
  // Conteo total de empleados
  const [empTotal] = await pool.query("SELECT COUNT(*) as total FROM empleado");
  
  // Conteo de empleados activos según tu columna 'estado_empleado'
  const [empActivos] = await pool.query(
    "SELECT COUNT(*) as total FROM empleado WHERE estado_empleado = 'ACTIVO'"
  );

  // Conteo de usuarios del sistema
  const [userTotal] = await pool.query("SELECT COUNT(*) as total FROM usuario");

  // Conteo de citas programadas
  const [citaTotal] = await pool.query("SELECT COUNT(*) as total FROM cita");

  return {
    totalEmpleados: empTotal[0].total,
    empleadosActivos: empActivos[0].total,
    totalUsuarios: userTotal[0].total,
    totalCitas: citaTotal[0].total
  };
};