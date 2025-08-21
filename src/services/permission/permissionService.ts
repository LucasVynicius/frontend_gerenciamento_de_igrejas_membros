import { api } from '../api';
import { AxiosError } from 'axios';
import { UserInfo } from '../user/userService'; // Importe seu DTO de usuário





export interface PermissionResponseDTO {
    id: number;
    name: string;
}

export interface RoleResponseDTO {
    id: number;
    name: string;
    permissions: PermissionResponseDTO[];
}

// 1. Endpoint para buscar todas as permissões
export const getAllPermissions = async (): Promise<PermissionResponseDTO[]> => {
    try {
        const response = await api.get<PermissionResponseDTO[]>('/permissions');
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao buscar as permissões.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

// 2. Endpoint para buscar todos os papéis (roles)
export const getAllRoles = async (): Promise<RoleResponseDTO[]> => {
    try {
        const response = await api.get<RoleResponseDTO[]>('/roles');
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao buscar os papéis.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

// 3. Endpoint para atualizar as permissões de um papel
export const updateRolePermissions = async (roleId: number, permissionNames: string[]): Promise<RoleResponseDTO> => {
    try {
        const data = { permissionNames };
        const response = await api.put<RoleResponseDTO>(`/roles/${roleId}/permissions`, data);
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao atualizar as permissões do papel.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

export const getAllUsers = async (): Promise<UserInfo[]> => { // Use UserInfo aqui
    try {
        const response = await api.get<UserInfo[]>('/admin/users');
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao buscar os usuários.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};