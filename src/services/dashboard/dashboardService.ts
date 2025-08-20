import { api } from '../api'; 

export interface DashboardStats {
    totalMembers: number;
    totalMinisters: number;
    totalChurches: number;
    totalLeaders: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get('/dashboard/stats');
    return data;
};