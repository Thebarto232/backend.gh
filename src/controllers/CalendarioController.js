import { pool } from "../utils/db.js";

export const getEventosCalendario = async (req, res) => {
    try {
        const year = new Date().getFullYear();

        // 1. Obtener Eventos Manuales (Citas, Reuniones)
        const [eventosManuales] = await pool.query(`
            SELECT id_evento as id, titulo as title, fecha_inicio as start, fecha_fin as end, tipo 
            FROM evento
        `);

        // 2. Obtener Cumpleaños (Calculados para el año actual)
        // Truco SQL: Reemplazamos el año de nacimiento por el año actual
        const [cumpleanos] = await pool.query(`
            SELECT 
                CONCAT('🎂 ', apellidos_nombre) as title,
                CONCAT(?, DATE_FORMAT(fecha_nacimiento, '-%m-%d')) as start,
                'CUMPLEANOS' as tipo
            FROM empleado 
            WHERE estado = 'ACTIVO'
        `, [year]);

        // 3. Obtener Aniversarios (Calculados para el año actual)
        const [aniversarios] = await pool.query(`
            SELECT 
                CONCAT('🎉 ', apellidos_nombre, ' (', TIMESTAMPDIFF(YEAR, fecha_ingreso, CURDATE()), ' años)') as title,
                CONCAT(?, DATE_FORMAT(fecha_ingreso, '-%m-%d')) as start,
                'ANIVERSARIO' as tipo
            FROM empleado 
            WHERE estado = 'ACTIVO' AND MONTH(fecha_ingreso) = MONTH(CURDATE()) -- Opcional: filtrar o traer todos
        `, [year]);

        // 4. Unificar y Asignar Colores
        const todos = [
            ...eventosManuales.map(e => ({ ...e, color: '#3b82f6', textColor: '#ffffff' })), // Azul (Citas)
            ...cumpleanos.map(e => ({ ...e, color: '#ec4899', textColor: '#ffffff' })),      // Rosa (Cumpleaños)
            ...aniversarios.map(e => ({ ...e, color: '#eab308', textColor: '#ffffff' }))     // Dorado (Aniversarios)
        ];

        res.json(todos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEvento = async (req, res) => {
    const { titulo, fecha_inicio, fecha_fin, tipo } = req.body;
    try {
        await pool.query(
            "INSERT INTO evento (titulo, fecha_inicio, fecha_fin, tipo) VALUES (?, ?, ?, ?)",
            [titulo, fecha_inicio, fecha_fin, tipo]
        );
        res.json({ message: "Evento creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};