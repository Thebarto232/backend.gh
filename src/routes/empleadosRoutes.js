import { Router } from "express";
import { 
    getEmpleados, 
    getEmpleadoById, 
    createEmpleado, 
    updateEmpleado, 
    deleteEmpleado,
    getHijosByEmpleado,
    createHijo,
    getReporteSeguridadSocial // <--- IMPORTANTE: Importar la nueva función
} from "../controllers/EmpleadosController.js";

const router = Router();

// ======================================================
// Base URL: /api/empleados
// ======================================================

// 1. Reportes (Deben ir ANTES de las rutas con :id para evitar conflictos)
router.get('/reportes/seguridad-social', getReporteSeguridadSocial); // -> GET /api/empleados/reportes/seguridad-social

// 2. Gestión de Hijos
router.get('/hijos/:cedula', getHijosByEmpleado);
router.post('/hijos', createHijo);

// 3. CRUD Empleados
router.get('/', getEmpleados);          
router.get('/:id', getEmpleadoById);    
router.post('/', createEmpleado);       
router.put('/:id', updateEmpleado);     
router.delete('/:id', deleteEmpleado);  

export default router;