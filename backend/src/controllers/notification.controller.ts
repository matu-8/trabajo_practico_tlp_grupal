import type {Request, Response} from "express";
import type {NotificationService} from "../services/notification.service.js";export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ ok: false, msg: 'No autenticado' });
      return;
    }

    try {
      const notifications = await this.notificationService.getByUser(userId);
      res.status(200).json({ ok: true, msg: 'Notificaciones obtenidas', data: notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
  };

  public countUnread = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ ok: false, msg: 'No autenticado' });
      return;
    }

    try {
      const count = await this.notificationService.countUnread(userId);
      res.status(200).json({ ok: true, msg: 'Cantidad de no leídas', data: { count } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ ok: false, msg: 'No autenticado' });
      return;
    }

    try {
      await this.notificationService.markAsRead(Number(req.params.id), userId);
      res.status(200).json({ ok: true, msg: 'Notificación marcada como leída' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo marcar la notificación';
      res.status(404).json({ ok: false, msg });
    }
  };
}