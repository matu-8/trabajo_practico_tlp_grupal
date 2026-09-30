import type { BookStatus } from "../models/book.model.js";

export interface Notification {
  userId: number;
  userEmail: string;
  bookId: number;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
  message: string;
}
