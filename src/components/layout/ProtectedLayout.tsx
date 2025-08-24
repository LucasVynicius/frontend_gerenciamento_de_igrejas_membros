import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import Layout from './Layout'; 

const ProtectedLayout: React.FC = () => {
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

  return isAuthenticated ? <Layout><Outlet /></Layout> : <Navigate to="/login" />;
};

export default ProtectedLayout;