import { Router } from "express";
import { param } from "express-validator";
import type { NotificationController } from "../controllers/notification.controller.js";
import type { Authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validation.js";

export function createNotificationRoutes(
  controller: NotificationController,
  authorize: Authorize,
): Router {
  const router = Router();

  router.get("/", authenticate, authorize("notification:read"), controller.getAll);

  router.get(
    "/unread-count",
    authenticate,
    authorize("notification:read"),
    controller.countUnread,
  );

  router.patch(
    "/:id/read",
    authenticate,
    authorize("notification:read"),
    param("id").isInt(),
    validate,
    controller.markAsRead,
  );

  return router;
}
