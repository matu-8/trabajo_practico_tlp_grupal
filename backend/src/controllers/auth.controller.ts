import type { AuthService } from "../services/auth.service.js";
import { type Request, type Response } from "express";
import { sendError } from "../errors/httpError.js";

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
      // sendError respeta el status del HttpError (409, etc.)
      sendError(res, error);
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
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60,
      });
      res.status(200).json({
        msg: "Inicio de sesión exitoso",
        ok: true,
        data: user,
      });
    } catch (error) {
      sendError(res, error);
    }
  };

  public logout = async (_req: Request, res: Response): Promise<void> => {
    // Se usan las mismas opciones con las que se creó la cookie,
    // porque si no el navegador no la termina eliminando
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      ok: true,
      msg: "Sesión cerrada correctamente",
    });
  };

  public checkAuth = (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({
        msg: "No autenticado",
        ok: false,
      });
      return;
    }

    // Se listan los campos a mano para no filtrar los del JWT (iat, exp)
    const { id, name, email, roleId, permissions } = req.user;

    res.status(200).json({
      msg: "Usuario logeado",
      ok: true,
      data: { id, name, email, roleId, permissions },
    });
  };
}
