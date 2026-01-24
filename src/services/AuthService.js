import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";
import { config } from "dotenv";

config();

// 1. BUSCAR USUARIO (Por username, que es lo que tiene tu BD)
export const findUserByUsername = async (username) => {
    const [rows] = await pool.query(
        "SELECT * FROM usuario WHERE username = ?",
        [username]
    );
    return rows[0];
};

// 2. CREAR USUARIO (Adaptado a tu tabla 'usuario')
export const createUser = async (userData) => {
    // Nota: Tu BD es AUTO_INCREMENT, no enviamos id_usuario.
    // Nota: Tu tabla 'usuario' NO tiene nombre_completo, solo username y password.
    const { username, password, fk_id_rol } = userData;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertamos estado como 1 (TINYINT) que es el default en tu BD
        const [result] = await pool.query(
            `INSERT INTO usuario (username, password, fk_id_rol, estado) 
             VALUES (?, ?, ?, 1)`,
            [username, hashedPassword, fk_id_rol]
        );
        return result;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error("El Rol seleccionado no es válido.");
        }
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("El nombre de usuario ya existe.");
        }
        throw error;
    }
};

// 3. LOGIN (Adaptado a columnas 'username', 'estado' TINYINT y rol 'nombre')
export const login = async (username, password) => {
    // JOIN corregido: r.nombre (según tu SQL) en lugar de r.nombre_rol
    const [rows] = await pool.query(
        `SELECT u.id_usuario, u.username, u.password, u.estado, r.nombre AS rol
         FROM usuario u
         JOIN rol r ON u.fk_id_rol = r.id_rol
         WHERE u.username = ?`,
        [username]
    );

    if (rows.length === 0) throw new Error("Usuario no encontrado");

    const user = rows[0];

    // Validación de estado (TINYINT: 1 es Activo, 0 es Inactivo)
    if (user.estado === 0) {
        throw new Error("El usuario está inactivo.");
    }

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Credenciales incorrectas");

    // Generar Token
    const token = jwt.sign(
        { id: user.id_usuario, rol: user.rol },
        process.env.JWT_SECRET || 'clave_secreta_provisional',
        { expiresIn: "8h" }
    );

    return { 
        token, 
        user: { 
            id: user.id_usuario, 
            username: user.username, 
            rol: user.rol 
        } 
    };
};