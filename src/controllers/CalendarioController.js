import { pool } from "../utils/db.js";

// ======================================================
// 1. OBTENER EVENTOS (Citas + Cumpleaños + Aniversarios)
// ======================================================
export const getEventosCalendario = async (req, res) => {
    try {
        const year = new Date().getFullYear();

        // A. Obtener Citas Manuales (Tabla 'cita')
        // Mapeamos los campos de la BD a lo que espera FullCalendar
        const [citas] = await pool.query(`
            SELECT 
                id_cita as id, 
                titulo as title, 
                descripcion,
                fecha_inicio as start, 
                fecha_fin as end, 
                'CITA' as tipo  -- Por defecto, o si agregas la columna 'tipo' a la tabla
            FROM cita
        `);

        // B. Obtener Cumpleaños (Tabla 'empleado')
        // Corregido: 'estado_empleado' en lugar de 'estado'
        const [cumpleanos] = await pool.query(`
            SELECT 
                CONCAT('🎂 ', apellidos_nombre) as title,
                CONCAT(?, DATE_FORMAT(fecha_nacimiento, '-%m-%d')) as start,
                'CUMPLEANOS' as tipo,
                'Cumpleaños del colaborador' as descripcion
            FROM empleado 
            WHERE estado_empleado = 'ACTIVO'
        `, [year]);

        // C. Obtener Aniversarios (Tabla 'empleado')
        const [aniversarios] = await pool.query(`
            SELECT 
                CONCAT('🎉 ', apellidos_nombre, ' (', TIMESTAMPDIFF(YEAR, fecha_ingreso, CURDATE()), ' años)') as title,
                CONCAT(?, DATE_FORMAT(fecha_ingreso, '-%m-%d')) as start,
                'ANIVERSARIO' as tipo,
                CONCAT('Fecha de ingreso: ', fecha_ingreso) as descripcion
            FROM empleado 
            WHERE estado_empleado = 'ACTIVO' 
        `, [year]);

        // D. Unificar y Asignar Colores para el Frontend
        const todos = [
            ...citas.map(e => ({ ...e, color: '#3b82f6', textColor: '#ffffff', tipo: e.tipo || 'CITA' })), 
            ...cumpleanos.map(e => ({ ...e, color: '#ec4899', textColor: '#ffffff' })), 
            ...aniversarios.map(e => ({ ...e, color: '#eab308', textColor: '#ffffff' })) 
        ];

        res.json(todos);

    } catch (error) {
        console.error("Error getCalendario:", error);
        res.status(500).json({ error: error.message });
    }
};

// ======================================================
// 2. CREAR EVENTO
// ======================================================
export const createEvento = async (req, res) => {
    // Recibimos los datos del Frontend
    const { titulo, fecha_inicio, fecha_fin, descripcion, fk_id_usuario_creador } = req.body;
    
    try {
        // Validación mínima
        if (!titulo || !fecha_inicio || !fk_id_usuario_creador) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        // Insertamos en la tabla 'cita'
        const [result] = await pool.query(
            "INSERT INTO cita (titulo, descripcion, fecha_inicio, fecha_fin, fk_id_usuario_creador) VALUES (?, ?, ?, ?, ?)",
            [titulo, descripcion, fecha_inicio, fecha_fin, fk_id_usuario_creador]
        );

        res.json({ 
            message: "Evento creado", 
            id: result.insertId 
        });

    } catch (error) {
        console.error("Error createEvento:", error);
        res.status(500).json({ error: error.message });
    }
};

// ======================================================
// 3. ELIMINAR EVENTO (Faltaba este)
// ======================================================
export const deleteEvento = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM cita WHERE id_cita = ?", [id]);
        res.json({ message: "Evento eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};