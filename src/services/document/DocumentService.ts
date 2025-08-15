import { api } from '../api';
import type { DocumentRequestDTO } from '../../types/document/Document';
import { AxiosResponse } from 'axios';

// Adicionamos a lógica para a chamada da API
export const generateRecommendationLetter = async (idMember: number, purpose: string): Promise<AxiosResponse<Blob>> => {
    const documentData: DocumentRequestDTO = {
        documentType: 'RECOMMENDATION_LETTER',
        idMember,
        purpose,
    };

    const response = await api.post(
        '/documents/generate',
        documentData,
        { responseType: 'blob' }
    );
    return response;
};