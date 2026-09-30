import type { ISubscriptionRepository } from "../repositories/interfaces/suscripcion.interface.js";
import type { IBookRepository } from "../repositories/interfaces/book.interface.js";


export class SubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private bookRepository: IBookRepository
  ) {}

  async subscribe(userId: number, bookId: number) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error('El libro no existe');

    const alreadySubscribed = await this.subscriptionRepository.exists(userId, bookId);
    if (alreadySubscribed) throw new Error('Ya estás suscripto a este libro');

    return this.subscriptionRepository.create(userId, bookId);
  }

  async unsubscribe(userId: number, bookId: number) {
    const deleted = await this.subscriptionRepository.delete(userId, bookId);
    if (!deleted) throw new Error('No estás suscripto a este libro');
  }

  // Para que el frontend sepa si mostrar "Suscribirse" o "Desuscribirse"
  async isSubscribed(userId: number, bookId: number) {
    return this.subscriptionRepository.exists(userId, bookId);
  }
}