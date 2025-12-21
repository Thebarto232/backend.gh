import { Router } from "express";
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
} from "../controllers/EmpleadoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/permissionMiddleware.js";


const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("VER_EMPLEADOS"),
  getEmpleados
);

router.post(
  "/",
  verifyToken,
  checkPermission("CREAR_EMPLEADOS"),
  createEmpleado
);
router.put(
  "/:id",
  verifyToken,
  checkPermission("EDITAR_EMPLEADOS"),
  updateEmpleado
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("ELIMINAR_EMPLEADOS"),
  deleteEmpleado
);

export default router;
