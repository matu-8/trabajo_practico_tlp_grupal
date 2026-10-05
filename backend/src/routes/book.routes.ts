import { Router } from "express";
import { BookController } from "../controllers/book.controller.js";
import { container } from "../config/container.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";

export const bookRouter: Router = Router();

const bookController = new BookController(container.bookService);

bookRouter.get("/books", authMiddleware, bookController.getAll);
bookRouter.get("/books/:id", authMiddleware, bookController.getById);

// Cambiar el estado dispara el evento del patrón Observer, que es lo
// que genera las notificaciones de los suscriptores
bookRouter.patch(
  "/books/:id/status",
  authMiddleware,
  authorize("change_status"),
  bookController.changeStatus,
);
