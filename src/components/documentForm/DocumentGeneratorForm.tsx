import React, { useState } from 'react';
import { generateDocument } from '../../services/document/DocumentService';
import { DocumentRequestDTO, DocumentType } from '../../types/document/Document';

// Interface para o resultado da busca, tornando nosso código mais seguro e legível
interface PersonSearchResult {
    id: number;
    fullName: string;
}

const DocumentGeneratorForm: React.FC = () => {
    // --- ESTADOS FORTEMENTE TIPADOS ---
    const [documentType, setDocumentType] = useState<DocumentType>('RECOMMENDATION_LETTER_MEMBER');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<PersonSearchResult[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<PersonSearchResult | null>(null);
    const [purpose, setPurpose] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- FUNÇÕES COM PARÂMETROS TIPADOS ---
    const handleSearch = async (term: string) => {
        if (term.length < 3) {
            setSearchResults([]);
            return;
        }
        const searchEndpoint = documentType === 'RECOMMENDATION_LETTER_MEMBER' 
            ? `/api/members/search?name=${term}` 
            : `/api/ministers/search?name=${term}`;
        console.log(`Buscando em ${searchEndpoint}...`);
        
        const mockData: PersonSearchResult[] = [
            { id: 1, fullName: `Membro Teste 1 para "${term}"` },
            { id: 2, fullName: `Membro Teste 2 para "${term}"` },
        ];
        setSearchResults(mockData);
    };

    const handleSelectPerson = (person: PersonSearchResult) => {
        setSelectedPerson(person);
        setSearchTerm(person.fullName);
        setSearchResults([]);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedPerson) {
            setError('Por favor, selecione uma pessoa.');
            return;
        }
        setIsLoading(true);
        setError(null);

        // O TypeScript agora entende perfeitamente o que é o requestDTO
        const requestDTO: DocumentRequestDTO = {
            documentType,
            // Usamos "optional chaining" (?.) para o TypeScript não reclamar de 'selectedPerson' ser possivelmente nulo
            idMember: documentType === 'RECOMMENDATION_LETTER_MEMBER' ? selectedPerson?.id : undefined,
            idMinister: documentType === 'RECOMMENDATION_LETTER_MINISTER' ? selectedPerson?.id : undefined,
            purpose,
        };

        try {
            const response = await generateDocument(requestDTO);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = `documento_${selectedPerson.id}.pdf`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            // Acesso seguro, pois o link acabou de ser adicionado
            link.parentNode!.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch  {
            setError('Falha ao gerar o documento.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="doc-form">
            <h2>Gerador de Documentos</h2>
            <div className="form-group">
                <label>Tipo de Documento</label>
                <select value={documentType} onChange={(e) => {
                    // Informamos ao TS que o valor do select é um DocumentType válido
                    setDocumentType(e.target.value as DocumentType);
                    setSelectedPerson(null);
                    setSearchTerm('');
                    setSearchResults([]);
                }}>
                    <option value="RECOMMENDATION_LETTER_MEMBER">Carta de Recomendação de Membro</option>
                    <option value="RECOMMENDATION_LETTER_MINISTER">Carta de Recomendação de Ministro</option>
                </select>
            </div>
            <div className="form-group">
                <label>{documentType === 'RECOMMENDATION_LETTER_MEMBER' ? 'Buscar Membro' : 'Buscar Ministro'}</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    placeholder="Digite 3 ou mais letras para buscar..."
                    disabled={isLoading}
                />
                {searchResults.length > 0 && (
                    <ul className="search-results">
                        {searchResults.map(person => (
                            // Agora o TS sabe que 'person' tem 'id' e 'fullName'
                            <li key={person.id} onClick={() => handleSelectPerson(person)}>
                                {person.fullName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* O resto do seu JSX continua igual e agora sem erros... */}
            <div className="form-group">
                 <label>Finalidade (Opcional)</label>
                 <textarea
                     value={purpose}
                     onChange={(e) => setPurpose(e.target.value)}
                     rows={3}
                 ></textarea>
             </div>
             {error && <p className="error-message">{error}</p>}
             <button type="submit" disabled={isLoading}>
                 {isLoading ? 'Gerando...' : 'Gerar Documento'}
             </button>
        </form>
    );
};

export default DocumentGeneratorForm;