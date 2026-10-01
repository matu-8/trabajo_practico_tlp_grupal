import { Router } from "express";
import { body, param } from "express-validator";
import type { BookController } from "../controllers/book.controller.js";
import type { Authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validation.js";

export function createBookRoutes(controller: BookController, authorize: Authorize): Router {
  const router = Router();

  router.get("/", authenticate, authorize("book:read"), controller.getAll);

  router.get(
    "/:id",
    authenticate,
    authorize("book:read"),
    param("id").isInt(),
    validate,
    controller.getById,
  );

  router.post(
    "/",
    authenticate,
    authorize("book:create"),
    body("title").isString().trim().notEmpty(),
    body("author").isString().trim().notEmpty(),
    body("description").isString().trim().notEmpty(),
    validate,
    controller.create,
  );

  router.put(
    "/:id",
    authenticate,
    authorize("book:update"),
    param("id").isInt(),
    body("title").optional().isString().trim().notEmpty(),
    body("author").optional().isString().trim().notEmpty(),
    body("description").optional().isString().trim().notEmpty(),
    validate,
    controller.update,
  );

  router.patch(
    "/:id/status",
    authenticate,
    authorize("book:change-status"),
    param("id").isInt(),
    body("status").isIn(["DISPONIBLE", "PRESTADO", "EN_REPARACION"]),
    validate,
    controller.changeStatus,
  );

  router.delete(
    "/:id",
    authenticate,
    authorize("book:delete"),
    param("id").isInt(),
    validate,
    controller.delete,
  );

  return router;
}
