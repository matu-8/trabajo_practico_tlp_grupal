import { Router } from "express";
import { body } from "express-validator";
import type { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.js";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.post(
    "/register",
    body("name").isString().trim().notEmpty(),
    body("email").isEmail(),
    body("password").isString().notEmpty(),
    validate,
    controller.register,
  );

  router.post(
    "/login",
    body("email").isEmail(),
    body("password").isString().notEmpty(),
    validate,
    controller.login,
  );

  router.post("/logout", controller.logout);

  return router;
}
