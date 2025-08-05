
import React, { useState, useEffect } from 'react';
import { getChurches, createChurch, updateChurch, deleteChurch } from '../../services/church/ChurchService';
import type { ChurchRequestDTO } from '../../services/church/ChurchService';
import type { Church } from '../../types/church/Church';
import Modal from '../../components/Modal';
import ChurchForm from '../../components/churchForm/ChurchForm';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ChurchPage: React.FC = () => {
    // Aqui você pode adicionar lógica para buscar dados, manipular estado, etc.
    // Exemplo de uso do ChurchForm:
    const [churches, setChurches] = useState<Church[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

    // Estados para controlar os modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'details' | 'info' | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Função para buscar os dados da API
    const fetchChurches = async () => {
        setLoading(true);
        try {
            const data = await getChurches();
            setChurches(data);
        } catch {
            handleShowInfoModal('Erro', 'Falha ao carregar a lista de igrejas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChurches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedChurch(null);
        setModalType(null);
    };

    const handleShowInfoModal = (title: string, message: string) => {
        setModalType('info');
        setModalContent({ title, message });
        setIsModalOpen(true);
    };

    // Funções para abrir os diferentes modais
    const handleCreate = () => { setModalType('create'); setIsModalOpen(true); };
    const handleEdit = (church: Church) => { setSelectedChurch(church); setModalType('edit'); setIsModalOpen(true); };
    const handleDelete = (church: Church) => { setSelectedChurch(church); setModalType('delete'); setIsModalOpen(true); };
    const handleDetails = (church: Church) => { setSelectedChurch(church); setModalType('details'); setIsModalOpen(true); };

    // Lógica para submeter o formulário (criar ou editar)
    const onFormSubmit = async (data: ChurchRequestDTO) => {
        setIsSubmitting(true);
        try {
            if (modalType === 'create') {
                await createChurch(data);
                handleShowInfoModal('Sucesso!', 'Igreja criada com sucesso!');
            } else if (selectedChurch) {
                await updateChurch(selectedChurch.id, data);
                handleShowInfoModal('Sucesso!', 'Igreja atualizada com sucesso!');
            }
            closeModal();
            fetchChurches();
        } catch {
            handleShowInfoModal('Erro', 'Ocorreu um erro ao salvar a igreja.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Lógica para confirmar a exclusão
    const onDeleteConfirm = async () => {
        if (!selectedChurch) return;
        setIsSubmitting(true);
        try {
            await deleteChurch(selectedChurch.id);
            handleShowInfoModal('Sucesso!', 'Igreja excluída com sucesso!');
            closeModal();
            fetchChurches();
        } catch {
            handleShowInfoModal('Erro', 'Ocorreu um erro ao excluir a igreja.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading-message">Carregando igrejas...</div>;
    return (
        <div className="page-container">

            <div className="page-header-container">
                <div className="page-title-group">
                    <h1>Gerenciamento de Igrejas</h1>
                    <p>Adicione, edite e visualize as informações das igrejas.</p>
                </div>
                <div className="page-actions">
                    <button className="btn-add" onClick={handleCreate}>
                        + Adicionar Igreja
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Cidade/País</th>
                            <th>Pastor Local</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {churches.map(church => (
                            <tr key={church.id}>
                                <td>{church.name} ({church.tradeName})</td>
                                <td>{church.address.city} / {church.address.country}</td>
                                <td>{church.pastorLocalName || 'N/A'}</td>
                                <td className="actions-cell">
                                    {/* ... seus botões de ação ... */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação/Edição */}
            <Modal isOpen={isModalOpen && (modalType === 'create' || modalType === 'edit')} onClose={closeModal} title={modalType === 'create' ? 'Adicionar Nova Igreja' : `Editar Igreja: ${selectedChurch?.name}`}>
                <ChurchForm
                    onSubmit={onFormSubmit}
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                    initialData={modalType === 'edit' && selectedChurch ? {
                        ...selectedChurch,
                        address: {
                            ...selectedChurch.address,
                            complement: selectedChurch.address.complement ?? ''
                        }
                    } : undefined}
                />
            </Modal>

            {/* Modal de Exclusão */}
            <Modal isOpen={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
                <p>Tem certeza que deseja excluir a igreja <strong>{selectedChurch?.name}</strong>?</p>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                    <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>{isSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}</button>
                </div>
            </Modal>

            {/* Modal de Detalhes */}
            {selectedChurch && (
                <Modal isOpen={isModalOpen && modalType === 'details'} onClose={closeModal} title={`Detalhes de: ${selectedChurch.name}`}>
                    <div>
                        <p><strong>Nome Fantasia:</strong> {selectedChurch.tradeName}</p>
                        <p><strong>Registro:</strong> {selectedChurch.registryType} - {selectedChurch.registryNumber}</p>
                        <p><strong>Fundação:</strong> {new Date(selectedChurch.foundationDate).toLocaleDateString()}</p>
                        <p><strong>Pastor Local:</strong> {selectedChurch.pastorLocalName || 'Não definido'}</p>
                        <hr />
                        <h5>Endereço</h5>
                        <p>{selectedChurch.address.street}, {selectedChurch.address.number}</p>
                        <p>{selectedChurch.address.neighborhood}, {selectedChurch.address.city} - {selectedChurch.address.state}</p>
                        <p>{selectedChurch.address.country} - CEP: {selectedChurch.address.zipCode}</p>
                    </div>
                </Modal>
            )}

            {/* Modal de Informação (Sucesso/Erro) */}
            <Modal isOpen={isModalOpen && modalType === 'info'} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
}
export default ChurchPage;