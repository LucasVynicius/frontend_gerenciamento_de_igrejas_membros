import { api } from '../api'; // Importa nossa instância do Axios
import type { Member } from '../../types/member/Member';
import type { AddressDTO } from '../../types/address/Address';

// DTO para CRIAR ou ATUALIZAR um membro. Corresponde ao MemberRequestDTO do backend.
export interface MemberRequestDTO {
  fullName: string;
  cpf: string;
  rg: string;
  telephone: string;
  email: string;
  dateOfBirth: string;
  baptismDate: string | null;
  entryDate: string | null;
  active: boolean;
  address: AddressDTO;
  idChurch: number | null;
}

/**
 * Busca a lista de todos os membros.
 */
export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get('/membros');
  return response.data;
};

/**
 * Cria um novo membro.
 * @param memberData Os dados do formulário para o novo membro.
 */
export const createMember = async (memberData: MemberRequestDTO): Promise<Member> => {
  const response = await api.post('/membros', memberData);
  return response.data;
};

/**
 * Atualiza um membro existente.
 * @param id O ID do membro a ser atualizado.
 * @param memberData Os novos dados do membro.
 */
export const updateMember = async (id: number, memberData: MemberRequestDTO): Promise<Member> => {
  const response = await api.put(`/membros/${id}`, memberData);
  return response.data;
};

/**
 * Exclui um membro.
 * @param id O ID do membro a ser excluído.
 */
export const deleteMember = async (id: number): Promise<void> => {
  await api.delete(`/membros/${id}`);
};