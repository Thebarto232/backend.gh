export const getDashboard = async (req, res) => {
  try {
    const data = {
      totalEmpleados: await Empleado.count(),
      totalUsuarios: await Usuario.count(),
      empleadosActivos: await Empleado.countActivos()
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error dashboard" });
  }
};
