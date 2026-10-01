import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "../hooks/useForm";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { email, password, onInputChange, onResetForm } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("isLogged", "true");
      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      onResetForm();
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Inicio de sesión</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={onInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={onInputChange}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>

      <button type="button" onClick={() => navigate("/register")}>
        ¿No tienes cuenta? Regístrate
      </button>
    </>
  );
};

// Alias para evitar errores si se importa como Register o Login
export const Login = LoginPage;
export const Register = LoginPage;
