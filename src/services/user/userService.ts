// Em: src/services/userService.ts

import api from '../api'; // Importa a instância PROTEGIDA

// Tipo para os dados do usuário (pode estar em src/types)
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_SECRETARY';
  enabled: boolean;
}

// Função para buscar dados do usuário logado
export const getMyInfo = async (): Promise<UserInfo> => {
  try {
    // A chamada agora é para /api/users/me e usa a instância 'api'
    const response = await api.get<UserInfo>('/users/me'); 
    return response.data;
  } catch {
    throw new Error("Erro ao carregar informações do usuário.");
  }
};