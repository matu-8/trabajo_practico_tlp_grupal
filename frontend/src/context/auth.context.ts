import { createContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
