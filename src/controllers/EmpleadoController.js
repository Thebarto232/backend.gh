import * as EmpleadoService from "../services/EmpleadoService.js";

export const getEmpleados = async (req, res) => {
  try {
    const empleados = await EmpleadoService.getAll();
    res.json(empleados);
  } catch (error) {
    console.error("ERROR GET EMPLEADOS >>>", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor"
    });
  }
};

export const createEmpleado = async (req, res) => {
  try {
    const empleado = await EmpleadoService.create(req.body);
    res.status(201).json(empleado);
  } catch (error) {
    console.error("ERROR CREATE EMPLEADO >>>", error);
    res.status(500).json({
      error: error.message || "Error interno del servidor"
    });
  }
};
export const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmpleadoService.update(id, req.body);
    res.json(result);
  } catch (error) {
    console.error("ERROR UPDATE EMPLEADO >>>", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmpleadoService.remove(id);
    res.json(result);
  } catch (error) {
    console.error("ERROR DELETE EMPLEADO >>>", error);
    res.status(500).json({ error: error.message });
  }
};
