import { Router } from "express";
import { 
    getStatsSummary, 
    getCalendarEvents, 
    getBirthdaysMonth, 
    getCatalogos, 
    crearEvento 
} from "../controllers/DashboardController.js";

const router = Router();

router.get('/stats/summary', getStatsSummary);
router.get('/citas', getCalendarEvents);
router.post('/eventos', crearEvento);
router.get('/reportes/cumpleanos', getBirthdaysMonth);
router.get('/catalogos/:tipo', getCatalogos);

export default router;