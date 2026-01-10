import { Router } from "express";
import { getEventosCalendario, createEvento } from "../controllers/CalendarioController.js";

const router = Router();

router.get('/', getEventosCalendario); // GET /api/calendario
router.post('/', createEvento);        // POST /api/calendario

export default router;