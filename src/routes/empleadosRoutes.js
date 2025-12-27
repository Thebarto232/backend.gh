// src/routes/empleadosRoutes.js
import { Router } from "express";
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  getCitas,
  createCita,
  deleteEmpleado
} from "../controllers/EmpleadoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/permissionMiddleware.js";
import * as EmpleadoController from '../controllers/EmpleadoController.js'; // <-- IMPORTANTE: el * as

const router = Router();

// --- RUTAS DE EMPLEADOS ---
router.get("/", verifyToken, checkPermission("VER_EMPLEADOS"), getEmpleados);
router.post("/", verifyToken, checkPermission("CREAR_EMPLEADOS"), createEmpleado);
router.put("/:id", verifyToken, checkPermission("EDITAR_EMPLEADOS"), updateEmpleado);
router.delete("/:id", verifyToken, checkPermission("ELIMINAR_EMPLEADOS"), deleteEmpleado);

// --- RUTAS DE CITAS (CALENDARIO) ---
// Cambiamos el path a /citas para no chocar con / de empleados
router.get("/citas", verifyToken, getCitas); 
router.post("/citas", verifyToken, createCita);
router.delete('/citas/:id', EmpleadoController.deleteCita);

export default router;