import type { Request, Response } from "express";
import type { BookService } from "../services/book.service.js";
import type { BookData } from "../repositories/interfaces/book.interface.js";

export class BookController {
  constructor(private bookService: BookService) {}

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAll();
      res.status(200).json({ ok: true, msg: 'Libros obtenidos', data: books });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.getById(Number(req.params.id));
      res.status(200).json({ ok: true, msg: 'Libro obtenido', data: book });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Libro no encontrado';
      res.status(404).json({ ok: false, msg });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, author, description } = req.body;
      const book = await this.bookService.create({ title, author, description });
      res.status(201).json({ ok: true, msg: 'Libro creado correctamente', data: book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
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
      res.status(200).json({ ok: true, msg: 'Libro actualizado', data: book });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Libro no encontrado';
      res.status(404).json({ ok: false, msg });
    }
  };

  public changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.changeStatus(Number(req.params.id), req.body.status);
      res.status(200).json({ ok: true, msg: 'Estado actualizado', data: book });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo cambiar el estado';
      res.status(400).json({ ok: false, msg });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookService.delete(Number(req.params.id));
      res.status(200).json({ ok: true, msg: 'Libro eliminado' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Libro no encontrado';
      res.status(404).json({ ok: false, msg });
    }
  };
}