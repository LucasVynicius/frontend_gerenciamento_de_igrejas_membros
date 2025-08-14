import { api } from "../api";
import type {
  Member,
  MemberRequestDTO,
  MemberUpdateRequestDTO,
} from "../../types/member/Member";

export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get("/members");
  return response.data;
};

export const createMember = async (
  memberData: MemberRequestDTO
): Promise<Member> => {
  const response = await api.post("/members", memberData);
  return response.data;
};

export const updateMember = async (
  id: number,
  memberData: MemberUpdateRequestDTO
): Promise<Member> => {
  const response = await api.put(`/members/${id}`, memberData);
  return response.data;
};

export const deleteMember = async (id: number): Promise<void> => {
  await api.delete(`/members/${id}`);
};

export const uploadMemberPhoto = async (
  memberId: number,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  await api.post(`/members/${memberId}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMemberById = async (memberId: number): Promise<Member> => {
  const response = await api.get<Member>(`/members/${memberId}`);
  return response.data;
};
