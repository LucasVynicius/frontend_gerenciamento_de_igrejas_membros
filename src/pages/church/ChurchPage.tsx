import React, { useState, useEffect, useCallback } from 'react';
import { getChurches, createChurch, updateChurch, deleteChurch } from '../../services/church/ChurchService';
import { getMinisters } from '../../services/minister/ministerService';
import type { Church } from '../../types/church/Church';
import type { Minister } from '../../types/minister/Minister';
import Modal from '../../components/Modal';
import ChurchForm from '../../components/churchForm/ChurchForm';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import "./ChurchPage.css"

const ChurchPage: React.FC = () => {
    const [churches, setChurches] = useState<Church[]>([]);
    const [ministers, setMinisters] = useState<Minister[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'details' | 'info' | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleShowInfoModal = useCallback((title: string, message: string) => {
        setModalType('info');
        setModalContent({ title, message });
    }, []);

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const [churchData, ministerData] = await Promise.all([
                getChurches(),
                getMinisters()
            ]);
            setChurches(churchData);
            setMinisters(ministerData);
        } catch {
            handleShowInfoModal('Erro', 'Falha ao carregar os dados da página.');
        } finally {
            setLoading(false);
        }
    }, [handleShowInfoModal]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const closeModal = useCallback(() => {
        setModalType(null);
        setSelectedChurch(null);
    }, []);

    const handleCreate = useCallback(() => { setModalType('create'); }, []);
    const handleEdit = useCallback((church: Church) => { setSelectedChurch(church); setModalType('edit'); }, []);
    const handleDelete = useCallback((church: Church) => { setSelectedChurch(church); setModalType('delete'); }, []);
    const handleDetails = useCallback((church: Church) => { setSelectedChurch(church); setModalType('details'); }, []);

    const onFormSubmit = useCallback(async (data: Church) => {
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
            fetchPageData();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [modalType, selectedChurch, closeModal, fetchPageData, handleShowInfoModal]);

    const onDeleteConfirm = useCallback(async () => {
        if (!selectedChurch) return;
        setIsSubmitting(true);
        try {
            await deleteChurch(selectedChurch.id.toString());
            handleShowInfoModal('Sucesso!', 'Igreja excluída com sucesso!');
            closeModal();
            fetchPageData();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedChurch, closeModal, fetchPageData, handleShowInfoModal]);

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

            <Modal isOpen={modalType === 'create' || modalType === 'edit'} onClose={closeModal} title={modalType === 'create' ? 'Adicionar Nova Igreja' : `Editar Igreja: ${selectedChurch?.name}`}>
                <ChurchForm
                    onSubmit={onFormSubmit}
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                    initialData={modalType === 'edit' ? selectedChurch : undefined}
                    ministers={ministers}
                />
            </Modal>

            {selectedChurch && (
                <Modal isOpen={modalType === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
                    <p>Tem certeza que deseja excluir a igreja <strong>{selectedChurch.name}</strong>?</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>{isSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}</button>
                    </div>
                </Modal>
            )}
            
            {selectedChurch && (
                <Modal isOpen={modalType === 'details'} onClose={closeModal} title={`Detalhes de: ${selectedChurch.name}`}>
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

            <Modal isOpen={modalType === 'info'} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
};

export default ChurchPage;