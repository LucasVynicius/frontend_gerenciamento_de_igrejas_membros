import React from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { FaUsers, FaChurch, FaLaptopCode, FaLock, FaFileAlt } from 'react-icons/fa';
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
            </div>
        </div>



    );
};

export default Dashboard;