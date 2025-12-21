export const isAdmin = (req, res, next) => {
  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};

router.get("/dashboard", authMiddleware, isAdmin, dashboardController);
// This route is now protected and only accessible by admin users