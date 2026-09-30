import type { BookStatus } from "../models/book.model.js";

export interface BookStatusChangeEvent {
  bookId: number;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
}
