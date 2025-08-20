import api from "../api";
import type { Church } from "../../types/church/Church";



export const getChurches = async (): Promise<Church[]> => {
  const response = await api.get("/churches");
  return response.data;
};

export const createChurch = async (data: Church): Promise<Church> => {
  const response = await api.post("/churches", data);
  return response.data;
};

export const updateChurch = async (
  id: number,
  data: Church
): Promise<Church> => {
  const response = await api.put(`/churches/${id}`, data);
  return response.data;
};

export const deleteChurch = async (id: string): Promise<void> => {
  await api.delete(`/igrejas/${id}`);
};

export const getChurchById = async (id: number): Promise<Church> =>{
   const { data } = await api.get(`/churches/${id}`)
    return data
}
