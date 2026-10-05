import { Navigate, Route, Routes } from "react-router";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { MainLayout } from "../components/layout/MainLayout";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { BooksPage } from "../pages/BooksPage";
import { BookDetailPage } from "../pages/BookDetailPage";
import { NotificationsPage } from "../pages/NotificationsPage";

export const AppRouter = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route element={<PrivateRoute />}>
      {/* Todo lo privado comparte el mismo layout con la navbar */}
      <Route element={<MainLayout />}>
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/books" replace />} />
  </Routes>
);