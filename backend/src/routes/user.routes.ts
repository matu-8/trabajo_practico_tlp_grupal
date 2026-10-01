import { Router } from "express";
import { body, param } from "express-validator";
import type { UserController } from "../controllers/user.controller.js";
import type { Authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validation.js";

export function createUserRoutes(controller: UserController, authorize: Authorize): Router {
  const router = Router();

  router.get("/", authenticate, authorize("user:read"), controller.getAll);

  // /roles va antes que las rutas con /:id
  router.get("/roles", authenticate, authorize("user:read"), controller.getRoles);

  router.patch(
    "/:id/role",
    authenticate,
    authorize("user:assign-role"),
    param("id").isInt(),
    body("roleId").isInt().toInt(),
    validate,
    controller.assignRole,
  );

  return router;
}
