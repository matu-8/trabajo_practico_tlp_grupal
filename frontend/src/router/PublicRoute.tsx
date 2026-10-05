import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/Loader";

/** Solo deja pasar a quien NO tiene sesión iniciada */
export const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (user) return <Navigate to="/home" replace />;

  return <Outlet />;
};