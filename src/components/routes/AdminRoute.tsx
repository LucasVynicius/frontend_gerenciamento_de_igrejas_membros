import React from 'react';
import { useAuth } from '../../context/useAuth';
import { Outlet, Navigate } from 'react-router-dom';
import { Role } from '../../enums/Role';

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user || user.role !== Role.ADMIN) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;