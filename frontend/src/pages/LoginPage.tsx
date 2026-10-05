import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useForm } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/apiClient";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password, onInputChange, onResetForm } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      onResetForm();
      navigate("/home");
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
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

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
            placeholder="••••••••"
            value={password}
            onChange={onInputChange}
            autoComplete="current-password"
            required
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={() => navigate("/register")}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </div>
    </main>
  );
};