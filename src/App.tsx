import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './context/useAuth';
import { AuthProvider } from './context/AuthContext';

// Importa os componentes de layout
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';

// Importa as páginas
import Dashboard from './components/dashboard/Dashboard';
import MemberPage from './pages/member/MemberPage';
import ChurchPage from './pages/church/ChurchPage';

/**
 * Componente que protege rotas.
 */
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

  // Se autenticado, renderiza o Layout que, por sua vez, renderizará as rotas filhas via <Outlet />.
  // Se não, redireciona para o login.
  return isAuthenticated ? <Layout /> : <Navigate to="/login" />;
};

/**
 * Componente principal da aplicação.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rota "Pai" para todas as páginas protegidas */}
          <Route element={<ProtectedLayout />}>
            {/* Todas as rotas aqui dentro usarão o ProtectedLayout */}
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/membros" element={<MemberPage />} />
            <Route path="/igrejas" element={<ChurchPage />} />
            {/* Adicione outras rotas protegidas aqui no futuro */}
          </Route>
          
          {/* Redireciona para o login se nenhuma rota for encontrada */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;