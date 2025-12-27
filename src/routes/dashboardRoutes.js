// src/routes/dashboardRoutes.js
import { Router } from "express";
import { getDashboard } from "../controllers/DashboardController.js";
import { getCitas } from "../controllers/EmpleadoController.js"; 
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Esta ruta sería para datos generales del dashboard (conteo de empleados, etc.)
router.get("/", verifyToken, getDashboard);

// ESTA es la que usará el Calendario: /api/dashboard/citas
router.get("/citas", verifyToken, getCitas);

export default router;