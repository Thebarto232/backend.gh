import { Router } from "express";
import { pool } from "../utils/db.js";

const router = Router(); // <--- 1. Inicialización necesaria

// CUMPLEAÑOS: Filtra por el mes actual
router.get('/reportes/cumpleanos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id_cedula, apellidos_nombre, fecha_nacimiento, 
                   DAY(fecha_nacimiento) as dia, ae.nombre_area
            FROM empleado e
            LEFT JOIN area_empresa ae ON e.fk_id_area = ae.id_area
            WHERE MONTH(fecha_nacimiento) = MONTH(CURRENT_DATE())
            AND e.estado_empleado = 'ACTIVO'
            ORDER BY dia ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error en la consulta de cumpleaños: " + error.message });
    }
});

// ANIVERSARIOS: Calcula años en la empresa
router.get('/reportes/aniversarios', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id_cedula, apellidos_nombre, fecha_ingreso,
                   TIMESTAMPDIFF(YEAR, fecha_ingreso, CURRENT_DATE()) as anos
            FROM empleado 
            WHERE MONTH(fecha_ingreso) = MONTH(CURRENT_DATE())
            AND estado_empleado = 'ACTIVO'
            ORDER BY DAY(fecha_ingreso) ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error en la consulta de aniversarios: " + error.message });
    }
});

// SEGURIDAD SOCIAL: Cruza con tablas de EPS y Pensiones
router.get('/reportes/seguridad-social', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.id_cedula, e.apellidos_nombre, eps.nombre_eps, fp.nombre_pension
            FROM empleado e
            LEFT JOIN eps ON e.fk_id_eps = eps.id_eps
            LEFT JOIN fondo_pensiones fp ON e.fk_id_pension = fp.id_pension
            WHERE e.estado_empleado = 'ACTIVO'
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error en seguridad social: " + error.message });
    }
});

export default router; // <--- 2. Exportar la instancia 'router', no la clase 'Router'