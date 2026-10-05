import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { container } from "../config/container.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const notificationRouter: Router = Router();

const notificationController = new NotificationController(
  container.notificationService,
);

notificationRouter.get(
  "/notifications",
  authMiddleware,
  notificationController.getAll,
);
notificationRouter.get(
  "/notifications/unread",
  authMiddleware,
  notificationController.countUnread,
);
notificationRouter.patch(
  "/notifications/:id/read",
  authMiddleware,
  notificationController.markAsRead,
);
