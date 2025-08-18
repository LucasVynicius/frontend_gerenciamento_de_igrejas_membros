import { api } from '../api';
import type { DocumentRequestDTO } from '../../types/document/Document';
import { AxiosResponse } from 'axios';

export const generateDocument = async (documentData: DocumentRequestDTO): Promise<AxiosResponse<Blob>> => {

    const response = await api.post(
        '/documents/generate',
        documentData,
        { responseType: 'blob' }
    );
    return response;
};
