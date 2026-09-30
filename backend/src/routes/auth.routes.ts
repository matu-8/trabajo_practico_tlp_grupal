import { Router } from "express";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthService } from "../services/auth.service.js";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter: Router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const userController = new AuthController(authService);

authRouter.post("/auth/register", userController.register);
authRouter.post("/auth/login", userController.login);
authRouter.post("/auth/logout", userController.logout);
