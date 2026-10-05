import { Link, Outlet, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { Button } from "../Button";

/** Estructura común de las pantallas privadas: navbar + contenido */
export const MainLayout = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/books" className="text-lg font-bold text-slate-800">
            Biblioteca
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/books"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Libros
            </Link>

            <Link
              to="/notifications"
              className="relative rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user?.email}
            </span>
            <Button
              type="button"
              variant="secondary"
              className="w-auto px-3 py-1.5"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </nav>
      </header>

      <Outlet />
    </div>
  );
};
