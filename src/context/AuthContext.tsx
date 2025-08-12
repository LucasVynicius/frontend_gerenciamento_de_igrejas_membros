import { createContext } from 'react';
import type { AuthRequest } from '../services/authService';
import type { UserInfo } from '../services/user/userService';

/**
 * Define o "contrato" dos dados e funções que o nosso
 * contexto de autenticação vai fornecer.
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => void;
}

/**
 * Cria e exporta o Contexto de Autenticação.
 * Os componentes que consumirem este contexto receberão os valores
 * definidos na interface AuthContextType.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
