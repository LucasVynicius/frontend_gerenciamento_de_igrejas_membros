import { AddressDTO } from "../address/Address";

export interface Church {
  id: number;
  name: string;
  tradeName: string;
  registryType: string;
  registryNumber: string;
  city: string;
  country: string;
  foundationDate: string; 
  pastorLocalId: number | null;
  pastorLocalName: string | null;
  address: AddressDTO
}
