import { MinisterialPosition } from "../../enums/MinisterialPosition";
import type { AddressDTO  } from "../address/Address"; // Supondo que você tenha um tipo para AddressDTO

export interface Minister {
  id: number;
  position: MinisterialPosition;
  consecrationDate: string;
  idMember: number;
  fullName: string;
  cpf: string;
  telephone: string;
  email: string;
  idChurch: number;
  churchName: string;
  churchTradeName: string;
  churchCity: string;
  churchCounty: string;
  addressChurch: AddressDTO;
}