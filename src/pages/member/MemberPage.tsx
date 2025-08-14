import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../../context/useAuth';
import Modal from '../../components/Modal';
import MemberForm from '../../components/member-form/MemberForm';
import UploadPhotoModal from '../../components/upload-photo-modal/UploadPhotoModal';
import CredentialCard from '../../components/credential-card/CredentialCard';
import {
    getMembers,
    createMember,
    updateMember,
    deleteMember,
    uploadMemberPhoto,
    getMemberById
} from '../../services/member/memberService';
import { getChurches } from '../../services/church/ChurchService';
import { getMemberCredential } from '../../services/credential/CredentialService';
import type { Member, MemberRequestDTO, MemberUpdateRequestDTO } from '../../types/member/Member';
import type { Church } from '../../types/church/Church';
import type { CredentialData } from '../../types/credential/Credential';

import { FaEdit, FaTrash, FaEye, FaIdCard, FaCamera } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';

const MemberPage: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [churches, setChurches] = useState<Church[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [credentialData, setCredentialData] = useState<CredentialData | null>(null);

    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'details' | 'upload' | 'credential' | 'info' | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const { user } = useAuth();
    const credentialRef = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: 'Credencial do Membro',
        contentRef: credentialRef
    });

    const handleShowInfoModal = useCallback((title: string, message: string) => {
        setModalContent({ title, message });
        setModalType('info');
    }, []);

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const [memberData, churchData] = await Promise.all([getMembers(), getChurches()]);
            setMembers(memberData);
            setChurches(churchData);
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [handleShowInfoModal]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const closeModal = useCallback(() => {
        setModalType(null);
        setSelectedMember(null);
        setCredentialData(null);
    }, []);

    const handleCreate = useCallback(() => setModalType('create'), []);
    const handleEdit = useCallback((member: Member) => { setSelectedMember(member); setModalType('edit'); }, []);
    const handleDelete = useCallback((member: Member) => { setSelectedMember(member); setModalType('delete'); }, []);
    const handleDetails = useCallback((member: Member) => { setSelectedMember(member); setModalType('details'); }, []);
    const handleUpload = useCallback((member: Member) => { setSelectedMember(member); setModalType('upload'); }, []);

    const handleGenerateCredential = useCallback(async (member: Member) => {
        console.log('Dados do membro na hora de gerar a credencial:', member);
        
        if (!member.photoUrl) {
            handleShowInfoModal('Atenção', 'Este membro ainda não possui uma foto. Por favor, faça o upload da foto primeiro.');
            return;
        }
        try {
            // Usa o ID do membro para gerar a credencial
            const data = await getMemberCredential(member.id);
            setCredentialData(data);
            setSelectedMember(member); 
            setModalType('credential');
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        }
    }, [handleShowInfoModal]);

    const handleFormSubmit = useCallback(async (data: MemberRequestDTO | MemberUpdateRequestDTO) => {
        setIsSubmitting(true);
        try {
            if (modalType === 'create') {
                await createMember(data as MemberRequestDTO);
                handleShowInfoModal('Sucesso!', 'Membro criado com sucesso!');
            } else if (selectedMember) {
                await updateMember(selectedMember.id, data as MemberUpdateRequestDTO);
                handleShowInfoModal('Sucesso!', 'Membro atualizado com sucesso!');
            }
            closeModal();
            fetchPageData();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [modalType, selectedMember, closeModal, fetchPageData, handleShowInfoModal]);


    const onDeleteConfirm = useCallback(async () => {
        if (!selectedMember) return;
        setIsSubmitting(true);
        try {
            await deleteMember(selectedMember.id);
            handleShowInfoModal('Sucesso!', 'Membro excluído com sucesso!');
            closeModal();
            fetchPageData();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedMember, closeModal, fetchPageData, handleShowInfoModal]);

    const handlePhotoSubmit = useCallback(async (file: File) => {
        console.log('Dados do membro antes do upload:', selectedMember);
        if (!selectedMember) return;
        setIsSubmitting(true);
        try {
    
            await uploadMemberPhoto(selectedMember.id, file);

            const updatedMember = await getMemberById(selectedMember.id);
            console.log('Dados do membro APÓS a atualização:', updatedMember);
            setSelectedMember(updatedMember);

            handleShowInfoModal('Sucesso!', 'Foto enviada com sucesso. Agora você já pode gerar a credencial.');
            closeModal();

            fetchPageData();

        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message || 'Falha ao enviar a foto.');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedMember, closeModal, fetchPageData, handleShowInfoModal]);;

    if (loading) return <div className="loading-message">Carregando membros...</div>;

    return (
        <div className="page-container">
            <div className="page-header-container">
                <div className="page-title-group">
                    <h1>Gerenciamento de Membros</h1>
                    <p>Adicione, edite e visualize as informações dos membros. {user?.firstName} {user?.lastName}</p>
                </div>
                <div className="page-actions">
                    <button className="btn-add" onClick={handleCreate}>Adicionar Membro</button>
                </div>
            </div>

            <div className="table-container">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome Completo</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Igreja</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td>{member.fullName}</td>
                                <td>{member.cpf}</td>
                                <td>{member.telephone}</td>
                                <td>{member.churchName} ({member.churchTradeName})</td>
                                <td>{member.active ? "Ativo" : "Inativo"}</td>
                                <td className="actions-cell">
                                    <button className="btn btn-sm btn-info me-2" onClick={() => handleDetails(member)} title="Ver Detalhes"><FaEye /></button>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(member)} title="Editar"><FaEdit /></button>
                                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(member)} title="Excluir"><FaTrash /></button>
                                    <button className="btn btn-sm btn-secondary me-2" onClick={() => handleUpload(member)} title="Upload de Foto"><FaCamera /></button>
                                    <button className="btn btn-sm btn-primary" onClick={() => handleGenerateCredential(member)} title="Gerar Credencial"><FaIdCard /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={modalType === 'create' || modalType === 'edit'} onClose={closeModal} title={modalType === 'create' ? 'Adicionar Novo Membro' : `Editar Membro: ${selectedMember?.fullName}`}>
                <MemberForm
                    onSubmit={handleFormSubmit}
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                    initialData={modalType === 'edit' ? selectedMember : null}
                    churches={churches}
                />
            </Modal>

            {selectedMember && (
                <Modal isOpen={modalType === 'details'} onClose={closeModal} title={`Detalhes de: ${selectedMember.fullName}`}>
                    <div>
                        <p><strong>CPF:</strong> {selectedMember.cpf}</p>
                        <p><strong>RG:</strong> {selectedMember.rg}</p>
                        <p><strong>Email:</strong> {selectedMember.email}</p>
                        <p><strong>Telefone:</strong> {selectedMember.telephone}</p>
                        <p><strong>Nascimento:</strong> {new Date(selectedMember.dateOfBirth).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedMember.active ? "Ativo" : "Inativo"}</p>
                        <hr />
                        <p><strong>Igreja:</strong> {selectedMember.churchName} ({selectedMember.churchTradeName})</p>
                    </div>
                </Modal>
            )}

            {selectedMember && (
                <Modal isOpen={modalType === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
                    <p>Tem certeza que deseja excluir o membro <strong>{selectedMember.fullName}</strong>?</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>{isSubmitting ? 'Excluindo...' : 'Excluir'}</button>
                    </div>
                </Modal>
            )}

            {selectedMember && (
                <UploadPhotoModal
                    isOpen={modalType === 'upload'}
                    onClose={closeModal}
                    onSubmit={handlePhotoSubmit}
                    isSubmitting={isSubmitting}
                    memberName={selectedMember.fullName}
                />
            )}

            {selectedMember && credentialData && (
                <Modal isOpen={modalType === 'credential'} onClose={closeModal} title="Credencial do Membro">
                    <div ref={credentialRef}>
                        <CredentialCard data={credentialData} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal}>Fechar</button>
                        <button className="btn btn-success" onClick={handlePrint}>Baixar PDF</button>
                    </div>
                </Modal>
            )}

            <Modal isOpen={modalType === 'info'} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
};

export default MemberPage;