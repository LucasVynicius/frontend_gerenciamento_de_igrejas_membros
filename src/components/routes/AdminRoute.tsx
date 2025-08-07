import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { Role } from '../../enums/Role';

const AdminRoute: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>; // Ou um spinner
    }

    // Verifica se está autenticado E se o perfil é de ADMIN
    if (isAuthenticated && user?.role === Role.ADMIN) {
        return <Outlet />; // Se for admin, permite o acesso à rota filha
    }

    // Se não for admin (ou não estiver logado), redireciona para o dashboard
    return <Navigate to="/" />;
};

export default AdminRoute;