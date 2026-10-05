import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NotificationsContext } from "./notifications.context";
import type { NotificationsContextType } from "./notifications.context";
import { notificationService } from "../services/notification.service";
import { getErrorMessage } from "../services/apiClient";
import { useAuth } from "../hooks/useAuth";
import type { Notification } from "../types/api.types";

/**
 * Estado global de las notificaciones. Es un contexto y no un hook suelto
 * porque la campana vive en el layout, pero la bandeja está en otra ruta:
 * ambas necesitan los mismos datos.
 */
export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // Sin sesión no hay nada que mostrar: se evita pedirle datos al backend
  const userId = user?.id ?? null;
  const [state, setState] = useState<{
    userId: number | null;
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
  }>({
    userId: null,
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const [list, unread] = await Promise.all([
        notificationService.getAll(),
        notificationService.countUnread(),
      ]);
      setState({
        userId,
        notifications: list.data,
        unreadCount: unread.data.count,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        userId,
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: getErrorMessage(err),
      });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setState({
        userId: null,
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
      });
      return;
    }
    refresh();
  }, [userId, refresh]);

  const markAsRead = useCallback(
    async (id: number) => {
      // Se actualiza de forma optimista para que la UI responda al instante
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));

      try {
        await notificationService.markAsRead(id);
      } catch (err) {
        setState((prev) => ({ ...prev, error: getErrorMessage(err) }));
        refresh();
      }
    },
    [refresh],
  );

  // Los datos guardados corresponden al usuario de esta vista; si cambió de
  // usuario, todavía no hay datos válidos para mostrar.
  const value = useMemo<NotificationsContextType>(() => {
    const isCurrent = state.userId === userId;
    return {
      notifications: isCurrent ? state.notifications : [],
      unreadCount: isCurrent ? state.unreadCount : 0,
      isLoading: userId !== null && !isCurrent,
      error: isCurrent ? state.error : null,
      refresh,
      markAsRead,
    };
  }, [state, userId, refresh, markAsRead]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
