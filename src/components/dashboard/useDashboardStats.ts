import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/dashboard/dashboardService';
import type { DashboardStats as IDashboardStats } from '../../services/dashboard/dashboardService';

export const useDashboardStats = () => {
    const [stats, setStats] = useState<IDashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err);
                setError("Não foi possível carregar as estatísticas. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []); // O array vazio garante que a função só roda uma vez

    return { stats, loading, error };
};