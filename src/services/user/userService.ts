export const deleteUser = async (userId: number): Promise<void> => {
    try {
        await api.delete(`/admin/users/${userId}`);
    } catch {
        throw new Error('Falha ao excluir o usuário.');
    }
};
import { api } from '../api';
import { AxiosError } from 'axios';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'SECRETARY';
  enabled: boolean;
}


export interface UserRequestDTO {
  username: string;
  email: string;
  password?: string; 
  role: 'ADMIN' | 'SECRETARY';
}


export const getMyInfo = async (): Promise<UserInfo> => {
  try {
    const response = await api.get<UserInfo>('/users/me'); 
    return response.data;
  } catch {
    throw new Error("Erro ao carregar informações do usuário.");
  }
};


export const getAllUsers = async (): Promise<UserInfo[]> => {
    try {
        const response = await api.get<UserInfo[]>('/admin/users');
        return response.data;
    } catch  {
        throw new Error("Falha ao buscar a lista de usuários.");
    }
}

export const createUser = async (userData: UserRequestDTO): Promise<UserInfo> => {
    try {
        const response = await api.post<UserInfo>('/admin/users', userData);
        return response.data;
    } catch (error) {
        const apiError = error as AxiosError<any>;
        const message = apiError.response?.data?.message || 'Erro ao criar o usuário.';
        throw new Error(message);
    }
}

export const activateUser = async (userId: number, isActive: boolean): Promise<void> => {
    try {
        
        await api.patch(`/admin/users/${userId}/activate`, { enabled: isActive });
    } catch  {
        throw new Error("Falha ao atualizar o status do usuário.");
    }
};

export const resetUserPassword = async (userId: number, newPassword: string): Promise<void> => {
    try {
        await api.patch(`/admin/users/${userId}/reset-password`, { newPassword });
    } catch  {
        throw new Error("Falha ao resetar a senha do usuário.");
    }
};