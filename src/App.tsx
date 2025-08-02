// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './context/useAuth';
import { AuthProvider } from './context/AuthContext';

// Importa os componentes de layout
import Layout from './components/layout/Layout'; // Importa o novo componente de layout
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';

// Importa as páginas
import Dashboard from './components/dashboard/Dashboard';
import MemberPage from './pages/member/MemberPage';
// import ChurchPage from './pages/ChurchPage';
// import MinisterPage from './pages/MinisterPage';
// import AdminUserPage from './pages/AdminUserPage';

/**
 * Componente que protege rotas. Se o usuário não estiver autenticado,
 * redireciona-o para a página de login.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Componente principal que define a estrutura de roteamento da aplicação.
 */
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Rotas Protegidas usando o Layout */}
                    <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/membros" element={<ProtectedRoute><Layout><MemberPage /></Layout></ProtectedRoute>} />
                    {/* <Route path="/igrejas" element={<ProtectedRoute><Layout><ChurchPage /></Layout></ProtectedRoute>} />
                    <Route path="/ministros" element={<ProtectedRoute><Layout><MinisterPage /></Layout></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><Layout><AdminUserPage /></Layout></ProtectedRoute>} /> */}
                    
                    {/* Redireciona para o login se a rota não for encontrada */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;