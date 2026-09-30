import type { Notification } from "./notifications.js";

export interface INotifier {
  send(notification: Notification): Promise<void>;
}
