import { Router } from "express";
import { param } from "express-validator";
import type { SubscriptionController } from "../controllers/subscription.controller.js";
import type { Authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validation.js";

export function createSubscriptionRoutes(
  controller: SubscriptionController,
  authorize: Authorize,
): Router {
  const router = Router();

  router.get(
    "/:bookId",
    authenticate,
    authorize("book:read"),
    param("bookId").isInt(),
    validate,
    controller.status,
  );

  router.post(
    "/:bookId",
    authenticate,
    authorize("subscription:create"),
    param("bookId").isInt(),
    validate,
    controller.subscribe,
  );

  router.delete(
    "/:bookId",
    authenticate,
    authorize("subscription:delete"),
    param("bookId").isInt(),
    validate,
    controller.unsubscribe,
  );

  return router;
}
