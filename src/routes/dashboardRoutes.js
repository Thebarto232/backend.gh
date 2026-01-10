import { Router } from "express";
import { 
    getStatsSummary, 
    getCalendarEvents, 
    getBirthdaysMonth, 
    getCatalogos, 
    crearEvento 
} from "../controllers/DashboardController.js";

const router = Router();

// Base: /api/dashboard (definido en app.js)

// Estadísticas
router.get('/stats/summary', getStatsSummary);       // -> /api/dashboard/stats/summary

// Calendario y Eventos
router.get('/citas', getCalendarEvents);             // -> /api/dashboard/citas
router.post('/eventos', crearEvento);                // -> /api/dashboard/eventos

// Reportes (Cumpleaños)
router.get('/reportes/cumpleanos', getBirthdaysMonth); // -> /api/dashboard/reportes/cumpleanos

// Catálogos Generales (EPS, AFP, etc.)
router.get('/catalogos/:tipo', getCatalogos);        // -> /api/dashboard/catalogos/:tipo

export default router;