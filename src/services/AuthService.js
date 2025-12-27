import bcrypt from "bcryptjs"; // Usa bcryptjs consistentemente
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

// 1. FUNCIÓN PARA BUSCAR USUARIO (La que te faltaba)
export const findUserByUsername = async (username) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE username = ?",
    [username]
  );
  return rows[0];
};

// 2. FUNCIÓN PARA CREAR USUARIO (La que te faltaba)
export const createUser = async (userData) => {
  const { username, password, fk_id_rol } = userData;
  const [result] = await pool.query(
    "INSERT INTO usuario (username, password, fk_id_rol, estado) VALUES (?, ?, ?, 1)",
    [username, password, fk_id_rol]
  );
  return result;
};

// 3. TU FUNCIÓN DE LOGIN (Actualizada para consistencia)
export const login = async (username, password) => {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.username, u.password, r.nombre AS rol
     FROM usuario u
     JOIN rol r ON u.fk_id_rol = r.id_rol
     WHERE u.username = ? AND u.estado = 1`,
    [username]
  );

  if (rows.length === 0) throw new Error("Usuario no existe");

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error("Contraseña incorrecta");

  const token = jwt.sign(
    { id: user.id_usuario, rol: user.rol },
    process.env.JWT_SECRET,
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