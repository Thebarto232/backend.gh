import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

// BUSCAR USUARIO (Para validaciones)
export const findUserByUsername = async (username) => {
    const [rows] = await pool.query(
        "SELECT * FROM usuario WHERE username = ?",
        [username]
    );
    return rows[0];
};

// CREAR USUARIO (Registro alineado a la BD)
export const createUser = async (userData) => {
    const { username, password, fk_id_rol } = userData;
    try {
        const [result] = await pool.query(
            "INSERT INTO usuario (username, password, fk_id_rol, estado) VALUES (?, ?, ?, 1)",
            [username, password, fk_id_rol]
        );
        return result;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error("El Rol seleccionado no es válido en el sistema.");
        }
        throw error;
    }
};

// LOGIN (Con JOIN para obtener el nombre del rol)
export const login = async (username, password) => {
    const [rows] = await pool.query(
        `SELECT u.id_usuario, u.username, u.password, r.nombre AS rol
         FROM usuario u
         JOIN rol r ON u.fk_id_rol = r.id_rol
         WHERE u.username = ? AND u.estado = 1`,
        [username]
    );

    if (rows.length === 0) throw new Error("Usuario no encontrado o inactivo");

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Credenciales incorrectas");

    const token = jwt.sign(
        { id: user.id_usuario, rol: user.rol },
        process.env.JWT_SECRET || 'clave_secreta_provisional',
        { expiresIn: "8h" }
    );

    return { token, user: { id: user.id_usuario, username: user.username, rol: user.rol } };
};