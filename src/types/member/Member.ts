import type { AddressDTO } from "../address/Address";

export interface Member {
  id: number;
  fullName: string;
  photoUrl: string | null;
  cpf: string;
  rg: string;
  telephone: string;
  email: string;
  dateOfBirth: string;
  baptismDate: string | null;
  entryDate: string | null;
  active: boolean;
  address: AddressDTO;
  idChurch: number;
  churchName: string;
  churchTradeName: string;
  churchCity: string;
  churchCounty: string;
}

export interface MemberRequestDTO {
  fullName: string;
  cpf: string;
  rg: string;
  telephone: string;
  email: string;
  dateOfBirth: string;
  baptismDate?: string | null;
  entryDate?: string | null;
  active: boolean;
  idChurch: number;
  address: AddressDTO;
}

export interface MemberUpdateRequestDTO {
  id: number;
  fullName: string;
  photoUrl: string | null;
  cpf: string;
  rg: string;
  email: string;
  telephone: string;
  dateOfBirth: string;
  dateOfBaptism?: string | null;
  dateOfEntry?: string | null;
  active: boolean;
  idChurch: number;
  address: AddressDTO;
}

export type MemberFormValues = Member & MemberRequestDTO;
