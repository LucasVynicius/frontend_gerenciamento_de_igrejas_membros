import { api } from './api';
import { AxiosError } from 'axios';


export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'SECRETARY' | 'USER';
  enabled: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SECRETARY';
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string | null;
}


export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        // --- ADICIONADO: Lógica para salvar o token ---
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        
        // Opcional: Se você usa refreshToken, salve-o também
        if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        // --- FIM DA LÓGICA ADICIONADA ---

        return response.data;
    } catch (error) {
        const errorMessage = (error as AxiosError<{ message?: string }>)?.response?.data?.message || 'Erro ao efetuar login. Verifique suas credenciais.';
        throw new Error(errorMessage);
    }
};


export const register = async (data: RegisterRequest): Promise<UserInfo> => {
  try {
    const response = await api.post<UserInfo>('/auth/register', data);
    return response.data;
  } catch (error) {
    const errorMessage = (error as AxiosError<{ message?: string }>)?.response?.data?.message || 'Erro ao registrar usuário.';
    throw new Error(errorMessage);
  }
};


export const getLoggedInUser = async (): Promise<UserInfo> => {
  try {
    const response = await api.get<UserInfo>('/users/me');


    const userInfo: UserInfo = {
      ...response.data,
      // Normaliza a role aqui, removendo o prefixo "ROLE_"
      role: response.data.role.replace('ROLE_', '') as 'ADMIN' | 'SECRETARY' | 'USER',
    };

    // RETORNE O OBJETO CORRIGIDO
    return userInfo;
  } catch (error) {
    const errorMessage = (error as AxiosError<{ message?: string }>)?.response?.data?.message || 'Erro ao carregar informações do usuário.';
    throw new Error(errorMessage);
  }
};