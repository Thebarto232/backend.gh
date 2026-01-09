import { Router } from "express";
import { login, register, getRoles, users } from "../controllers/AuthController.js";
import { getHijosByEmpleado, createHijo } from "../controllers/EmpleadosController.js";
// Importamos todas las funciones que acabamos de crear
import { 
    getStatsSummary, 
    getCalendarEvents, 
    getBirthdaysMonth, 
    getCatalogos, 
    crearEvento 
} from "../controllers/DashboardController.js";

const router = Router();

// --- AUTENTICACIÓN ---
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/roles', getRoles);
router.get('/auth/users', users);

// --- DASHBOARD Y CALENDARIO ---
router.get('/dashboard/stats/summary', getStatsSummary);
router.get('/dashboard/citas', getCalendarEvents);
router.get('/empleados/reportes/cumpleanos', getBirthdaysMonth); // Esta arregla el error 500
router.post('/eventos', crearEvento);

// --- UTILIDADES (CATÁLOGOS) ---
router.get('/catalogos/:tipo', getCatalogos);
router.get('/empleados/hijos/:cedula', getHijosByEmpleado);
router.post('/empleados/hijos', createHijo);

export default router;