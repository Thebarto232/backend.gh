import { pool } from "../utils/db.js";

// 1. Obtener empleados con la info completa de las 16 hojas del Excel
export const getAll = async () => {
    const query = `
        SELECT 
            e.*, 
            d.nombre_depto as nombre_departamento, 
            a.nombre_area, 
            p.nombre_perfil,
            eps.nombre_eps,
            fp.nombre_pension,
            ne.nombre_nivel,
            prof.nombre_profesion
        FROM empleado e
        LEFT JOIN departamento_empresa d ON e.fk_id_depto = d.id_depto
        LEFT JOIN area_empresa a ON e.fk_id_area = a.id_area
        LEFT JOIN perfil_ocupacional p ON e.fk_id_perfil = p.id_perfil
        LEFT JOIN eps eps ON e.fk_id_eps = eps.id_eps
        LEFT JOIN fondo_pensiones fp ON e.fk_id_pension = fp.id_pension
        LEFT JOIN nivel_educativo ne ON e.fk_id_nivel = ne.id_nivel
        LEFT JOIN profesion prof ON e.fk_id_profesion = prof.id_profesion
        ORDER BY e.apellidos_nombre ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
};

// 2. Crear empleado con los 11 campos validados del Excel
export const create = async (data) => {
    const { 
        id_cedula, apellidos_nombre, fecha_nacimiento, fecha_ingreso,
        fk_id_depto, fk_id_area, fk_id_perfil, fk_id_eps, 
        fk_id_pension, fk_id_nivel, fk_id_profesion 
    } = data;

    const query = `
        INSERT INTO empleado 
        (id_cedula, apellidos_nombre, fecha_nacimiento, fecha_ingreso, 
         fk_id_depto, fk_id_area, fk_id_perfil, fk_id_eps, 
         fk_id_pension, fk_id_nivel, fk_id_profesion, estado_empleado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO')
    `;
    
    const [result] = await pool.query(query, [
        id_cedula, apellidos_nombre, fecha_nacimiento, fecha_ingreso,
        fk_id_depto, fk_id_area, fk_id_perfil, fk_id_eps, 
        fk_id_pension, fk_id_nivel, fk_id_profesion
    ]);
    return result;
};

// 3. Actualizar información de forma dinámica
export const update = async (id, data) => {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = [...Object.values(data), id];
    const [result] = await pool.query(`UPDATE empleado SET ${fields} WHERE id_cedula = ?`, values);
    return result;
};

// 4. Eliminar empleado (Cascada para Hijos configurada en SQL)
export const remove = async (id) => {
    const [result] = await pool.query("DELETE FROM empleado WHERE id_cedula = ?", [id]);
    return result;
};

// NOTA: Aquí no va "export default router" porque esto es un SERVICE, no un ROUTER.
// Las funciones se exportan individualmente arriba con "export const".