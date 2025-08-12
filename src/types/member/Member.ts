import type { AddressDTO } from "../address/Address";

export interface Member {
  id: number;
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
  idChurch: number;
  churchName: string;
  churchTradeName: string;
  churchCity: string;
  churchCounty: string;
}


