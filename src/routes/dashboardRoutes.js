import { Router } from "express";
import { getDashboard } from "../controllers/DashboardController.js";

const router = Router();

router.get("/", getDashboard);

export default router;
