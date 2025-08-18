export type DocumentType = 'RECOMMENDATION_LETTER_MEMBER' | 'RECOMMENDATION_LETTER_MINISTER' | 'CERTIFICATE' | 'OFFICE';

export interface DocumentRequestDTO {
    
    documentType: DocumentType;

    idMember?: number;
    
    idMinister?: number;

    purpose?: string;
}