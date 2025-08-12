import React, { useState, useEffect, useCallback } from 'react';
import { getMinisters, consecrateMinister, deleteMinister, updateMinister } from '../../services/minister/ministerService';
import Modal from '../../components/Modal';
import MinisterForm from '../../components/ministerForm/MinisterForm';
import { FaUserGraduate, FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';
import { Role } from '../../enums/Role';
import useAuth from '../../context/useAuth';
import { translatePosition } from '../../utils/translations';
import type { MinisterRequestDTO } from '../../services/minister/ministerService';
import type { Minister } from '../../types/minister/Minister';

const MinisterPage: React.FC = () => {
    const [ministers, setMinisters] = useState<Minister[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'details' | 'info' | null>(null);
    const [selectedMinister, setSelectedMinister] = useState<Minister | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    
    // Verificação de permissão centralizada
    const canManage = user?.role === Role.ADMIN || user?.role === Role.SECRETARY;

    const handleShowInfoModal = useCallback((title: string, message: string) => {
        setModalType('info');
        setModalContent({ title, message });
    }, []);

    const fetchMinisters = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMinisters();
            setMinisters(data);
        } catch  {
            handleShowInfoModal('Erro', 'Falha ao carregar a lista de ministros.');
        } finally {
            setLoading(false);
        }
    }, [handleShowInfoModal]);

    useEffect(() => {
        fetchMinisters();
    }, [fetchMinisters]);

    const closeModal = useCallback(() => {
        setModalType(null);
        setSelectedMinister(null);
    }, []);

    const handleConsecrate = useCallback(() => { setModalType('create'); }, []);
    const handleEdit = useCallback((minister: Minister) => { setSelectedMinister(minister); setModalType('edit'); }, []);
    const handleDelete = useCallback((minister: Minister) => { setSelectedMinister(minister); setModalType('delete'); }, []);
    const handleDetails = useCallback((minister: Minister) => { setSelectedMinister(minister); setModalType('details'); }, []);

    const handleFormSubmit = useCallback(async (data: MinisterRequestDTO) => {
        setIsSubmitting(true);
        try {
            if (modalType === 'create') {
                await consecrateMinister(data);
                handleShowInfoModal('Sucesso!', 'Membro consagrado com sucesso!');
            } else if (selectedMinister) {
                await updateMinister(selectedMinister.id, data);
                handleShowInfoModal('Sucesso!', 'Registro ministerial atualizado com sucesso!');
            }
            closeModal();
            fetchMinisters();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [modalType, selectedMinister, closeModal, fetchMinisters, handleShowInfoModal]);

    const onDeleteConfirm = useCallback(async () => {
        if (!selectedMinister) return;
        setIsSubmitting(true);
        try {
            await deleteMinister(selectedMinister.id);
            handleShowInfoModal('Sucesso!', 'Registro ministerial removido com sucesso.');
            closeModal();
            fetchMinisters();
        } catch {
            handleShowInfoModal('Erro', 'Falha ao remover o registro ministerial.');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedMinister, closeModal, fetchMinisters, handleShowInfoModal]);

    if (loading) return <div className="loading-message">Carregando ministros...</div>;

    return (
        <div className="page-container">
            <div className="page-header-container">
                <div className="page-title-group">
                    <h1>Gerenciamento de Ministros</h1>
                    <p>Consagre membros a cargos ministeriais e gerencie os registros.</p>
                </div>
                {canManage && (
                    <div className="page-actions">
                        <button className="btn-add" onClick={handleConsecrate}>
                            <FaUserGraduate /> Consagrar Membro
                        </button>
                    </div>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome Completo</th>
                            <th>Cargo</th>
                            <th>Igreja</th>
                            <th>Data de Consagração</th>
                            {canManage && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {ministers.length > 0 ? ministers.map(minister => (
                            <tr key={minister.id}>
                                <td>{minister.fullName}</td>
                                <td>{translatePosition(minister.position)}</td>
                                <td>{minister.churchName} ({minister.churchTradeName})</td>
                                <td>{new Date(minister.consecrationDate).toLocaleDateString()}</td>
                                {canManage && (
                                    <td className="actions-cell">
                                        <button onClick={() => handleDetails(minister)} className="btn btn-sm btn-info me-2" title="Ver Detalhes"><FaEye /></button>
                                        <button onClick={() => handleEdit(minister)} className="btn btn-sm btn-warning me-2" title="Editar"><FaEdit /></button>
                                        <button onClick={() => handleDelete(minister)} className="btn btn-sm btn-danger" title="Remover Cargo"><FaTrashAlt /></button>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={canManage ? 5 : 4} className="text-center">Nenhum ministro encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={modalType === 'create' || modalType === 'edit'} 
                onClose={closeModal} 
                title={modalType === 'create' 
                    ? 'Consagrar Novo Ministro' 
                    : `Editar Registro de: ${selectedMinister?.fullName}`
                }
            >
                <MinisterForm
                    onSubmit={handleFormSubmit}
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                    initialData={modalType === 'edit' ? selectedMinister : undefined}
                />
            </Modal>

            {selectedMinister && (
                <Modal isOpen={modalType === 'details'} onClose={closeModal} title={`Detalhes de: ${selectedMinister.fullName}`}>
                    <div>
                        <p><strong>CPF:</strong> {selectedMinister.cpf}</p>
                        <p><strong>Cargo:</strong> {translatePosition(selectedMinister.position)}</p>
                        <p><strong>Igreja:</strong> {selectedMinister.churchName} ({selectedMinister.churchTradeName})</p>
                        <p><strong>Data de Consagração:</strong> {new Date(selectedMinister.consecrationDate).toLocaleDateString()}</p>
                    </div>
                </Modal>
            )}

            {selectedMinister && (
                <Modal isOpen={modalType === 'delete'} onClose={closeModal} title="Confirmar Remoção">
                    <p>Tem certeza que deseja remover o cargo de <strong>{translatePosition(selectedMinister.position)}</strong> de <strong>{selectedMinister.fullName}</strong>?</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>
                            {isSubmitting ? 'Removendo...' : 'Sim, Remover'}
                        </button>
                    </div>
                </Modal>
            )}

            <Modal isOpen={modalType === 'info'} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
};

export default MinisterPage;