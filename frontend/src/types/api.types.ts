// Única fuente de tipos del contrato con el backend.
// Refleja el contrato { ok, msg, data } documentado en el README del backend.

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  permissions: string[];
}

export interface ApiResponse<T> {
  ok: boolean;
  msg: string;
  data: T;
}

// El backend responde { ok: false, errors: [...] } con express-validator
export interface FieldError {
  path: string;
  msg: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ── Libros ───────────────────────────────────────────────────
export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

export const BOOK_STATUSES: BookStatus[] = [
  "DISPONIBLE",
  "PRESTADO",
  "EN_REPARACION",
];

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

// Datos que envía el frontend para crear o editar un libro
export interface BookInput {
  title: string;
  author: string;
  description: string;
}

// ── Suscripciones ────────────────────────────────────────────
export interface Subscription {
  id: number;
  userId: number;
  bookId: number;
  createdAt: string;
}

// ── Usuarios (admin) ─────────────────────────────────────────
export interface Role {
  id: number;
  name: string;
}

// El listado admin trae el rol anidado, como lo arma Sequelize en el backend
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: Role;
}

// ── Notificaciones ───────────────────────────────────────────
export interface Notification {
  id: number;
  userId: number;
  bookId: number;
  message: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
  read: boolean;
  createdAt: string;
}
