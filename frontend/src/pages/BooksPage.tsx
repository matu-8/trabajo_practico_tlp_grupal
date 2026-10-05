import { useState } from "react";
import { Link } from "react-router";
import { useBooks } from "../hooks/useBooks";
import { Alert } from "../components/Alert";
import { Loader } from "../components/Loader";
import { BookStatusBadge } from "../components/books/BookStatusBadge";

export const BooksPage = () => {
  const { books, isLoading, error } = useBooks();
  const [query, setQuery] = useState("");

  const filtered = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()),
  );

  if (isLoading) return <Loader />;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Libros</h1>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por título o autor"
        className="mt-4 w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      {error && (
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {!error && filtered.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          {query
            ? "No hay libros que coincidan con la búsqueda."
            : "Todavía no hay libros cargados."}
        </p>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((book) => (
          <li key={book.id}>
            <Link
              to={`/books/${book.id}`}
              className="block h-full rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-800">{book.title}</h2>
                <BookStatusBadge status={book.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{book.author}</p>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                {book.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};
