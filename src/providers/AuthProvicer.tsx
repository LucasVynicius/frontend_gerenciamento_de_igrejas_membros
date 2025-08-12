import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as apiLogin } from '../services/authService';
import { getMyInfo } from '../services/user/userService';
import { api } from '../services/api';
import type { AuthRequest } from '../services/authService';
import type { UserInfo } from '../services/user/userService';

const AuthLoader: React.FC = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#272b33' }}>
        <h2 style={{ color: '#f5f5f5' }}>Carregando sua sessão...</h2>
    </div>
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isAuthenticated = !!user;

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
    }, []);

    const validateToken = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Buscar as informações do usuário logado
                const userInfo = await getMyInfo();
                setUser(userInfo);
            } catch (error) {
                console.error("Token salvo é inválido, limpando sessão:", error);
                logout();
            }
        }
        setLoading(false);
    }, [logout]);

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    const login = useCallback(async (credentials: AuthRequest) => {
        try {
            const { accessToken } = await apiLogin(credentials);
            localStorage.setItem('accessToken', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            // Buscar as informações do usuário logado após o login
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