import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";
import { config } from "dotenv";

config(); // Cargar variables de entorno para el JWT_SECRET

// 1. BUSCAR USUARIO (Ahora por EMAIL, no username)
export const findUserByUsername = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM usuario WHERE email = ?",
        [email]
    );
    return rows[0];
};

// 2. CREAR USUARIO (Registro alineado a la nueva BD)
export const createUser = async (userData) => {
    // Recibimos id_usuario porque tu BD no es auto-incrementable
    const { id_usuario, email, password, fk_id_rol, nombre_completo } = userData;

    try {
        // Encriptamos la contraseña aquí en el servicio
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // SQL corregido:
        // - username -> email
        // - estado 1 -> estado 'True' (ENUM)
        // - Agregamos id_usuario y nombre_completo
        const [result] = await pool.query(
            `INSERT INTO usuario (id_usuario, email, password, fk_id_rol, nombre_completo, estado) 
             VALUES (?, ?, ?, ?, ?, 'True')`,
            [id_usuario, email, hashedPassword, fk_id_rol, nombre_completo]
        );
        return result;
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new Error("El Rol seleccionado no es válido en el sistema.");
        }
        throw error;
    }
};

// 3. LOGIN (Corregido: email, nombre_rol y estado)
export const login = async (email, password) => {
    // JOIN corregido: 'r.nombre' ahora es 'r.nombre_rol' en tu BD
    const [rows] = await pool.query(
        `SELECT u.id_usuario, u.email, u.nombre_completo, u.password, u.estado, r.nombre_rol AS rol
         FROM usuario u
         JOIN rol r ON u.fk_id_rol = r.id_rol
         WHERE u.email = ?`,
        [email]
    );

    if (rows.length === 0) throw new Error("Usuario no encontrado");

    const user = rows[0];

    // Validación de estado (ENUM 'True'/'False')
    if (user.estado === 'False' || user.estado === 'INACTIVO') {
        throw new Error("El usuario está inactivo. Contacte al administrador.");
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
            email: user.email, 
            nombre: user.nombre_completo, 
            rol: user.rol 
        } 
    };
};