import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin } from '../services/authService';
import { getMyInfo } from '../services/user/userService';
import { api } from '../services/api';

import type { AuthRequest } from '../services/authService';
import type { UserInfo } from '../services/user/userService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => void;
}

const AuthLoader: React.FC = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#272b33' }}>
        <h2 style={{ color: '#f5f5f5' }}>Carregando sua sessão...</h2>
    </div>
);

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const isAuthenticated = !!user;

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
    }, []);


    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const userInfo = await getMyInfo();
                    setUser(userInfo);
                } catch (error) {
                    console.error("Token salvo é inválido, limpando sessão:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [logout]);

    const login = useCallback(async (credentials: AuthRequest) => {
        try {
            const { accessToken } = await apiLogin(credentials);
            localStorage.setItem('accessToken', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            const userInfo = await getMyInfo();
            setUser(userInfo);
        } catch (error) {
            logout(); 
            throw error;
        }
    }, [logout]);

    if (loading) {
        return <AuthLoader />;
    }
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading: false, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;