import * as DashboardService from "../services/DashboardService.js";

// Ejemplo de lo que debería devolver tu DashboardController
export const getDashboard = async (req, res) => {
    const [empCount] = await pool.query("SELECT COUNT(*) as total FROM empleado");
    const [userCount] = await pool.query("SELECT COUNT(*) as total FROM usuario");
    const [citaCount] = await pool.query("SELECT COUNT(*) as total FROM cita");
    
    res.json({
        empleados: empCount[0].total,
        usuarios: userCount[0].total,
        citas: citaCount[0].total
    });
};