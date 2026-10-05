import { useState } from "react";
import { useParams, Link } from "react-router";
import { useBook } from "../hooks/useBook";
import { useSubscription } from "../hooks/useSubscription";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { bookService } from "../services/book.service";
import { getErrorMessage } from "../services/apiClient";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Loader } from "../components/Loader";
import { BookStatusBadge } from "../components/books/BookStatusBadge";
import { BOOK_STATUSES } from "../types/api.types";
import type { BookStatus } from "../types/api.types";

/** Solo los usuarios con este permiso pueden cambiar el estado */
const CHANGE_STATUS_PERMISSION = "change_status";

export const BookDetailPage = () => {
  const { id } = useParams();
  const bookId = id ? Number(id) : null;

  const { user } = useAuth();
  const { book, isLoading, error, reload } = useBook(bookId);
  const {
    isSubscribed,
    isSubmitting,
    error: subscriptionError,
    subscribe,
    unsubscribe,
  } = useSubscription(bookId ?? 0);
  const { refresh: refreshNotifications } = useNotifications();

  const canChangeStatus =
    user?.permissions.includes(CHANGE_STATUS_PERMISSION) ?? false;

  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return <Loader />;

  if (error || !book) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Alert variant="error">{error ?? "Libro no encontrado"}</Alert>
        <Link
          to="/books"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          Volver al listado
        </Link>
      </main>
    );
  }

  const handleStatusChange = async (status: BookStatus) => {
    setStatusError(null);
    setIsSaving(true);
    try {
      await bookService.changeStatus(book.id, status);
      await reload();
      // El backend ya notificó a los suscriptores: se refresca la campana
      await refreshNotifications();
    } catch (err) {
      setStatusError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/books"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Volver al listado
      </Link>

      <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">{book.title}</h1>
          <BookStatusBadge status={book.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
        <p className="mt-5 leading-relaxed text-slate-700">
          {book.description}
        </p>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-semibold text-slate-800">
            Seguimiento
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Suscribite para recibir una notificación cuando cambie el estado de
            este libro.
          </p>

          {subscriptionError && (
            <div className="mt-3">
              <Alert variant="error">{subscriptionError}</Alert>
            </div>
          )}

          <Button
            type="button"
            variant={isSubscribed ? "secondary" : "primary"}
            className="mt-4 max-w-xs"
            disabled={isSubmitting}
            onClick={isSubscribed ? unsubscribe : subscribe}
          >
            {isSubscribed ? "Desuscribirme" : "Suscribirme"}
          </Button>
        </div>

        {canChangeStatus && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-semibold text-slate-800">
              Cambiar estado
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visible porque tu rol tiene el permiso{" "}
              <code className="rounded bg-slate-100 px-1">
                {CHANGE_STATUS_PERMISSION}
              </code>
              . Al guardar, los suscriptores reciben la notificación.
            </p>

            {statusError && (
              <div className="mt-3">
                <Alert variant="error">{statusError}</Alert>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {BOOK_STATUSES.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={status === book.status ? "primary" : "secondary"}
                  className="w-auto"
                  disabled={status === book.status || isSaving}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
};
