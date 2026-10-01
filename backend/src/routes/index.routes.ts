import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import type { BookController } from "../controllers/book.controller.js";
import type { SubscriptionController } from "../controllers/subscription.controller.js";
import type { NotificationController } from "../controllers/notification.controller.js";
import type { UserController } from "../controllers/user.controller.js";
import type { Authorize } from "../middlewares/authorize.js";
import { createAuthRoutes } from "./auth.routes.js";
import { createBookRoutes } from "./book.routes.js";
import { createSubscriptionRoutes } from "./subscription.routes.js";
import { createNotificationRoutes } from "./notification.routes.js";
import { createUserRoutes } from "./user.routes.js";

export interface ApiControllers {
  auth: AuthController;
  book: BookController;
  subscription: SubscriptionController;
  notification: NotificationController;
  user: UserController;
}

export function createApiRouter(controllers: ApiControllers, authorize: Authorize): Router {
  const router = Router();

  router.use("/auth", createAuthRoutes(controllers.auth));
  router.use("/books", createBookRoutes(controllers.book, authorize));
  router.use("/subscriptions", createSubscriptionRoutes(controllers.subscription, authorize));
  router.use("/notifications", createNotificationRoutes(controllers.notification, authorize));
  router.use("/users", createUserRoutes(controllers.user, authorize));

  return router;
}
