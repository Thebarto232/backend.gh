import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Acceso denegado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisional');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
};