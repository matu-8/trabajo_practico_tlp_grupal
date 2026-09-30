import type { Request, Response } from "express";
import type {UserService} from "../services/user.service.js";

export class UserController {
  constructor(private userService: UserService) {}

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAll();
      res.status(200).json({ ok: true, msg: 'Usuarios obtenidos', data: users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
  };

  public getRoles = async (_req: Request, res: Response): Promise<void> => {
    try {
      const roles = await this.userService.getRoles();
      res.status(200).json({ ok: true, msg: 'Roles obtenidos', data: roles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
  };

  public assignRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.assignRole(Number(req.params.id), req.body.roleId);
      res.status(200).json({ ok: true, msg: 'Rol asignado correctamente', data: user });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo asignar el rol';
      res.status(404).json({ ok: false, msg });
    }
  };
}