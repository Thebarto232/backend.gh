import { Router } from "express";
import { login,register } from "../controllers/AuthController.js";


const router = Router();

router.post('/login', login);
router.post('/register', register); // Esta es la ruta que usará tu register.js

export default router;
