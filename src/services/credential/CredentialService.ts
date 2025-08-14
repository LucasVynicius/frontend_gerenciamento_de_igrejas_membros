import { api } from '../api';
import type { CredentialData } from '../../types/credential/Credential';

export const getMemberCredential = async (memberId: number): Promise<CredentialData> => {
    try {
        const response = await api.get('/credentials', {
            params: {
                type: 'membro',
                id: memberId,
            },
        });
        return response.data;
    } catch {
        throw new Error('Falha ao gerar os dados da credencial do membro.');
    }
};

export const getMinisterCredential = async (ministerId: number): Promise<CredentialData> => {
    try {
        const response = await api.get('/credentials', {
            params: {
                type: 'ministro',
                id: ministerId,
            },
        });
        return response.data;
    } catch {
        throw new Error('Falha ao gerar os dados da credencial do ministro.');
    }
};