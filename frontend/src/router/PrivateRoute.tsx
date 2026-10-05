import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/Loader";

/** Solo deja pasar a quien tiene sesión iniciada */
export const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};