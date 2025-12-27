import * as AuthService from "../services/AuthService.js";
import bcrypt from 'bcryptjs'; // Cambiado de 'bcrypt' a 'bcryptjs' para coincidir con el Service

// DEFINICIÓN 1: LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // El servicio ya valida el usuario, la clave y genera el Token
    const result = await AuthService.login(username, password);
    
    res.json(result);
  } catch (error) {
    // Si el error es "Usuario no existe" o "Contraseña incorrecta"
    res.status(401).json({ error: error.message });
  }
};

// DEFINICIÓN 2: REGISTER
export const register = async (req, res) => {
    try {
        const { username, password, fk_id_rol } = req.body;

        // 1. Validar campos obligatorios
        if (!username || !password || !fk_id_rol) {
            return res.status(400).json({ error: "Faltan datos obligatorios (username, password, rol)" });
        }

        // 2. Validar que el usuario no exista (Usa la función que añadimos al Service)
        const existingUser = await AuthService.findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
        }

        // 3. Encriptar contraseña con bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Guardar en la base de datos
        const newUser = await AuthService.createUser({
            username,
            password: hashedPassword,
            fk_id_rol
        });

        res.status(201).json({ 
            message: "Usuario creado exitosamente", 
            userId: newUser.insertId 
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el registro" });
    }
};