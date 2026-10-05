import { createContext } from "react";
import type {
  ApiResponse,
  LoginInput,
  RegisterInput,
  User,
} from "../types/api.types";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  /** Hace el login contra la API y guarda el usuario. Vuelve a lanzar el error. */
  login: (input: LoginInput) => Promise<ApiResponse<User>>;
  /** Registra el usuario. Vuelve a lanzar el error. */
  register: (input: RegisterInput) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);