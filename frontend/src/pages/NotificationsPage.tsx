import { Link } from "react-router";
import { useNotifications } from "../hooks/useNotifications";
import { Alert } from "../components/Alert";
import { Loader } from "../components/Loader";
import { BookStatusBadge } from "../components/books/BookStatusBadge";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

export const NotificationsPage = () => {
  const { notifications, isLoading, error, markAsRead } = useNotifications();

  if (isLoading) return <Loader />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Notificaciones</h1>

      {error && (
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {!error && notifications.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          Todavía no tenés notificaciones. Suscribite a un libro para recibir
          avisos cuando cambie su estado.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`rounded-xl border p-5 ${
              notification.read
                ? "border-slate-200 bg-white"
                : "border-indigo-200 bg-indigo-50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-sm text-slate-700">{notification.message}</p>
              {!notification.read && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                  Nueva
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <BookStatusBadge status={notification.newStatus} />
              <time className="text-xs text-slate-500">
                {formatDate(notification.createdAt)}
              </time>

              <Link
                to={`/books/${notification.bookId}`}
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                Ver el libro
              </Link>

              {!notification.read && (
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className="ml-auto text-xs font-medium text-slate-600 hover:underline"
                >
                  Marcar como leída
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};
