// Em: src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin } from '../services/authService';
import type { AuthRequest } from '../services/authService';
import { getMyInfo } from '../services/user/userService';
import type { UserInfo } from '../services/user/userService';
import { api } from '../services/api';

// 1. Interface que define o que nosso contexto irá fornecer
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => void;
}

// 2. Criação do Contexto
// Ele é criado aqui e será usado pelo nosso hook e pelo Provider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. O componente Provedor (seu código, já estava ótimo)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const userInfo = await getMyInfo();
          setUser(userInfo);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token salvo é inválido, limpando sessão:", error);
          logout();
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = async (credentials: AuthRequest) => {
    try {
      const { accessToken } = await apiLogin(credentials);
      localStorage.setItem('accessToken', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const userInfo = await getMyInfo();
      setUser(userInfo);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. O Hook Customizado (useAuth)
// Ele agora vive no mesmo arquivo, garantindo que sempre terá acesso ao AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default useAuth;