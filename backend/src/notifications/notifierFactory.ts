import type { INotifier } from "./notifier.js";
import type { INotificationRepository } from "../repositories/interfaces/notification.interface.js";
import { InAppNotifier } from "./appNotifier.js";
import { ConsoleNotifierAdapter } from "./consoleNotifierAdapter.js";

export type NotifierType = "inapp" | "console";

export class NotifierFactory {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  create(type: NotifierType): INotifier {
    switch (type) {
      case "inapp":
        return new InAppNotifier(this.notificationRepository);
      case "console":
        return new ConsoleNotifierAdapter();
    }
  }
}
