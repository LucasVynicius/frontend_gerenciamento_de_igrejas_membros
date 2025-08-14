import { createContext } from 'react';
import type { AuthRequest } from '../services/authService';
import type { UserInfo } from '../services/user/userService';


export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
