import { api } from '../api';
import { AxiosError } from 'axios';
import { MinisterialPosition } from '../../enums/MinisterialPosition';

// Interfaces para os DTOs do back-end
export interface MeetingRequestDTO {
    date?: string;
    summary: string;
    notes?: string;
    participantIds?: number[];
}

export interface MinisterInfo {
    id: number;
    fullName: string;
    cpf: string;
    telephone: string;
    consecrationDate: string;
    idChurch: number;
    churchName: string;
    churchTradeName: string;
    position: MinisterialPosition;
}

export interface MeetingResponseDTO {
    id: number;
    date: string;
    summary: string;
    notes?: string;
    participantIds?: number[];
    participants?: MinisterInfo[];
}

export const getMeetings = async (): Promise<MeetingResponseDTO[]> => {
    try {
        const response = await api.get<MeetingResponseDTO[]>('/meetings');
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao buscar as reuniões.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

export const createMeeting = async (data: MeetingRequestDTO): Promise<MeetingResponseDTO> => {
    try {
        const response = await api.post<MeetingResponseDTO>('/meetings', data);
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao criar a reunião.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

export const updateMeeting = async (id: number, data: MeetingRequestDTO): Promise<MeetingResponseDTO> => {
    try {
        const response = await api.put<MeetingResponseDTO>(`/meetings/${id}`, data);
        return response.data;
    } catch (error) {
        let errorMessage = 'Falha ao atualizar a reunião.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

export const deleteMeeting = async (id: number): Promise<void> => {
    try {
        await api.delete(`/meetings/${id}`);
    } catch (error) {
        let errorMessage = 'Falha ao excluir a reunião.';
        if (error instanceof AxiosError && error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};

export const downloadMeetingReport = async (id: number): Promise<void> => {
    try {
        const response = await api.get(`/meetings/${id}/download`, {
            responseType: 'blob', // <-- Importante para receber o arquivo
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio-reuniao-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch {
        throw new Error('Falha ao baixar o relatório da reunião.');
    }
};