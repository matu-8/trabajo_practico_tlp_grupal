import { useAuth } from "./useAuth";

/** Chequeo no visual de permisos, para lógica condicional fuera del JSX */
export const useCan = (permission: string): boolean => {
  const { user } = useAuth();
  return user?.permissions.includes(permission) ?? false;
};
