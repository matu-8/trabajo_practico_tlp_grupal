import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "../hooks/useForm";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { name, email, password, onInputChange, onResetForm } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Error al registrar usuario");
        return;
      }

      setSuccess(data.msg || "Usuario creado correctamente");
      onResetForm();

      // Redirigir al login después de registrarse
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Registro</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="nombre"
          value={name}
          onChange={onInputChange}
          required
        />
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
        <button type="submit">Registrar</button>
      </form>

      <button type="button" onClick={() => navigate("/login")}>
        ¿Ya tiene cuenta? inicie sesión
      </button>
    </>
  );
};

// Alias para mantener compatibilidad con imports anteriores
export const Register = RegisterPage;
