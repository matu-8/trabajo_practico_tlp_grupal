import type { AuthService } from "../services/auth.service.js";
import { type Request, type Response } from "express";
export class AuthController {
  constructor(private authService: AuthService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        ok: true,
        msg: "Usuario creado correctamente",
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor",
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      if (!email || !password)
        return res.status(400).json({ msg: "Campos vacios", ok: false });
      const { user, token } = await this.authService.login(req.body);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      res.status(200).json({ msg: "bienvenido", ok: true, data: user });
    } catch (error) {
      res.status(401).json({ msg: "Error en el inicio de sesion", ok: false });
    }
  };

  public logout = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
      });

      res.status(200).json({
        ok: true,
        msg: "Sesión cerrada correctamente",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error al cerrar sesión",
      });
    }
  };

  public checkAuth = (req: Request, res: Response) => {
    const user = req.user;
    try {
      return res.status(200).json({
        msg: "Usuario logeado",
        ok: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error interno del servidor", ok: false });
    }
  };
}
