export interface Church {
  id: string;
  name: string;
  tradeName: string;
  registryType: string;
  registryNumber: string;
  city: string;
  country: string;
  foundationDate: string; // Vem como string, podemos formatar depois
  pastorLocalId: number | null;
  pastorLocalName: string | null;
  address: {
    id: number;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}
