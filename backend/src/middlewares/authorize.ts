import type { RequestHandler } from "express";

export type Authorize = (permission: string) => RequestHandler;

export const authorize: Authorize = (permission) => (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ ok: false, msg: 'No autenticado' });
    return;
  }

  if (!req.user.permissions.includes(permission)) {
    res.status(403).json({ ok: false, msg: 'No tenés permiso para esta acción' });
    return;
  }

  next();
};