import * as DashboardService from "../services/DashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const stats = await DashboardService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("ERROR DASHBOARD CONTROLLER >>>", error.message);
    res.status(500).json({ error: "Error al obtener estadísticas del dashboard" });
  }
};