import React, { useState } from 'react';
import axios from 'axios'; // Assumindo que você usa axios diretamente
import { generateDocument } from '../../services/document/DocumentService';
import type { DocumentRequestDTO, DocumentType,  } from '../../types/document/Document';
import Modal from '../../components/Modal';
import "./OfficePage.css"

const OfficePage: React.FC = () => {
 
    const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | ''>('');
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [documentBody, setDocumentBody] = useState('');
 

    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalInfo, setModalInfo] = useState<{ isOpen: boolean, title: string, message: string }>({ isOpen: false, title: '', message: '' });


    const handleDocumentTypeChange = async (type: DocumentType | '') => {
    setSelectedDocumentType(type);
    setRecipient('');
    setSubject('');
    setDocumentBody('');

    if (type) {
        try {
            
            const response = await axios.get(`/api/templates/${type}`, {
                headers: {
                    'Cache-Control': 'no-cache', 
                    'Pragma': 'no-cache',        
                    'Expires': '0',
                },
            });
            
            
            if (response.data && typeof response.data === 'string') {
                setDocumentBody(response.data);
            } else {
                setDocumentBody(''); 
            }
        } catch (error) {
            console.error("Erro ao buscar template:", error);
            setDocumentBody('');
        }
    } else {
        setDocumentBody('');
    }
};

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedDocumentType) {
            setModalInfo({ isOpen: true, title: 'Atenção', message: 'Por favor, selecione um tipo de documento.' });
            return;
        }

        setIsSubmitting(true);

        const requestDTO: DocumentRequestDTO = {
            documentType: selectedDocumentType,
            recipient: recipient,
            subject: subject,
            purpose: documentBody, 
        };

        try {
            const response = await generateDocument(requestDTO);

            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `${requestDTO.documentType.toLowerCase()}_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            
            handleDocumentTypeChange('');

        } catch {
            setModalInfo({ isOpen: true, title: 'Erro', message: 'Falha ao gerar o documento. Verifique os dados e tente novamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header-container">
                <h1>Central de Ofícios</h1>
                <p>Gere comunicados, convites e outros documentos oficiais da igreja.</p>
            </div>

            <form onSubmit={handleSubmit} className="doc-form" style={{ maxWidth: '800px' }}>
                <div className="form-group mb-3">
                    <label htmlFor="documentType">Tipo de Ofício</label>
                    <select
                        id="documentType"
                        className="form-select"
                        value={selectedDocumentType}
                        onChange={(e) => handleDocumentTypeChange(e.target.value as DocumentType)}
                    >
                        <option value="">Selecione o tipo...</option>
                        <option value="COMMUNICATION_OFFICE">Comunicado</option>
                        <option value="EVENT_INVITATION_OFFICE">Convite para Evento</option>
                        <option value="SOLICITATION_OFFICE">Solicitações</option>
                        <option value="PUBLIC_PERMIT_REQUEST_OFFICE">Solicitação de Alvará/Licença</option>

                    </select>
                </div>

                {selectedDocumentType && (
                    <>
                        <div className="form-group mb-3">
                            <label htmlFor="recipient">Destinatário</label>
                            <input
                                type="text"
                                id="recipient"
                                className="form-control"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Ex: A/C Pastor Presidente da Igreja X"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="subject">Assunto / Referência</label>
                            <input
                                type="text"
                                id="subject"
                                className="form-control"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Ex: Convite para evento de aniversário"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="documentBody">Corpo do Texto</label>
                            <textarea
                                id="documentBody"
                                className="form-control"
                                rows={10}
                                value={documentBody}
                                onChange={(e) => setDocumentBody(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Gerando...' : 'Gerar Ofício'}
                        </button>
                    </>
                )}
            </form>

            <Modal
                isOpen={modalInfo.isOpen}
                onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
                title={modalInfo.title}
            >
                <p>{modalInfo.message}</p>
            </Modal>
        </div>
    );
};

export default OfficePage;