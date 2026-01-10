import { pool } from "../utils/db.js";

// 1. OBTENER DEPARTAMENTOS
export const getDepartamentos = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id_depto, 
                d.nombre_depto,
                COUNT(a.id_area) as total_areas
            FROM departamento d
            LEFT JOIN area a ON d.id_depto = a.fk_id_depto
            GROUP BY d.id_depto
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
        await pool.query("INSERT INTO departamento (nombre_depto) VALUES (?)", [nombre_depto]);
        res.status(201).json({ message: "Departamento creado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. OBTENER ÁREAS POR DEPTO
export const getAreasByDepto = async (req, res) => {
    const { idDepto } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM area WHERE fk_id_depto = ?", [idDepto]);
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

// ... (código anterior)

// 5. ELIMINAR DEPARTAMENTO
export const deleteDepartamento = async (req, res) => {
    const { id } = req.params;
    try {
        // Primero borramos las áreas asociadas para mantener integridad (opcional, o usar CASCADE en BD)
        await pool.query("DELETE FROM area WHERE fk_id_depto = ?", [id]);
        
        // Ahora borramos el departamento
        const [result] = await pool.query("DELETE FROM departamento WHERE id_depto = ?", [id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: "No encontrado" });
        
        res.json({ message: "Departamento eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};