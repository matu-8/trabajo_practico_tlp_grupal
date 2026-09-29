import { Book } from "../models/book.model.js";
import type { BookStatus } from "../models/book.model.js";
import type { IBookRepository, BookData } from "./interfaces/book.interface.js";

export class BookRepository implements IBookRepository {
  async findAll(): Promise<Book[]> {
    return Book.findAll({ order: [["createdAt", "DESC"]] });
  }

  async findById(id: number): Promise<Book | null> {
    return Book.findByPk(id);
  }

  async create(data: BookData): Promise<Book> {
    return Book.create({ ...data });
  }

  async update(id: number, data: Partial<BookData>): Promise<Book | null> {
    const book = await Book.findByPk(id);
    if (!book) return null;
    return book.update(data);
  }

  async updateStatus(id: number, status: BookStatus): Promise<Book | null> {
    const book = await Book.findByPk(id);
    if (!book) return null;
    return book.update({ status });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Book.destroy({ where: { id } });
    return deleted > 0;
  }
}
