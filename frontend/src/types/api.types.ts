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