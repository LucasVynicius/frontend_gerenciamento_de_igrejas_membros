export type DocumentType = 'RECOMMENDATION_LETTER_MEMBER' 
| 'RECOMMENDATION_LETTER_MINISTER'
|'TRANSFER_LETTER_MEMBER' 
| 'TRANSFER_LETTER_MINISTER ' 
| 'TRANSFER_LETTER_MEMBER,'
| 'DECLARATION_MEMBER_ACTIVE'
| 'DECLARATION_MINISTER_ACTIVE'
| 'MEMBER_APRESENTATION_LETTER' 
| 'MINISTER_APRESENTATION_LETTER'
| 'BAPTISM_CERTIFICATE' 
| 'MEMBER_CERTIFICATE'
| 'MINISTER_CERTIFICATE'
| 'LEADER_CERTIFICATE'
| 'MINISTER_ORDINATION'
| 'COMMUNICATION_OFFICE'
| 'EVENT_INVITATION_OFFICE'
| 'SOLICITATION_OFFICE'
| 'PUBLIC_PERMIT_REQUEST_OFFICE'
| 'MEETING_REPORT'

export interface DocumentRequestDTO {
    
    documentType: DocumentType;

    idMember?: number;
    
    idMinister?: number;

    purpose?: string ;

    body?: string;

    recipient?: string;
    
    subject?: string;

    details?: { [key: string]: string };
}