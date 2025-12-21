import bcrypt from "bcryptjs";
import { pool } from "../utils/db.js";

const createAdmin = async () => {
  const username = "admin";
  const password = "admin123"; // luego se cambia
  const hashedPassword = await bcrypt.hash(password, 10);

  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE username = ?",
    [username]
  );

  if (rows.length > 0) {
    console.log("✔ Usuario admin ya existe");
    process.exit();
  }

  await pool.query(
    `INSERT INTO usuario (username, password, fk_id_rol)
     VALUES (?, ?, (SELECT id_rol FROM rol WHERE nombre = 'ADMIN'))`,
    [username, hashedPassword]
  );

  console.log("✅ Usuario admin creado");
  process.exit();
};

createAdmin();
