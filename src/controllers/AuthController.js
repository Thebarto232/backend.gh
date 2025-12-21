import * as AuthService from "../services/AuthService.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
