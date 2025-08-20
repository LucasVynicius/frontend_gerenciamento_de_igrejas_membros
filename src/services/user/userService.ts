import { api } from '../api';
import { AxiosError } from 'axios';

// Interfaces de Tipagem
//-----------------------------------------------------
// Interface para o objeto de usuário completo, como retornado pela API
export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'SECRETARY' | 'USER';
  enabled: boolean;
}

// Interface para a requisição de criação de usuário (sem o ID)
export interface UserRequestDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'SECRETARY' | 'USER';
}

// Interface para a requisição de atualização de usuário (com o ID)
export interface UserUpdateRequestDTO {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'SECRETARY';
  enabled: boolean;
}

export interface UserFormValues {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password?: string; 
    role: 'ADMIN' | 'SECRETARY' | 'USER';
    enabled?: boolean; 

}

interface ApiErrorResponse {
  message: string;
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
  } catch {
    throw new Error("Falha ao buscar a lista de usuários.");
  }
};

export const createUser = async (userData: UserRequestDTO): Promise<UserInfo> => {
  try {
    const response = await api.post<UserInfo>('/admin/users', userData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      if (errorData && typeof errorData.message === 'string') {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Ocorreu um erro inesperado ao criar o usuário.');
  }
};


export const updateUser = async (userData: UserUpdateRequestDTO): Promise<UserInfo> => {
  try {
    const response = await api.put<UserInfo>(`/admin/users/${userData.id}`, userData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      if (errorData && typeof errorData.message === 'string') {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Ocorreu um erro inesperado ao atualizar o usuário.');
  }
};

export const activateUser = async (userId: number, isActive: boolean): Promise<void> => {
  try {
    await api.patch(`/admin/users/${userId}/activate`, { enabled: isActive });
  } catch {
    throw new Error("Falha ao atualizar o status do usuário.");
  }
};

export const resetUserPassword = async (userId: number, newPassword: string): Promise<void> => {
  try {
    await api.patch(`/admin/users/${userId}/reset-password`, { newPassword });
  } catch {
    throw new Error("Falha ao resetar a senha do usuário.");
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/admin/users/${userId}`);
  } catch {
    throw new Error('Falha ao excluir o usuário.');
  }
};