import type { Request, Response } from "express";
import type { BookService } from "../services/book.service.js";
import type { BookData } from "../repositories/interfaces/book.interface.js";
import { sendError } from "../errors/httpError.js";

export class BookController {
  constructor(private bookService: BookService) {}

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAll();
      res.status(200).json({ ok: true, msg: "Libros obtenidos", data: books });
    } catch (error) {
      sendError(res, error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.getById(Number(req.params.id));
      res.status(200).json({ ok: true, msg: "Libro obtenido", data: book });
    } catch (error) {
      // sendError respeta el 404 del HttpError del servicio
      sendError(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, author, description } = req.body;
      const book = await this.bookService.create({
        title,
        author,
        description,
      });
      res.status(201).json({
        ok: true,
        msg: "Libro creado correctamente",
        data: book,
      });
    } catch (error) {
      sendError(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, author, description } = req.body;
      const data: Partial<BookData> = {};
      if (title !== undefined) data.title = title;
      if (author !== undefined) data.author = author;
      if (description !== undefined) data.description = description;

      const book = await this.bookService.update(Number(req.params.id), data);
      res.status(200).json({ ok: true, msg: "Libro actualizado", data: book });
    } catch (error) {
      sendError(res, error);
    }
  };

  public changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.changeStatus(
        Number(req.params.id),
        req.body.status,
      );
      res.status(200).json({ ok: true, msg: "Estado actualizado", data: book });
    } catch (error) {
      // El servicio lanza 400 para un estado inválido y 404 si no existe
      sendError(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookService.delete(Number(req.params.id));
      res.status(200).json({ ok: true, msg: "Libro eliminado" });
    } catch (error) {
      sendError(res, error);
    }
  };
}