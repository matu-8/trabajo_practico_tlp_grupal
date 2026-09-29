import { NotificationModel } from "../models/notification.model.js";
import type {
  INotificationRepository,
  CreateNotificationData,
} from "./interfaces/notification.interface.js";

export class NotificationRepository implements INotificationRepository {
  // Lo usa InAppNotifier para guardar la notificación
  async create(data: CreateNotificationData): Promise<NotificationModel> {
    return NotificationModel.create({ ...data });
  }

  async findByUser(userId: number): Promise<NotificationModel[]> {
    return NotificationModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  // Para el contador de la campanita
  async countUnread(userId: number): Promise<number> {
    return NotificationModel.count({ where: { userId, read: false } });
  }

  // El userId en el where hace que cada uno solo pueda marcar las suyas
  async markAsRead(id: number, userId: number): Promise<boolean> {
    const [updated] = await NotificationModel.update(
      { read: true },
      { where: { id, userId } },
    );
    return updated > 0;
  }
}
