import { Subscription } from "../../models/suscription.model.js";
import { User } from "../../models/user.model.js";

export interface ISubscriptionRepository {
  create(userId: number, bookId: number): Promise<Subscription>;
  delete(userId: number, bookId: number): Promise<boolean>;
  exists(userId: number, bookId: number): Promise<boolean>;
  findSubscribersByBook(bookId: number): Promise<User[]>;
}
