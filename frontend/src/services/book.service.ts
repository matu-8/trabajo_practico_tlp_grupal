import { request } from "./apiClient";
import type { ApiResponse, Book, BookStatus } from "../types/api.types";

/**
 * Datos del módulo de libros.
 * Los nombres coinciden con los métodos del `BookService` del backend.
 */
export const bookService = {
  getAll() {
    return request<ApiResponse<Book[]>>("/books");
  },

  getById(id: number) {
    return request<ApiResponse<Book>>(`/books/${id}`);
  },

  // Solo para usuarios con el permiso `change_status`.
  // Dispara el evento Observer en el backend, que genera las notificaciones.
  changeStatus(id: number, status: BookStatus) {
    return request<ApiResponse<Book>>(`/books/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },
};
