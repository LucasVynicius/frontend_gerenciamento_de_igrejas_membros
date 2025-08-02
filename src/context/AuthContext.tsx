import React, { createContext, useEffect } from 'react'
import { getAuth } from '../utils/authUtils';
import * as authService from '../services/authService';
import { removeAuth } from '../utils/authUtils';


interface UserInfo {
    username: string;
    email: string;
    role: 'ADMIN' | 'SECRETARY';
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
                    const userInfo: UserInfo = await authService.getLoggedInUser(accessToken);
                    setUser(userInfo);
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
            const { accessToken, refreshToken } = await authService.login(credentials);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            const userInfo: UserInfo = await authService.getLoggedInUser(accessToken);
            setUser(userInfo);
        } catch (error) {
            console.error(error);
            throw error;
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