import type { IBookRepository, BookData } from "../repositories/interfaces/book.interface.js";
import type { ISubject } from "../observer/subject.js";
import type { BookStatus } from "../models/book.model.js";

export class BookService {
    constructor(
        private bookRepository: IBookRepository,
        private eventPublisher: ISubject
    ) {}

 async getAll() {
    return this.bookRepository.findAll();
 }

 async getById(id: number) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new Error("El libro no existe");
    return book;
 }

 async create(data: BookData) {
    return this.bookRepository.create(data);
 }

 async update(id: number, data: Partial <BookData>) {
    const book = await this.bookRepository.update(id, data);
    if (!book) throw new Error("El libro no existe");
    return book;
 }

  // Cambiar el estado: acá se dispara el Observer
  async changeStatus(id: number, newStatus: BookStatus) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new Error('El libro no existe');
    const previousStatus = book.status;

    if (previousStatus === newStatus) {
      throw new Error(`El libro ya está en estado ${newStatus}`);
    }

    const updated = await this.bookRepository.updateStatus(id, newStatus);
    if (!updated) throw new Error('El libro no existe');

    await this.eventPublisher.notify({
      bookId: book.id,
      bookTitle: book.title,
      previousStatus,
      newStatus,
    });

    return updated;
  }

  async delete(id: number) {
    const deleted = await this.bookRepository.delete(id);
    if (!deleted) throw new Error('El libro no existe');
  }
}
