import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Home</h1>
      {user && <p>Bienvenido, {user.name}</p>}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};
