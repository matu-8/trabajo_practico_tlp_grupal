import { request } from "./apiClient";
import type { ApiResponse, AdminUser, Role } from "../types/api.types";

/**
 * Datos del módulo de administración de usuarios.
 * Los endpoints existen en el backend pero requieren permisos:
 * `list_users` para listar y `assign_role` para cambiar el rol.
 */
export const userService = {
  getAll() {
    return request<ApiResponse<AdminUser[]>>("/users");
  },

  getRoles() {
    return request<ApiResponse<Role[]>>("/users/roles");
  },

  assignRole(userId: number, roleId: number) {
    return request<ApiResponse<AdminUser>>(`/users/${userId}/role`, {
      method: "PUT",
      body: { roleId },
    });
  },
};
