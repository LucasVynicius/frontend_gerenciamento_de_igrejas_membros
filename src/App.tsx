import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './context/useAuth';
import  AuthProvider  from './providers/AuthProvicer';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';


import Dashboard from './components/dashboard/Dashboard';
import MemberPage from './pages/member/MemberPage';
import ChurchPage from './pages/church/ChurchPage';
import MinisterPage from './pages/minister/MinisterPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminRoute from './components/routes/AdminRoute';

const ProtectedLayout = () => {
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

  return isAuthenticated ? <Layout /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/membros" element={<MemberPage />} />
            <Route path="/igrejas" element={<ChurchPage />} />
            <Route path="/ministros" element={<MinisterPage />} />
            <Route element={<AdminRoute />}>
              <Route path="admin/users" element={<AdminUserPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;