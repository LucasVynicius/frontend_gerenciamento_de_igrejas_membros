import React from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { FaUsers, FaChurch, FaUserGraduate, FaLock, FaFileAlt, FaUserCog } from 'react-icons/fa';
import './Dashboard.css';
import useAuth from '../../context/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    return (

        <div>
            {user && (
                <div className="welcome-message">
                    <h3>Bem-vindo, {user.firstName} {user.lastName}!</h3>
                </div>
            )}

            <div className="dashboard-grid">
                <DashboardCard icon={<FaChurch />} title="Gerenciamento de Igrejas" link="/igrejas" />
                <DashboardCard icon={<FaUsers />} title="Gerenciamento de Membros" link="/membros" />
                <DashboardCard icon={<FaUserGraduate />} title="Ministros" link="/ministros" />
                <DashboardCard icon={<FaLock />} title="Permissões" link="/permissoes" />
                <DashboardCard icon={<FaFileAlt />} title="Relatórios" link="/relatorios" />
                <DashboardCard icon={<FaFileAlt />} title="Oficios" link="/oficios" />
                {user?.role === 'ADMIN' && (
                    <DashboardCard icon={<FaUserCog />} title="Gerenciar Usuários" link="/admin/users" />
                )}
            </div>
        </div>
    );
};

export default Dashboard;