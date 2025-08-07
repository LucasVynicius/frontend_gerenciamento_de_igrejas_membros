import React, { useState, useEffect } from 'react';
import { getChurches, createChurch, updateChurch, deleteChurch } from '../../services/church/ChurchService';
import type { ChurchRequestDTO } from '../../services/church/ChurchService';
import type { Church } from '../../types/church/Church';
import Modal from '../../components/Modal';
import ChurchForm from '../../components/churchForm/ChurchForm';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ChurchPage: React.FC = () => {
    const [churches, setChurches] = useState<Church[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'details' | 'info' | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleCreate = () => { setModalType('create'); setIsModalOpen(true); };
    const handleEdit = (church: Church) => { setSelectedChurch(church); setModalType('edit'); setIsModalOpen(true); };
    const handleDelete = (church: Church) => { setSelectedChurch(church); setModalType('delete'); setIsModalOpen(true); };
    const handleDetails = (church: Church) => { setSelectedChurch(church); setModalType('details'); setIsModalOpen(true); };


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
        } catch (error: unknown) {
            let message = 'Ocorreu um erro ao salvar a igreja.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                message = err.response?.data?.message || message;
            }
            handleShowInfoModal('Erro', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    
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

    if (loading) return <div className="loading-message">Carregando...</div>;

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
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Nome Fantasia</th>
                            <th>Cidade/País</th>
                            <th>Pastor Local</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {churches.map(church => (
                            <tr key={church.id}>
                                <td>{church.name}</td>
                                <td>{church.tradeName}</td>
                                <td>{church.address.city} / {church.address.country}</td>
                                <td>{church.pastorLocalName || 'Não definido'}</td>
                                <td className="actions-cell">
                                    <button className="btn btn-sm btn-info me-2" onClick={() => handleDetails(church)} title="Ver Detalhes"><FaEye /></button>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(church)} title="Editar"><FaEdit /></button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(church)} title="Excluir"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen && (modalType === 'create' || modalType === 'edit')} onClose={closeModal} title={modalType === 'create' ? 'Adicionar Nova Igreja' : `Editar Igreja: ${selectedChurch?.name}`}>
                {(() => {
                    let nationality = '';
                    if (
                        selectedChurch &&
                        'nationality' in selectedChurch.address &&
                        typeof (selectedChurch.address as { nationality?: string }).nationality === 'string'
                    ) {
                        nationality = (selectedChurch.address as { nationality: string }).nationality;
                    }
                    return (
                        <ChurchForm
                            onSubmit={onFormSubmit}
                            onCancel={closeModal}
                            isSubmitting={isSubmitting}
                            initialData={
                                modalType === 'edit' && selectedChurch
                                    ? {
                                        name: selectedChurch.name,
                                        tradeName: selectedChurch.tradeName,
                                        registryType: selectedChurch.registryType,
                                        registryNumber: selectedChurch.registryNumber,
                                        foundationDate: selectedChurch.foundationDate,
                                        pastorLocalId: selectedChurch.pastorLocalId || null,
                                        address: {
                                            street: selectedChurch.address.street,
                                            number: selectedChurch.address.number,
                                            complement: selectedChurch.address.complement || '',
                                            neighborhood: selectedChurch.address.neighborhood,
                                            city: selectedChurch.address.city,
                                            state: selectedChurch.address.state,
                                            country: selectedChurch.address.country,
                                            zipCode: selectedChurch.address.zipCode,
                                            nationality
                                        }
                                    }
                                    : undefined
                            }
                        />
                    );
                })()}
            </Modal>

            {selectedChurch && (
                <Modal isOpen={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
                    <p>Tem certeza que deseja excluir a igreja <strong>{selectedChurch.name}</strong>?</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>{isSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}</button>
                    </div>
                </Modal>
            )}

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

            <Modal isOpen={isModalOpen && modalType === 'info'} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
}

export default ChurchPage;