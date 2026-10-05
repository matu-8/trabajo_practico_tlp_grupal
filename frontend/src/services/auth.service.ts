import { request } from "./apiClient";
import type { ApiResponse, LoginInput, RegisterInput, User } from "../types/api.types";

/**
 * Datos del módulo de autenticación.
 * Los nombres coinciden con los métodos del `AuthService` del backend.
 */
export const authService = {
  register(input: RegisterInput) {
    return request<ApiResponse<User>>("/auth/register", {
      method: "POST",
      body: input,
    });
  },

  login(input: LoginInput) {
    return request<ApiResponse<User>>("/auth/login", {
      method: "POST",
      body: input,
    });
  },

  logout() {
    return request<ApiResponse<null>>("/auth/logout", { method: "POST" });
  },

  check() {
    return request<ApiResponse<User>>("/auth/check");
  },
};