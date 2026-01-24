import { pool } from "../utils/db.js";

// 1. Obtener empleados con relaciones
export const getAll = async () => {
    const query = `
        SELECT 
            e.id_cedula, e.apellidos_nombre, e.email_personal, e.celular, e.estado_empleado,
            d.nombre_depto, a.nombre_area, c.nombre_cargo
        FROM empleado e
        LEFT JOIN departamento_empresa d ON e.fk_id_depto = d.id_depto
        LEFT JOIN area a ON e.fk_id_area = a.id_area -- CORREGIDO: Tabla 'area'
        LEFT JOIN cargo c ON e.fk_id_cargo = c.id_cargo
        ORDER BY e.apellidos_nombre ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
};

// 2. Crear empleado (Completo)
export const create = async (data) => {
    // Validar datos mínimos
    if (!data.id_cedula || !data.apellidos_nombre) throw new Error("Faltan datos obligatorios");

    const query = `
        INSERT INTO empleado (
            id_cedula, apellidos_nombre, fecha_nacimiento, fecha_ingreso,
            fk_id_depto, fk_id_area, fk_id_cargo, fk_id_profesion, 
            fk_id_eps, fk_id_pension, fk_id_nivel, fk_id_perfil,
            sexo, rh, celular, email_personal, direccion_residencia,
            contacto_emergencia_nombre, contacto_emergencia_telefono,
            estado_empleado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO')
    `;
    
    // Mapeo seguro de valores (undefined -> null)
    const values = [
        data.id_cedula, data.apellidos_nombre, data.fecha_nacimiento || null, data.fecha_ingreso || null,
        data.fk_id_depto || null, data.fk_id_area || null, data.fk_id_cargo || null, data.fk_id_profesion || null,
        data.fk_id_eps || null, data.fk_id_pension || null, data.fk_id_nivel || null, data.fk_id_perfil || null,
        data.sexo || null, data.rh || null, data.celular || null, data.email_personal || null, data.direccion_residencia || null,
        data.contacto_emergencia_nombre || null, data.contacto_emergencia_telefono || null
    ];

    const [result] = await pool.query(query, values);
    return result;
};

// 3. Actualizar
export const update = async (id, data) => {
    // Eliminamos campos que no son columnas o la PK
    delete data.id_cedula;
    if (Object.keys(data).length === 0) return null;

    const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = [...Object.values(data), id];
    
    const [result] = await pool.query(`UPDATE empleado SET ${fields} WHERE id_cedula = ?`, values);
    return result;
};

// 4. Eliminar
export const remove = async (id) => {
    const [result] = await pool.query("DELETE FROM empleado WHERE id_cedula = ?", [id]);
    return result;
};