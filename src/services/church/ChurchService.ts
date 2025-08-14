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
  id: string,
  data: Church
): Promise<Church> => {
  const response = await api.put(`/churches/${id}`, data);
  return response.data;
};

export const deleteChurch = async (id: string): Promise<void> => {
  await api.delete(`/igrejas/${id}`);
};
