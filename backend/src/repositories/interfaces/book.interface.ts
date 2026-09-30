import { Book } from "../../models/book.model.js";
import type { BookStatus } from "../../models/book.model.js";

export interface BookData {
  title: string;
  author: string;
  description: string;
}

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  create(data: BookData): Promise<Book>;
  update(id: number, data: Partial<BookData>): Promise<Book | null>;
  updateStatus(id: number, status: BookStatus): Promise<Book | null>;
  delete(id: number): Promise<boolean>;
}
