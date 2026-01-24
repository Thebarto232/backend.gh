import * as AuthService from "../services/AuthService.js";
import { pool } from "../utils/db.js"; // Necesario para getRoles y users

// ======================================================
// 1. REGISTRO
// ======================================================
export const register = async (req, res) => {
    try {
        const { username, password, fk_id_rol, email } = req.body;

        // Lógica de fallback: Si el front manda 'email' pero no 'username', usamos el email
        const usuarioFinal = username || email;
        
        if (!usuarioFinal || !password) {
            return res.status(400).json({ error: "El usuario/email y la contraseña son obligatorios" });
        }

        const result = await AuthService.createUser({
            username: usuarioFinal,
            password: password,
            fk_id_rol: fk_id_rol || 3
        });

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            id: result.insertId
        });

    } catch (error) {
        console.error("Error en AuthController.register:", error);
        res.status(500).json({ error: error.message });
    }
};

// ======================================================
// 2. LOGIN
// ======================================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Faltan credenciales" });
        }

        const result = await AuthService.login(email, password);
        res.json(result);
    } catch (error) {
        // Manejo de error 401 vs 500
        const status = error.message === "Credenciales inválidas" ? 401 : 500;
        res.status(status).json({ error: error.message });
    }
};

// ======================================================
// 3. OBTENER ROLES (Esta era la que faltaba)
// ======================================================
export const getRoles = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id_rol, nombre FROM rol ORDER BY nombre ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error getRoles:", error);
        res.status(500).json({ error: "Error al obtener roles" });
    }
};

// ======================================================
// 4. LISTAR USUARIOS (Esta también faltaba)
// ======================================================
export const users = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.id_usuario, u.username, r.nombre AS rol, u.estado, u.fecha_creacion
            FROM usuario u
            JOIN rol r ON u.fk_id_rol = r.id_rol
            ORDER BY u.id_usuario DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error users:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};