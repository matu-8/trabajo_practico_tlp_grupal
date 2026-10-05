import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/apiClient";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, password, onInputChange, onResetForm } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const { msg } = await register({ name, email, password });
      setSuccess(msg);
      onResetForm();
      // Se espera un momento para que el usuario lea la confirmación
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">
          Crear cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Input
            label="Nombre"
            type="text"
            name="name"
            placeholder="Ana"
            value={name}
            onChange={onInputChange}
            autoComplete="name"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="ana@example.com"
            value={email}
            onChange={onInputChange}
            autoComplete="email"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={onInputChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={() => navigate("/login")}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </div>
    </main>
  );
};