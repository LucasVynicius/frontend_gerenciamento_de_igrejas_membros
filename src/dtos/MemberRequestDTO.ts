export interface MemberRequestDTO {
  fullName: string;
  cpf: string;
  rg: string;
  telephone: string;
  email: string;
  dateOfBirth: string | null;
  baptismDate: string | null;
  entryDate: string | null;
  active: boolean;
  address: AddressDTO;
  idChurch: number | null;
}

export interface AddressDTO {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  nationality: string
  zipCode: string;
}