import { pool } from "../utils/db.js";

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { rol } = req.user;

      const [rows] = await pool.query(
        `
        SELECT p.nombre
        FROM permiso p
        JOIN rol_permiso rp ON rp.fk_id_permiso = p.id_permiso
        JOIN rol r ON r.id_rol = rp.fk_id_rol
        WHERE r.nombre = ?
        `,
        [rol]
      );

      const permisos = rows.map(p => p.nombre);

      if (!permisos.includes(permission)) {
        return res.status(403).json({
          error: "No tienes permiso para esta acción"
        });
      }

      next();
    } catch (error) {
      console.error("ERROR PERMISOS >>>", error);
      res.status(500).json({ error: "Error validando permisos" });
    }
  };
};
