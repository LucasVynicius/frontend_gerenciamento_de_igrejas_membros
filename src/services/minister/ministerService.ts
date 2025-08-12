import { api } from '../api';
import { AxiosError } from 'axios';
import type { Minister } from '../../types/minister/Minister';
import type { MinisterialPosition } from '../../enums/MinisterialPosition';

export interface MinisterRequestDTO {
  position: MinisterialPosition;
  consecrationDate: string;
  idMember: number;
  idChurch: number;
}
interface ApiErrorResponse {
    message: string;
}

const handleApiError = (error: unknown, defaultMessage: string): Error => {
    if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;
        if (errorData && typeof errorData.message === 'string') {
            return new Error(errorData.message);
        }
    }
    return new Error(defaultMessage);
};

export const getMinisters = async (): Promise<Minister[]> => {
  try {
    const response = await api.get<Minister[]>('/ministros');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Falha ao buscar a lista de ministros.');
  }
};

export const consecrateMinister = async (data: MinisterRequestDTO): Promise<Minister> => {
  try {
    const response = await api.post<Minister>('/ministros', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Falha ao consagrar o novo ministro.');
  }
};

export const updateMinister = async (id: number, data: MinisterRequestDTO): Promise<Minister> => {
  try {
    const response = await api.put<Minister>(`/ministros/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Falha ao atualizar o registro ministerial.');
  }
};

export const deleteMinister = async (id: number): Promise<void> => {
  try {
    await api.delete(`/ministros/${id}`);
  } catch (error) {
    throw handleApiError(error, 'Falha ao excluir o registro ministerial.');
  }
};