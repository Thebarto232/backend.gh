import 'dotenv/config';
import express from "express";
import cors from "cors";

// =================================================================
// IMPORTACIONES DE RUTAS (CORREGIDAS)
// Nota: Debemos entrar a "./src/routes/" porque app.js está afuera
// =================================================================
import empleadosRoutes from "./src/routes/empleadosRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import departamentosRoutes from "./src/routes/departamentosRoutes.js";
import calendarioRoutes from "./src/routes/calendarioRoutes.js";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTAS DEL API
app.use("/api/empleados", empleadosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/departamentos", departamentosRoutes);
app.use("/api/calendario", calendarioRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 SERVIDOR CORRIENDO EN PUERTO ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`==========================================`);
});