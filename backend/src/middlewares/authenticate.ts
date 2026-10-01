import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt.js";

// Busca el token primero en la cookie y, si no está, en el header Authorization
function getToken(req: Request): string | null {
  const cookieToken: unknown = req.cookies?.token;
  if (typeof cookieToken === 'string' && cookieToken !== '') return cookieToken;

  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7); // saca el "Bearer "

  return null;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ ok: false, msg: 'Token no enviado' });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ ok: false, msg: 'Token inválido o vencido' });
  }
}
