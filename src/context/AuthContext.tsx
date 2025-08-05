import React, { createContext, useEffect } from 'react'
import { getAuth } from '../utils/authUtils';
import { login as apiLogin } from '../services/authService';
import api from '../services/api';
import { getMyInfo } from '../services/user/userService';
import { removeAuth } from '../utils/authUtils';


interface UserInfo {
    username: string;
    email: string;
    role: 'ADMIN' | 'SECRETARY' | 'ROLE_ADMIN' | 'ROLE_SECRETARY';
}

interface AuthRequest {
    username: string;
    password: string;
}

interface AuthContextType {
    user: UserInfo | null;
    isAuthenticated: boolean;
    login: (credentials: AuthRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<UserInfo | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        const loadUser = async () => {
            const { accessToken } = getAuth();
            if (accessToken) {
                try {
                    // Se quiser manter o fluxo antigo, pode buscar pelo authService.getLoggedInUser
                    // const userInfo: UserInfo = await getMyInfo();
                    // setUser(userInfo);
                    setUser(null); // ou buscar pelo userService se preferir
                } catch {
                    removeAuth();
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (credentials: AuthRequest) => {
    try {
      // Passo 1: Chama o authService para obter o token
      const { accessToken } = await apiLogin(credentials);

      // Passo 2: Salva o token no localStorage
      localStorage.setItem('accessToken', accessToken);

      // Passo 3: Configura o header padrão do Axios para futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Passo 4: AGORA chama o userService para buscar os dados do usuário
      const userInfo = await getMyInfo();
      
      // Passo 5: Salva os dados do usuário no estado e finaliza o login
      // Converte role para o formato esperado
      const normalizedUserInfo: UserInfo = {
        ...userInfo,
        role:
          userInfo.role === 'ROLE_ADMIN' ? 'ADMIN' :
          userInfo.role === 'ROLE_SECRETARY' ? 'SECRETARY' : userInfo.role
      };
      setUser(normalizedUserInfo);

    } catch (error) {
      console.error("Falha no fluxo de login:", error);
      // Limpa tudo em caso de falha
      logout();
      throw error; // Lança o erro para o componente Login poder exibi-lo
    }
  };

    const logout = () => {
        removeAuth();
        setUser(null);
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthContext;