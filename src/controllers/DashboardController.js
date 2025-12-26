import * as DashboardService from "../services/DashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const data = await DashboardService.getData();
    res.json(data);
  } catch (error) {
    console.error("ERROR DASHBOARD:", error);
    res.status(500).json({ error: "Error al cargar dashboard" });
  }
};
