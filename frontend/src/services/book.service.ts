import { request } from "./apiClient";
import type {
  ApiResponse,
  Book,
  BookInput,
  BookStatus,
} from "../types/api.types";

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

  // Solo para usuarios con el permiso `create_book`.
  create(input: BookInput) {
    return request<ApiResponse<Book>>("/books", {
      method: "POST",
      body: input,
    });
  },

  // Solo para usuarios con el permiso `update_book`.
  update(id: number, input: Partial<BookInput>) {
    return request<ApiResponse<Book>>(`/books/${id}`, {
      method: "PUT",
      body: input,
    });
  },

  // Solo para usuarios con el permiso `change_status`.
  // Dispara el evento Observer en el backend, que genera las notificaciones.
  changeStatus(id: number, status: BookStatus) {
    return request<ApiResponse<Book>>(`/books/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  // Solo para usuarios con el permiso `delete_book`.
  remove(id: number) {
    return request<ApiResponse<null>>(`/books/${id}`, {
      method: "DELETE",
    });
  },
};
