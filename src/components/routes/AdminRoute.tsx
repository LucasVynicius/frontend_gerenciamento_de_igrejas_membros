import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { Role } from '../../enums/Role';

const AdminRoute: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>; 
    }

    
    if (isAuthenticated && user?.role === Role.ADMIN) {
        return <Outlet />;
    }

    
    return <Navigate to="/" />;
};

export default AdminRoute;