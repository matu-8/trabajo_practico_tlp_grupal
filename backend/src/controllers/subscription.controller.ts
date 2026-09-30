import type {Request, Response} from "express";
import type { SubscriptionService } from "../services/subscription.service.js";

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  public status = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ ok: false, msg: 'No autenticado' });
      return;
    }

    try {
      const subscribed = await this.subscriptionService.isSubscribed(userId, Number(req.params.bookId));
      res.status(200).json({ ok: true, msg: 'Estado de suscripción', data: { subscribed } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
  };

  public subscribe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ ok: false, msg: 'No autenticado' });
      return;
    }

    try {
      const subscription = await this.subscriptionService.subscribe(userId, Number(req.params.bookId));
      res.status(201).json({ ok: true, msg: 'Suscripción creada', data: subscription });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo suscribir';
      res.status(409).json({ ok: false, msg });
    }
  };

  public unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ ok: false, msg: 'No autenticado' });
      return;
    }

    try {
      await this.subscriptionService.unsubscribe(userId, Number(req.params.bookId));
      res.status(200).json({ ok: true, msg: 'Suscripción eliminada' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No estás suscripto';
      res.status(404).json({ ok: false, msg });
    }
  };
}