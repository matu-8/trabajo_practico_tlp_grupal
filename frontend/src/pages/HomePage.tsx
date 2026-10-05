import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-indigo-600">Sesión iniciada</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Hola, {user?.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{user?.email}</p>

        <Button
          type="button"
          variant="secondary"
          className="mt-8 max-w-xs"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>
    </main>
  );
};