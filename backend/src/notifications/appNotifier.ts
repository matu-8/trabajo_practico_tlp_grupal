import type { INotifier } from "./notifier.js";
import type { Notification } from "./notifications.js";
import type { INotificationRepository } from "../repositories/interfaces/notification.interface.js";

export class InAppNotifier implements INotifier {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async send(notification: Notification): Promise<void> {
    await this.notificationRepository.create({
      userId: notification.userId,
      bookId: notification.bookId,
      message: notification.message,
      previousStatus: notification.previousStatus,
      newStatus: notification.newStatus,
    });
  }
}
