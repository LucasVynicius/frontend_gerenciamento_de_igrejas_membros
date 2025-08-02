import axios, { AxiosError } from "axios";
import api from "./api"; 

interface AuthRequest{
    username: string;
    password: string;
}

interface RegisterRequest{
    username: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'SECRETARY';
}

interface AuthResponse{
    accessToken: string;
    refreshToken: string;
}

interface UserInfo{
    username: string;
    email: string;
    role: 'ADMIN' | 'SECRETARY';
}

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL
});

export const login = async (
  credentials: AuthRequest
): Promise<AuthResponse> => {
  try {
    const response = await authApi.post<AuthResponse>("/login", credentials);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      "Erro ao efetuar login. Verifique suas credenciais.";
    throw new Error(errorMessage);
  }
};

export const register = async (userData: RegisterRequest): Promise<void> => {
  try {
    const response = await authApi.post("/register", userData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      "Erro ao registrar usuário. Verifique os dados informados.";
    throw new Error(errorMessage);
  }
};

// A função getLoggedInUser foi corrigida para usar a API principal
export const getLoggedInUser = async (token : string): Promise<UserInfo> => {
  try {
    const response = await authApi.get<UserInfo>("/me", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      "Erro ao carregar informações do usuário.";
    throw new Error(errorMessage);
  }
};