import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface CanProps {
  permission: string;
  children: ReactNode;
}

/**
 * Renderiza su contenido solo si el usuario autenticado tiene el permiso.
 * Unifica el chequeo que antes vivía inline en las páginas.
 */
export const Can = ({ permission, children }: CanProps) => {
  const { user } = useAuth();
  const allowed = user?.permissions.includes(permission) ?? false;

  if (!allowed) return null;
  return <>{children}</>;
};
