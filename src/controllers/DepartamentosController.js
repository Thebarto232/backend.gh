import { pool } from "../utils/db.js";

// 1. OBTENER DEPARTAMENTOS (Con conteo de áreas)
export const getDepartamentos = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id_depto, 
                d.nombre_depto,
                COUNT(a.id_area) as total_areas
            FROM departamento_empresa d
            LEFT JOIN area a ON d.id_depto = a.fk_id_depto
            GROUP BY d.id_depto
            ORDER BY d.nombre_depto ASC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. CREAR DEPARTAMENTO
export const createDepartamento = async (req, res) => {
    const { nombre_depto } = req.body;
    try {
        // Corrección: tabla 'departamento_empresa'
        await pool.query("INSERT INTO departamento_empresa (nombre_depto) VALUES (?)", [nombre_depto]);
        res.status(201).json({ message: "Departamento creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. OBTENER ÁREAS POR DEPTO
export const getAreasByDepto = async (req, res) => {
    const { idDepto } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM area WHERE fk_id_depto = ? ORDER BY nombre_area ASC", [idDepto]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. CREAR ÁREA
export const createArea = async (req, res) => {
    const { nombre_area, fk_id_depto, presupuestados } = req.body;
    try {
        await pool.query(
            "INSERT INTO area (nombre_area, fk_id_depto, presupuestados) VALUES (?, ?, ?)", 
            [nombre_area, fk_id_depto, presupuestados || 0]
        );
        res.status(201).json({ message: "Área creada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. ELIMINAR DEPARTAMENTO
export const deleteDepartamento = async (req, res) => {
    const { id } = req.params;
    try {
        // Al usar ON DELETE CASCADE en la BD, solo borramos el padre
        const [result] = await pool.query("DELETE FROM departamento_empresa WHERE id_depto = ?", [id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: "No encontrado" });
        res.json({ message: "Departamento eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};