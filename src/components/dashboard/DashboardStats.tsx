import React, {useState, useEffect} from 'react';
import { getDashboardStats } from '../../services/dashboard/dashboardService'; // O serviço que criamos antes
import type { DashboardStats as IDashboardStats } from '../../services/dashboard/dashboardService'; // Renomeando o tipo para evitar conflito
import { FaUsers, FaUserGraduate, FaChurch, FaUserTie } from 'react-icons/fa';
import './Dashboard.css'; // Vamos reutilizar e adicionar estilos ao seu CSS

const DashboardStats: React.FC = () => {
    const [stats, setStats] = useState<IDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Erro ao carregar estatísticas", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="loading-message">Carregando estatísticas...</div>;
    }

    return (
        <div className="stats-grid">
            <div className="stat-card members">
                <FaUsers size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats?.totalMembers}</h2>
                    <p>Membros</p>
                </div>
            </div>

            <div className="stat-card ministers">
                <FaUserGraduate size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats?.totalMinisters}</h2>
                    <p>Ministros</p>
                </div>
            </div>

            <div className="stat-card leaders">
                <FaUserTie size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats?.totalLeaders}</h2>
                    <p>Líderes</p>
                </div>
            </div>

            <div className="stat-card churches">
                <FaChurch size={30} className="stat-icon" />
                <div className="stat-info">
                    <h2>{stats?.totalChurches}</h2>
                    <p>Igrejas</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;