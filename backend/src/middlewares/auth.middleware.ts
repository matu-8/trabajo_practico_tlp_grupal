import { verifyToken } from "../helpers/jwt.js";
import { type Request, type Response, type NextFunction } from "express";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ ok: false, msg: "No autenticado" });
  }

  try {
    // Verificar y decodificar token
    const decoded = verifyToken(token);
    // Almacenar datos del usuario
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ ok: false, msg: "Token inválido o vencido" });
  }
};
