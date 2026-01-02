import * as AuthService from "../services/AuthService.js";
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const { username, password, fk_id_rol } = req.body;

        if (!username || !password || !fk_id_rol) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const existingUser = await AuthService.findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await AuthService.createUser({
            username,
            password: hashedPassword,
            fk_id_rol
        });

        res.status(201).json({ message: "Usuario creado", id: newUser.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await AuthService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};