import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  AuthProvider  from './providers/AuthProvider';

// Importe seus componentes
import ProtectedLayout from './components/layout/ProtectedLayout';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './components/dashboard/Dashboard';
import MemberPage from './pages/member/MemberPage';
import ChurchPage from './pages/church/ChurchPage';
import MinisterPage from './pages/minister/MinisterPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminRoute from './components/routes/AdminRoute'; // Vamos refatorar este componente
import OfficePage from './pages/office/OfficePage';
import MeetingReportsPage from './pages/meeting/MeetingPage';
import PermissionsPage from './pages/permission/PermissionsPage';
import ConfigPage from './pages/config/ConfigPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          

          <Route element={<ProtectedLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/membros" element={<MemberPage />} />
            <Route path="/igrejas" element={<ChurchPage />} />
            <Route path="/ministros" element={<MinisterPage />} />
            <Route path="/oficios" element={<OfficePage />} />
            <Route path="/relatorios" element={<MeetingReportsPage/>} />
            <Route path="/permissoes" element={<PermissionsPage/>} />
            <Route path="/configuracoes/:id" element={<ConfigPage/>} />
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUserPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;