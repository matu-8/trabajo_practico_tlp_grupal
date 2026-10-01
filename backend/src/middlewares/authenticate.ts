import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt.js";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, msg: 'Token no enviado' });
    return;
  }

  try {
    req.user = verifyToken(header.slice(7)); // saca el "Bearer "
    next();
  } catch {
    res.status(401).json({ ok: false, msg: 'Token inválido o vencido' });
  }
}