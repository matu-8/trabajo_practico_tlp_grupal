import { useState, useCallback, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth.context";
import { authService } from "../services/auth.service";
import { ApiError } from "../services/apiClient";
import type { LoginInput, RegisterInput, User } from "../types/api.types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, se le pregunta al backend si la cookie de sesión sigue viva
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authService.check();
        setUser(data);
      } catch (error) {
        // Un 401 solo significa "no hay sesión": no es una falla real
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error("Error verificando autenticación:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const response = await authService.login(input);
    setUser(response.data);
    return response;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    return await authService.register(input);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // Aunque el backend falle, la sesión local se cierra igual
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};