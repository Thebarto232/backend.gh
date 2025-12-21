import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

export const login = async (username, password) => {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.username, u.password, r.nombre AS rol
     FROM usuario u
     JOIN rol r ON u.fk_id_rol = r.id_rol
     WHERE u.username = ? AND u.estado = 1`,
    [username]
  );

  if (rows.length === 0) {
    throw new Error("Usuario no existe");
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    {
      id: user.id_usuario,
      rol: user.rol
    },
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
