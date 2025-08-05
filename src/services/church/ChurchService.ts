import api from '../api';
import type {Church} from '../../types/church/Church';


export interface ChurchRequestDTO{
    name: string;
  tradeName: string;
  registryType: string;
  registryNumber: string;
  foundationDate: string;
  pastorLocalId: number | null;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    nationality: string
  };
}

export const getChurches = async (): Promise<Church[]> => {
    const response = await api.get('/igrejas');
    return response.data;
}

export const createChurch = async (data: ChurchRequestDTO): Promise<Church> => {
    const response = await api.post('/igrejas', data);
    return response.data;    
};

export const updateChurch = async (id: string, data: ChurchRequestDTO): Promise<Church> => {
    const response = await api.put(`/igrejas/${id}`, data);
    return response.data;    
}

export const deleteChurch = async (id: string): Promise<void> => {
    await api.delete(`/igrejas/${id}`);
}