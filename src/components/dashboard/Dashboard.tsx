import React from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { FaUsers, FaChurch, FaLaptopCode, FaLock, FaFileAlt, FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Role } from '../../enums/Role';
import './Dashboard.css';
import useAuth from '../../context/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    return (

        <div>
            {user && (
                <div className="welcome-message">
                    <h3>Bem-vindo, {user.username}!</h3>
                </div>
            )}

            <div className="dashboard-grid">
                <DashboardCard icon={<FaUsers />} title="Gerenciamento de Membros" link="/membros" />
                <DashboardCard icon={<FaChurch />} title="Gerenciamento de Igrejas" link="/igrejas" />
                <DashboardCard icon={<FaLaptopCode />} title="Ministérios" link="/ministerios" />
                <DashboardCard icon={<FaLock />} title="Permissões" link="/permissoes" />
                <DashboardCard icon={<FaFileAlt />} title="Relatórios" link="/relatorios" />
                {user?.role === 'ADMIN' && (
                    <DashboardCard icon={<FaUserCog />} title="Gerenciar Usuários" link="/admin/users" />
                )}
            </div>
        </div>
    );
};

export default Dashboard;