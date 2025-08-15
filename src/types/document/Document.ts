// Define o tipo literal para os tipos de documentos válidos
export type DocumentType = 'RECOMMENDATION_LETTER' | 'CERTIFICATE' | 'OFFICE';

export interface DocumentRequestDTO {
    // O tipo de documento a ser gerado
    documentType: DocumentType;

    // O ID do membro para quem o documento será gerado
    idMember: number;
    
    // Opcional: O propósito da carta, para ser preenchido no PDF
    purpose?: string;
}