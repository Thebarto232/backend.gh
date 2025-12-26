import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import empleadosRoutes from "./src/routes/empleadosRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";




dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/empleados", empleadosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
