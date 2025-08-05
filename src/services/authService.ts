import { authApi } from './api'; 
import { AxiosError } from 'axios';

export interface UserInfo {
  username: string;
  email: string;
  role: 'ADMIN' | 'SECRETARY';
}

export const getLoggedInUser = async (token: string): Promise<UserInfo> => {
  try {
    const response = await authApi.get<UserInfo>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;

  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      'Erro ao carregar informações do usuário.';
    throw new Error(errorMessage);
  }
};

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'SECRETARY';
}

export const register = async (data: RegisterRequest): Promise<UserInfo> => {
  try {
    const response = await authApi.post<UserInfo>('/auth/register', data);
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      'Erro ao registrar usuário.';
    throw new Error(errorMessage);
  }
};

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
    const response = await authApi.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      'Erro ao efetuar login. Verifique suas credenciais.';
    throw new Error(errorMessage);
  }
};
