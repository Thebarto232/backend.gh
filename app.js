import 'dotenv/config';
import express from "express";
import cors from "cors";

// IMPORTACIONES DE RUTAS
import empleadosRoutes from "./src/routes/empleadosRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTAS DEL API
// ---------------------------------------------------------
app.use("/api/empleados", empleadosRoutes);
app.use("/api/auth", authRoutes);

// Define que todo lo del dashboard empieza con /api/dashboard
app.use("/api/dashboard", dashboardRoutes); 
// ---------------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 SERVIDOR CORRIENDO EN PUERTO ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`==========================================`);
});