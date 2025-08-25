import React from 'react';
import { FaUsers, FaUserGraduate, FaChurch, FaUserTie } from 'react-icons/fa';
import './Dashboard.css';
import { useDashboardStats } from './useDashboardStats'; // Importamos o novo hook

const DashboardStats: React.FC = () => {
    // Usamos o hook para pegar os estados que precisamos
    const { stats, loading, error } = useDashboardStats();

    // Se estiver carregando, mostra a mensagem
    if (loading) {
        return <div className="loading-message">Carregando estatísticas...</div>;
    }

    // Se deu erro, mostra a mensagem de erro
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Se não tiver dados, mostra uma mensagem
    if (!stats) {
        return <div className="no-data-message">Nenhuma estatística encontrada.</div>;
    }

    return (
        <div className="stats-grid">
            <div className="stat-card members">
                <FaUsers size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats.totalMembers}</h2>
                    <p>Membros</p>
                </div>
            </div>

            <div className="stat-card ministers">
                <FaUserGraduate size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats.totalMinisters}</h2>
                    <p>Ministros</p>
                </div>
            </div>

            <div className="stat-card leaders">
                <FaUserTie size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats.totalLeaders}</h2>
                    <p>Líderes</p>
                </div>
            </div>

            <div className="stat-card churches">
                <FaChurch size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats.totalChurches}</h2>
                    <p>Igrejas</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;