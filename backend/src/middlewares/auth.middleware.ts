import { verifyToken } from "../helpers/jwt.js";
import { type Request, type Response, type NextFunction } from "express";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ message: "No autenticado" });
    }
    // Verificar y decodificar token
    const decoded = verifyToken(token);
    // Almacenar datos del usuario
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
