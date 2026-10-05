import type { IBookRepository, BookData } from "../repositories/interfaces/book.interface.js";
import type { ISubject } from "../observer/subject.js";
import type { BookStatus } from "../models/book.model.js";
import { HttpError } from "../errors/httpError.js";


const VALID_STATUSES: BookStatus[] = ['DISPONIBLE', 'PRESTADO', 'EN_REPARACION'];


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
    if (!book) throw new HttpError(404, "El libro no existe");
    return book;
  }

  async create(data: BookData) {
    return this.bookRepository.create(data);
  }

  async update(id: number, data: Partial <BookData>) {
    const book = await this.bookRepository.update(id, data);
    if (!book) throw new HttpError(404, "El libro no existe");
    return book;
  }

async changeStatus(id: number, newStatus: BookStatus) {
    if (!VALID_STATUSES.includes(newStatus)) {
      throw new HttpError(400, `Estado inválido. Valores posibles: ${VALID_STATUSES.join(', ')}`);
    }

    const book = await this.bookRepository.findById(id);
    if (!book) throw new HttpError(404, 'El libro no existe');
    const previousStatus = book.status;

    if (previousStatus === newStatus) {
      throw new HttpError(400, `El libro ya está en estado ${newStatus}`);
    }

    const updated = await this.bookRepository.updateStatus(id, newStatus);
    if (!updated) throw new HttpError(404, 'El libro no existe');

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
    if (!deleted) throw new HttpError(404, "El libro no existe");
  }
}
