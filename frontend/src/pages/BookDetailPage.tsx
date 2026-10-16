import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useBook } from "../hooks/useBook";
import { useSubscription } from "../hooks/useSubscription";
import { useNotifications } from "../hooks/useNotifications";
import { bookService } from "../services/book.service";
import { getErrorMessage } from "../services/apiClient";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Loader } from "../components/Loader";
import { useCan } from "../hooks/useCan";
import { BookFormModal } from "../components/books/BookFormModal";
import { BookStatusBadge } from "../components/books/BookStatusBadge";
import { BOOK_STATUSES } from "../types/api.types";
import type { BookStatus } from "../types/api.types";

/** Solo los usuarios con este permiso pueden cambiar el estado */
const CHANGE_STATUS_PERMISSION = "change_status";

export const BookDetailPage = () => {
  const { id } = useParams();
  const bookId = id ? Number(id) : null;
  const navigate = useNavigate();

  const { book, isLoading, error, reload } = useBook(bookId);
  const {
    isSubscribed,
    isSubmitting,
    error: subscriptionError,
    subscribe,
    unsubscribe,
  } = useSubscription(bookId ?? 0);
  const { refresh: refreshNotifications } = useNotifications();

  const canChangeStatus = useCan("change_status");
  const canUpdate = useCan("update_book");
  const canDelete = useCan("delete_book");

  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{book.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{book.author}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BookStatusBadge status={book.status} />
            {(canUpdate || canDelete) && (
              <div className="flex gap-2">
                {canUpdate && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-auto px-3 py-1.5 text-xs"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
                {canDelete && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-auto px-3 py-1.5 text-xs"
                    onClick={() => {
                      setDeleteError(null);
                      setIsDeleting(true);
                    }}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
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

      {isEditing && (
        <BookFormModal
          book={book}
          onClose={() => setIsEditing(false)}
          onSaved={async () => {
            setIsEditing(false);
            await reload();
          }}
        />
      )}

      {isDeleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setIsDeleting(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-800">Eliminar libro</h2>
            <p className="mt-2 text-sm text-slate-600">
              ¿Seguro que querés eliminar{" "}
              <strong className="text-slate-800">{book.title}</strong>? Esta
              acción no se puede deshacer.
            </p>

            {deleteError && (
              <div className="mt-3">
                <Alert variant="error">{deleteError}</Alert>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                className="w-auto"
                onClick={() => setIsDeleting(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="w-auto"
                disabled={isSaving}
                onClick={async () => {
                  setIsSaving(true);
                  setDeleteError(null);
                  try {
                    await bookService.remove(book.id);
                    navigate("/books");
                  } catch (err) {
                    setDeleteError(getErrorMessage(err));
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                {isSaving ? "Eliminando…" : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
