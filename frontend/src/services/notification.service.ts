import { request } from "./apiClient";
import type { ApiResponse, Notification } from "../types/api.types";

/**
 * Datos de la bandeja de notificaciones del usuario autenticado.
 */
export const notificationService = {
  getAll() {
    return request<ApiResponse<Notification[]>>("/notifications");
  },

  countUnread() {
    return request<ApiResponse<{ count: number }>>("/notifications/unread");
  },

  markAsRead(id: number) {
    return request<ApiResponse<null>>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  },
};
