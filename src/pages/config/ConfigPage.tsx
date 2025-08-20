import React, { useState, useEffect } from 'react';
// Importamos o hook 'useParams' do React Router para ler o ID da URL
import { useParams } from 'react-router-dom'; 
import { getChurchById, updateChurch } from '../../services/church/ChurchService'; 
import type { Church } from '../../types/church/Church';

const ConfigPage: React.FC = () => {
    // Pegamos o parâmetro 'id' que vem da URL
    // Ex: /configuracoes/123 -> id = "123"
    const { id } = useParams<{ id: string }>();

    const [churchData, setChurchData] = useState<Church | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Converte o ID de string para number, já que a API espera um number
    // Se o ID for inválido (undefined, null, NaN), o valor será 0 ou null, que não vai passar na validação abaixo
    const churchId = id ? parseInt(id) : null;

    useEffect(() => {
        const fetchChurchData = async () => {
            // Se o ID não for válido, não faz a requisição e mostra um erro
            if (!churchId) {
                setError('ID da igreja não fornecido na URL.');
                setLoading(false);
                return;
            }

            try {
                // Chama a API com o ID que pegamos da URL
                const data = await getChurchById(churchId);
                setChurchData(data);
            } catch {
                setError('Falha ao carregar os dados da igreja. O ID pode estar incorreto.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchChurchData();
        // O useEffect deve ser re-executado sempre que o ID na URL mudar
    }, [churchId]); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChurchData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Se não tiver dados ou ID, interrompe a função
        if (!churchData || !churchId) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Chama a API de atualização usando o ID e os dados do estado
            await updateChurch(churchId, churchData);
            alert('Dados da igreja atualizados com sucesso!');
        } catch {
            setError('Falha ao salvar as alterações.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Carregando configurações...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="page-container">
            <h1>Configurações da Igreja</h1>
            <p>Edite as informações principais da sua igreja que aparecerão nos documentos oficiais.</p>
            
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Nome Oficial</label>
                    <input 
                        type="text" 
                        name="name"
                        // O '?' garante que não vai quebrar se churchData for null
                        value={churchData?.name || ''}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Nome Fantasia</label>
                    <input 
                        type="text"
                        name="tradeName"
                        value={churchData?.tradeName || ''}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Cidade</label>
                    <input 
                        type="text"
                        name="city"
                        value={churchData?.city || ''}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                {/* Adicione outros campos como registryNumber, foundationDate, etc. */}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default ConfigPage;