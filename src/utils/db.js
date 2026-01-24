import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  // Si no encuentra la variable en .env, usa estas credenciales de respaldo:
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'gh_user',             // <--- ACTUALIZADO
  password: process.env.DB_PASSWORD || 'Gh2025@Seguro', // <--- ACTUALIZADO
  database: process.env.DB_NAME || 'app_gh',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Bloque opcional para verificar en consola que la conexión es exitosa
pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log("✅ Conexión a Base de Datos EXITOSA con usuario:", process.env.DB_USER || 'gh_user');
    })
    .catch(err => {
        console.error("❌ Error de conexión a BD:", err.message);
    });