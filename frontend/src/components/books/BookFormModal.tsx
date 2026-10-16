import { useState, type FormEvent } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Alert } from "../Alert";
import { bookService } from "../../services/book.service";
import { getErrorMessage } from "../../services/apiClient";
import type { Book, BookInput } from "../../types/api.types";

interface BookFormModalProps {
  /** Libro a editar; si no viene, el modal crea uno nuevo */
  book?: Book;
  onClose: () => void;
  onSaved: (book: Book) => void;
}

const EMPTY_FORM: BookInput = {
  title: "",
  author: "",
  description: "",
};

/** Modal simple para crear o editar un libro */
export const BookFormModal = ({
  book,
  onClose,
  onSaved,
}: BookFormModalProps) => {
  const isEdit = Boolean(book);
  const [form, setForm] = useState<BookInput>(
    book
      ? { title: book.title, author: book.author, description: book.description }
      : EMPTY_FORM,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const response = isEdit
        ? await bookService.update(book!.id, form)
        : await bookService.create(form);
      onSaved(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-slate-800">
          {isEdit ? "Editar libro" : "Nuevo libro"}
        </h2>

        {error && (
          <div className="mt-3">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="Título"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            autoFocus
          />
          <Input
            label="Autor"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Descripción
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-auto" disabled={isSaving}>
              {isSaving ? "Guardando…" : isEdit ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
