import type { IObserver } from "../observer/observer.js";
import type { BookStatusChangeEvent } from "../observer/bookStatusChangedEvent.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/suscripcion.interface.js";
import type { INotificationRepository } from "../repositories/interfaces/notification.interface.js";
import type { INotifier } from "../notifications/notifier.js";
import type { Notification } from "../notifications/notifications.js";
import type {
  NotifierFactory,
  NotifierType,
} from "../notifications/notifierFactory.js";


export class NotificationService implements IObserver {
  private subscriptionRepository: ISubscriptionRepository;
  private notificationRepository: INotificationRepository;
  private notifiers: INotifier[];

  constructor(
    subscriptionRepository: ISubscriptionRepository,
    notificationRepository: INotificationRepository,
    notifierFactory: NotifierFactory,
    channels: NotifierType[],
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.notificationRepository = notificationRepository;
    this.notifiers = channels.map((channel) => notifierFactory.create(channel));
  }

  // ── Parte Observer: lo llama EventPublisher.notify() ──
  async update(event: BookStatusChangeEvent): Promise<void> {
    const subscribers = await this.subscriptionRepository.findSubscribersByBook(
      event.bookId,
    );

    for (const user of subscribers) {
      const notification: Notification = {
        userId: user.id,
        userEmail: user.email,
        bookId: event.bookId,
        bookTitle: event.bookTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        message: `El libro "${event.bookTitle}" pasó de ${event.previousStatus} a ${event.newStatus}`,
      };

      for (const notifier of this.notifiers) {
        await notifier.send(notification);
      }
    }
  }

  // ── Parte bandeja: la usa el NotificationController ──
  async getByUser(userId: number) {
    return this.notificationRepository.findByUser(userId);
  }

  async countUnread(userId: number) {
    return this.notificationRepository.countUnread(userId);
  }

  async markAsRead(id: number, userId: number) {
    const updated = await this.notificationRepository.markAsRead(id, userId);
    if (!updated) {
      throw new Error("La notificación no existe");
    }
  }
}
