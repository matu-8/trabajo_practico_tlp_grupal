import { useCallback, useEffect, useState } from "react";
import { bookService } from "../services/book.service";
import { getErrorMessage } from "../services/apiClient";
import type { Book } from "../types/api.types";

interface BookState {
  book: Book | null;
  isLoading: boolean;
  error: string | null;
}

interface UseBookResult extends BookState {
  reload: () => void;
}

/** Carga un libro puntual por id */
export const useBook = (id: number | null): UseBookResult => {
  const [state, setState] = useState<BookState>({
    book: null,
    isLoading: id !== null,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (id === null) return;
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await bookService.getById(id);
        if (cancelled) return;
        setState({ book: data, isLoading: false, error: null });
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
  }, [id, reloadToken]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setReloadToken((token) => token + 1);
  }, []);

  return { ...state, reload };
};
