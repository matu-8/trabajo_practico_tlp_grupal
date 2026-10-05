import { useCallback, useEffect, useState } from "react";
import { bookService } from "../services/book.service";
import { getErrorMessage } from "../services/apiClient";
import type { Book } from "../types/api.types";

interface BooksState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}

interface UseBooksResult extends BooksState {
  reload: () => void;
}

/** Carga el catálogo de libros del usuario autenticado */
export const useBooks = (): UseBooksResult => {
  const [state, setState] = useState<BooksState>({
    books: [],
    isLoading: true,
    error: null,
  });
  // Cambiar el token dispara el efecto sin duplicar la función de carga
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await bookService.getAll();
        if (cancelled) return;
        setState({ books: data, isLoading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: getErrorMessage(err),
        }));
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setReloadToken((token) => token + 1);
  }, []);

  return { ...state, reload };
};
