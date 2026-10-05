import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller.js";
import { container } from "../config/container.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const subscriptionRouter: Router = Router();

const subscriptionController = new SubscriptionController(
  container.subscriptionService,
);

subscriptionRouter.get(
  "/subscriptions/:bookId/status",
  authMiddleware,
  subscriptionController.status,
);
subscriptionRouter.post(
  "/subscriptions/:bookId",
  authMiddleware,
  subscriptionController.subscribe,
);
subscriptionRouter.delete(
  "/subscriptions/:bookId",
  authMiddleware,
  subscriptionController.unsubscribe,
);
