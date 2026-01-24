import { Router } from "express";
import { 
    getDepartamentos, 
    createDepartamento, 
    getAreasByDepto, 
    createArea,
    deleteDepartamento
} from "../controllers/DepartamentosController.js";

const router = Router();

// Base URL: /api/departamentos
router.get('/', getDepartamentos);
router.post('/', createDepartamento);
router.delete('/:id', deleteDepartamento);

// Sub-rutas para Áreas
router.get('/:idDepto/areas', getAreasByDepto);
router.post('/areas', createArea);

export default router;