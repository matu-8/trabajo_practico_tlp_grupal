import { Navigate, Route, Routes } from "react-router";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";

export const AppRouter = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route element={<PrivateRoute />}>
      <Route path="/home" element={<HomePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);