import { Navigate, Outlet } from "react-router";

export const PrivateRoutes = () => {
  const isLogged = localStorage.getItem("isLogged");

  return isLogged ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};
