import { BookRepository } from "../repositories/book.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { RoleRepository } from "../repositories/role.repository.js";
import { SubscriptionRepository } from "../repositories/suscripcion.repository.js";
import { NotificationRepository } from "../repositories/notification.repository.js";
import { AuthService } from "../services/auth.service.js";
import { BookService } from "../services/book.service.js";
import { SubscriptionService } from "../services/subscription.service.js";
import { NotificationService } from "../services/notification.service.js";
import { UserService } from "../services/user.service.js";
import { EventPublisher } from "../observer/EventPublisher.js";
import { NotifierFactory } from "../notifications/notifierFactory.js";

// ── Repositorios ─────────────────────────────────────────────
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const bookRepository = new BookRepository();
const subscriptionRepository = new SubscriptionRepository();
const notificationRepository = new NotificationRepository();

// ── Notificaciones: Factory + Strategy ────────────────────────
const notifierFactory = new NotifierFactory(notificationRepository);
const notificationService = new NotificationService(
  subscriptionRepository,
  notificationRepository,
  notifierFactory,
  ["inapp", "console"],
);

// ── Observer: aquí se conecta el Publicador con el Observador ──
const eventPublisher = new EventPublisher();
eventPublisher.attach(notificationService);

// ── Servicios (reciben sus dependencias por constructor) ─────
const authService = new AuthService(userRepository, roleRepository);
const bookService = new BookService(bookRepository, eventPublisher);
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  bookRepository,
);
const userService = new UserService(userRepository, roleRepository);

// Un único lugar donde quedan instancias los servicios, para que las
// rutas solo se limitar a declararlas
export const container = {
  authService,
  bookService,
  subscriptionService,
  notificationService,
  userService,
} as const;
