import { NotificationModel } from "../../models/notification.model.js";
import type { BookStatus } from "../../models/book.model.js";

export interface CreateNotificationData {
  userId: number;
  bookId: number;
  message: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
}

export interface INotificationRepository {
  create(data: CreateNotificationData): Promise<NotificationModel>;
  findByUser(userId: number): Promise<NotificationModel[]>;
  countUnread(userId: number): Promise<number>;
  markAsRead(id: number, userId: number): Promise<boolean>;
}
