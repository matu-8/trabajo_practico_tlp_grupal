import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { container } from "../config/container.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter: Router = Router();

const authController = new AuthController(container.authService);

authRouter.post("/auth/register", authController.register);
authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/logout", authController.logout);
authRouter.get("/auth/check", authMiddleware, authController.checkAuth);
