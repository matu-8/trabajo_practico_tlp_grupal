import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

// Se usa despues de las reglas de express-validator en cada ruta
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ ok: false, errors: errors.array() });
    return;
  }
  next();
};
