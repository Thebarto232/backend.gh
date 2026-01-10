import { Router } from "express";
import { login, register, getRoles, users } from "../controllers/AuthController.js";

const router = Router();

// Base: /api/auth (definido en app.js)

router.post('/login', login);       // -> /api/auth/login
router.post('/register', register); // -> /api/auth/register
router.get('/roles', getRoles);     // -> /api/auth/roles
router.get('/users', users);        // -> /api/auth/users

export default router;