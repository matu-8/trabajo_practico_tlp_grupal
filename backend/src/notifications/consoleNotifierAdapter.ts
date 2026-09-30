import type { INotifier } from "./notifier.js";
import type { Notification } from "./notifications.js";

export class ConsoleNotifierAdapter implements INotifier {
  async send(notification: Notification): Promise<void> {
    const text = this.format(notification);
    console.log(text);
  }

  private format(notification: Notification): string {
    return (
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | ` +
      `Libro #${notification.bookId} "${notification.bookTitle}" | ` +
      `Estado: ${notification.previousStatus} → ${notification.newStatus}`
    );
  }
}
