import { Subscription } from "../models/suscription.model.js";
import { User } from "../models/user.model.js";
import type { ISubscriptionRepository } from "./interfaces/suscripcion.interface.js";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(userId: number, bookId: number): Promise<Subscription> {
    return Subscription.create({ userId, bookId });
  }

  async delete(userId: number, bookId: number): Promise<boolean> {
    const deleted = await Subscription.destroy({ where: { userId, bookId } });
    return deleted > 0;
  }

  async exists(userId: number, bookId: number): Promise<boolean> {
    const sub = await Subscription.findOne({ where: { userId, bookId } });
    return sub !== null;
  }

  async findSubscribersByBook(bookId: number): Promise<User[]> {
    const subs = await Subscription.findAll({ where: { bookId } });
    const userIds = subs.map((sub) => sub.userId);
    return User.findAll({
      where: { id: userIds },
      attributes: { exclude: ["password"] },
    });
  }
}
