import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { container } from "../config/container.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";

export const userRouter: Router = Router();

const userController = new UserController(container.userService);

userRouter.get("/users/roles", authMiddleware, userController.getRoles);
userRouter.get("/users", authMiddleware, authorize("list_users"), userController.getAll);
userRouter.put(
  "/users/:id/role",
  authMiddleware,
  authorize("assign_role"),
  userController.assignRole,
);
