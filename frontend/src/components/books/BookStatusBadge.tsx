import type { BookStatus } from "../../types/api.types";

const STATUS_CLASSES: Record<BookStatus, string> = {
  DISPONIBLE: "bg-emerald-100 text-emerald-700",
  PRESTADO: "bg-amber-100 text-amber-700",
  EN_REPARACION: "bg-sky-100 text-sky-700",
};

const STATUS_LABELS: Record<BookStatus, string> = {
  DISPONIBLE: "Disponible",
  PRESTADO: "Prestado",
  EN_REPARACION: "En reparación",
};

interface BookStatusBadgeProps {
  status: BookStatus;
}

/** Etiqueta de color según el estado del libro, reutilizada en lista y detalle */
export const BookStatusBadge = ({ status }: BookStatusBadgeProps) => (
  <span
    className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);
