import { createContext } from "react";
import type { Notification } from "../types/api.types";

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  /** Vuelve a pedir la lista y el contador al backend */
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
}

export const NotificationsContext =
  createContext<NotificationsContextType | null>(null);
