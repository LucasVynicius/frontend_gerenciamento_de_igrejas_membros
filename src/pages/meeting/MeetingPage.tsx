import React, { useState, useEffect, useCallback } from 'react';
import { getMeetings, deleteMeeting, createMeeting, updateMeeting, downloadMeetingReport } from '../../services/meeting/meetingService';
import { getMinisters } from '../../services/minister/ministerService';
import type { MeetingResponseDTO, MeetingRequestDTO } from '../../services/meeting/meetingService';
import type { MinisterInfo } from '../../services/minister/ministerService';
import Modal from '../../components/Modal';
import MeetingForm from '../../components/meetingForm/MeetingForm';
import { FaPlus, FaEdit, FaTrashAlt, FaFilePdf } from 'react-icons/fa';

// import './MeetingReportsPage.css';

const MeetingReportsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<MeetingResponseDTO[]>([]);
    const [ministers, setMinisters] = useState<MinisterInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'info' | null>(null);
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingResponseDTO | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Adiciona o estado e a função para o modal de informações
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const handleShowInfoModal = useCallback((title: string, message: string) => {
        setModalContent({ title, message });
        setModalType('info');
        setIsModalOpen(true);
    }, []);

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const [meetingData, ministerData] = await Promise.all([getMeetings(), getMinisters()]);
            setMeetings(meetingData);
            setMinisters(ministerData);
        } catch (error) {
            let errorMessage = 'Erro ao carregar os dados.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            handleShowInfoModal('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [handleShowInfoModal]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedMeeting(null);
        setModalType(null);
    }, []);

    const handleCreate = useCallback(() => {
        setModalType('create');
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((meeting: MeetingResponseDTO) => {
        setSelectedMeeting(meeting);
        setModalType('edit');
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((meeting: MeetingResponseDTO) => {
        setSelectedMeeting(meeting);
        setModalType('delete');
        setIsModalOpen(true);
    }, []);

    const onDeleteConfirm = useCallback(async () => {
        if (!selectedMeeting) return;
        setIsSubmitting(true);
        try {
            await deleteMeeting(selectedMeeting.id);
            closeModal();
            fetchPageData();
            handleShowInfoModal('Sucesso!', 'Reunião excluída com sucesso.');
        } catch (error) {
            let errorMessage = 'Erro ao excluir reunião.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            handleShowInfoModal('Erro', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedMeeting, closeModal, fetchPageData, handleShowInfoModal]);
    
    const handleFormSubmit = useCallback(async (data: MeetingRequestDTO) => {
        setIsSubmitting(true);
        try {
            if (modalType === 'create') {
                await createMeeting(data);
                handleShowInfoModal('Sucesso!', 'Reunião criada com sucesso!');
            } else if (selectedMeeting) {
                await updateMeeting(selectedMeeting.id, data);
                handleShowInfoModal('Sucesso!', 'Reunião atualizada com sucesso!');
            }
            closeModal();
            fetchPageData();
        } catch (error) {
            let errorMessage = 'Erro ao salvar a reunião.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            handleShowInfoModal('Erro', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [modalType, selectedMeeting, closeModal, fetchPageData, handleShowInfoModal]);

    if (loading) return <div>Carregando relatórios...</div>;

    return (
        <div className="page-container">
            <div className="page-header-container">
                <h1>Relatórios de Reuniões</h1>
                <button className="btn-add" onClick={handleCreate}>
                    <FaPlus /> Adicionar Reunião
                </button>
            </div>
            
            <table className="table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Resumo</th>
                        <th>Participantes</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.length > 0 ? (
                        meetings.map(meeting => (
                            <tr key={meeting.id}>
                                <td>{new Date(meeting.date).toLocaleDateString()}</td>
                                <td>{meeting.summary}</td>
                                <td>{meeting.participants?.map(p => p.fullName).join(', ')}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleEdit(meeting)} className="btn btn-sm btn-warning me-2"><FaEdit /></button>
                                    <button onClick={() => handleDelete(meeting)} className="btn btn-sm btn-danger"><FaTrashAlt /></button>
                                    <button onClick={() => downloadMeetingReport(meeting.id)} className="btn btn-sm btn-info" title="Baixar Relatório"><FaFilePdf /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">Nenhuma reunião encontrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <Modal
                isOpen={isModalOpen && (modalType === 'create' || modalType === 'edit')}
                onClose={closeModal}
                title={modalType === 'create' ? 'Adicionar Reunião' : `Editar Reunião: ${selectedMeeting?.summary}`}
            >
                <MeetingForm 
                    initialData={selectedMeeting}
                    onSubmit={handleFormSubmit}
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                    ministers={ministers}
                />
            </Modal>
            
            {selectedMeeting && modalType === 'delete' && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title="Confirmar Exclusão">
                    <p>Tem certeza que deseja excluir a reunião de <strong>{new Date(selectedMeeting.date).toLocaleDateString()}</strong>?</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>Excluir</button>
                    </div>
                </Modal>
            )}

            {modalType === 'info' && (
                <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>
                    <p>{modalContent.message}</p>
                </Modal>
            )}
        </div>
    );
};

export default MeetingReportsPage;