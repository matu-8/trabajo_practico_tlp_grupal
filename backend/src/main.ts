import "dotenv/config";
import { db, sequelize } from "./config/connectionDb.js";
import { runSeed } from "./config/seed.js";
import { setupAssociations } from "./models/associations.model.js";
import { BookRepository } from "./repositories/book.repository.js";
import { UserRepository } from "./repositories/user.repository.js";
import { RoleRepository } from "./repositories/role.repository.js";
import { NotificationRepository } from "./repositories/notification.repository.js";
import { SubscriptionRepository } from "./repositories/suscripcion.repository.js";
import { EventPublisher } from "./observer/EventPublisher.js";
import { NotifierFactory } from "./notifications/notifierFactory.js";
import { NotificationService } from "./services/notification.service.js";
import { BookService } from "./services/book.service.js";
import { AuthService } from "./services/auth.service.js";
import { SubscriptionService } from "./services/subscription.service.js";
import { UserService } from "./services/user.service.js";
import { AuthController } from "./controllers/auth.controller.js";
import { BookController } from "./controllers/book.controller.js";
import { SubscriptionController } from "./controllers/subscription.controller.js";
import { NotificationController } from "./controllers/notification.controller.js";
import { UserController } from "./controllers/user.controller.js";
import { authorize } from "./middlewares/authorize.js";
import { createApiRouter } from "./routes/index.routes.js";
import { createApp } from "./app.js";

async function main(): Promise<void> {
  // 1. Base de datos
  await db.testConnection();
  setupAssociations();
  await sequelize.sync();
  await runSeed();

  // 2. Repositorios
  const bookRepository = new BookRepository();
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const notificationRepository = new NotificationRepository();
  const subscriptionRepository = new SubscriptionRepository();

  // 3. Observer: el NotificationService escucha los cambios de estado de los libros
  const eventPublisher = new EventPublisher();
  const notifierFactory = new NotifierFactory(notificationRepository);
  const notificationService = new NotificationService(
    subscriptionRepository,
    notificationRepository,
    notifierFactory,
    ["inapp", "console"],
  );
  eventPublisher.attach(notificationService);

  // 4. Services
  const bookService = new BookService(bookRepository, eventPublisher);
  const authService = new AuthService(userRepository, roleRepository);
  const subscriptionService = new SubscriptionService(subscriptionRepository, bookRepository);
  const userService = new UserService(userRepository, roleRepository);

  // 5. Controllers
  const authController = new AuthController(authService);
  const bookController = new BookController(bookService);
  const subscriptionController = new SubscriptionController(subscriptionService);
  const notificationController = new NotificationController(notificationService);
  const userController = new UserController(userService);

  // 6. Router y app
  const apiRouter = createApiRouter(
    {
      auth: authController,
      book: bookController,
      subscription: subscriptionController,
      notification: notificationController,
      user: userController,
    },
    authorize,
  );
  const app = createApp(apiRouter);

  // 7. Servidor
  const port = process.env.API_PORT ?? 3000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
