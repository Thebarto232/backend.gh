import { Router } from "express";
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getCitas,
  createCita,
  deleteCita
} from "../controllers/EmpleadoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/permissionMiddleware.js";

const router = Router();

// --- RUTAS DE EMPLEADOS ---
router.get("/", verifyToken, checkPermission("VER_EMPLEADOS"), getEmpleados);
router.post("/", verifyToken, checkPermission("CREAR_EMPLEADOS"), createEmpleado);
router.put("/:id", verifyToken, checkPermission("EDITAR_EMPLEADOS"), updateEmpleado);
router.delete("/:id", verifyToken, checkPermission("ELIMINAR_EMPLEADOS"), deleteEmpleado);

// --- RUTAS DE CITAS ---
router.get("/citas", verifyToken, getCitas); 
router.post("/citas", verifyToken, createCita);
router.delete("/citas/:id", verifyToken, deleteCita); // CORREGIDO: Importación directa

export default router;