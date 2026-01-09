import * as AuthService from "../services/AuthService.js";
import { pool } from "../utils/db.js";

// Función auxiliar para generar ID corto (Ej: USR-171562)
const generarIdUsuario = () => {
    return 'USR-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
};

// ======================================================
// REGISTRO DE USUARIO
// ======================================================
export const register = async (req, res) => {
    try {
        // 1. Capturamos fk_id_rol del cuerpo de la petición
        const { email, password, nombre_completo, fk_id_rol } = req.body;
        
        // 2. Asignar Rol: Si viene del formulario úsalo, si no, usa 3 (Visitante)
        const rolFinal = fk_id_rol || 3; 

        // 3. Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        // 4. Verificar si el usuario ya existe
        const [existing] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Este correo ya está registrado" });
        }

        // 5. Generar ID Manualmente (Para tu campo VARCHAR)
        const id_usuario = generarIdUsuario();

        // 6. Crear usuario llamando al servicio
        const newUser = await AuthService.createUser({
            id_usuario, 
            email,
            password, 
            fk_id_rol: rolFinal, // <--- Usamos la variable con la lógica corregida
            nombre_completo: nombre_completo || 'Usuario Nuevo'
        });

        // 7. Responder
        res.status(201).json({ 
            message: "Usuario registrado exitosamente", 
            id: id_usuario 
        });

    } catch (error) {
        console.error("Error en register:", error);
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
};

// ======================================================
// LOGIN DE USUARIO
// ======================================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        
        // Validación extra
        if (!email || !password) {
             return res.status(400).json({ error: "Faltan credenciales (email/password)" });
        }

        const result = await AuthService.login(email, password);
        res.json(result);
    } catch (error) {
        // Si AuthService lanza error (pass incorrecta, usuario no existe), cae aquí
        res.status(401).json({ error: error.message });
    }
};

// ======================================================
// OBTENER ROLES (Para llenar el select del registro)
// ======================================================
export const getRoles = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id_rol, nombre_rol FROM rol ORDER BY nombre_rol ASC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener roles" });
    }
};

// ======================================================
// LISTAR USUARIOS (Para el panel de Admin)
// ======================================================
export const users = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.id_usuario, u.email, u.nombre_completo, r.nombre_rol AS rol, u.estado 
            FROM usuario u
            JOIN rol r ON u.fk_id_rol = r.id_rol
            ORDER BY u.nombre_completo ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios: " + error.message });
    }
};