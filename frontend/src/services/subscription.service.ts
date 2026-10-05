import { request } from "./apiClient";
import type { ApiResponse, Subscription } from "../types/api.types";

/**
 * Datos del módulo de suscripciones: seguir un libro para recibir
 * avisos cuando cambie su estado.
 */
export const subscriptionService = {
  // Dice si el usuario ya está suscripto, para mostrar el botón correcto
  isSubscribed(bookId: number) {
    return request<ApiResponse<{ subscribed: boolean }>>(
      `/subscriptions/${bookId}/status`,
    );
  },

  subscribe(bookId: number) {
    return request<ApiResponse<Subscription>>(`/subscriptions/${bookId}`, {
      method: "POST",
    });
  },

  unsubscribe(bookId: number) {
    return request<ApiResponse<null>>(`/subscriptions/${bookId}`, {
      method: "DELETE",
    });
  },
};
