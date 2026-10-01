import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const PublicRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (user) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};
