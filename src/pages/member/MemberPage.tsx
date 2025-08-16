import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../../context/useAuth';
import Modal from '../../components/Modal';
import MemberForm from '../../components/member-form/MemberForm';
import UploadPhotoModal from '../../components/upload-photo-modal/UploadPhotoModal';
import CredentialCard from '../../components/credential-card/CredentialCard';
import { getMembers, createMember, updateMember, deleteMember, uploadMemberPhoto, getMemberById } from '../../services/member/memberService';
import { getChurches } from '../../services/church/ChurchService';
import { getMemberCredential } from '../../services/credential/CredentialService';
import { generateRecommendationLetter } from '../../services/document/DocumentService';
import type { Member, MemberRequestDTO, MemberUpdateRequestDTO } from '../../types/member/Member';
import type { Church } from '../../types/church/Church';
import type { CredentialData } from '../../types/credential/Credential';
import { FaEdit, FaTrash, FaEye, FaIdCard, FaCamera, FaFileAlt } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';


const MemberPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [credentialData, setCredentialData] = useState<CredentialData | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'details' | 'upload' | 'credential' | 'document' | 'info' | null>(null);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [documentPurpose, setDocumentPurpose] = useState('');

  const { user } = useAuth();
  const credentialRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: 'Credencial do Membro',
    contentRef: credentialRef
  });

  const handleShowInfoModal = useCallback((title: string, message: string) => {
    setModalContent({ title, message });
    setModalType('info');
  }, [setModalContent, setModalType]);

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
    setDocumentPurpose('');
  }, [setModalType, setSelectedMember, setCredentialData, setDocumentPurpose]);

  const handleCreate = useCallback(() => setModalType('create'), [setModalType]);
  const handleEdit = useCallback((member: Member) => { setSelectedMember(member); setModalType('edit'); }, [setModalType, setSelectedMember]);
  const handleDelete = useCallback((member: Member) => { setSelectedMember(member); setModalType('delete'); }, [setModalType, setSelectedMember]);
  const handleDetails = useCallback((member: Member) => { setSelectedMember(member); setModalType('details'); }, [setModalType, setSelectedMember]);
  const handleUpload = useCallback((member: Member) => { setSelectedMember(member); setModalType('upload'); }, [setModalType, setSelectedMember]);

  const handleGenerateDocument = useCallback((member: Member) => {
    setSelectedMember(member);
    setModalType('document');
  }, [setModalType, setSelectedMember]);

  const handleGenerateCredential = useCallback(async (member: Member) => {
    if (!member.photoUrl) {
      handleShowInfoModal('Atenção', 'Este membro ainda não possui uma foto. Por favor, faça o upload da foto primeiro.');
      return;
    }
    try {
      const data = await getMemberCredential(member.id);
      setCredentialData(data);
      setSelectedMember(member);
      setModalType('credential');
    } catch (error) {
      handleShowInfoModal('Erro', (error as Error).message);
    }
  }, [handleShowInfoModal, setSelectedMember, setCredentialData, setModalType]);

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
  }, [modalType, selectedMember, closeModal, fetchPageData, handleShowInfoModal, setIsSubmitting]);

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
  }, [selectedMember, closeModal, fetchPageData, handleShowInfoModal, setIsSubmitting]);

  const handlePhotoSubmit = useCallback(async (file: File) => {
    if (!selectedMember) return;
    setIsSubmitting(true);
    try {
      await uploadMemberPhoto(selectedMember.id, file);
      handleShowInfoModal('Sucesso!', 'Foto enviada com sucesso. Agora você já pode gerar a credencial.');
      closeModal();
      const updatedMember = await getMemberById(selectedMember.id);
      setSelectedMember(updatedMember);
      fetchPageData();
    } catch (error) {
      handleShowInfoModal('Erro', (error as Error).message || 'Falha ao enviar a foto.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMember, closeModal, fetchPageData, handleShowInfoModal, setIsSubmitting, getMemberById, uploadMemberPhoto, setSelectedMember]);

  const handleDocumentSubmit = useCallback(async () => {
    if (!selectedMember) return;
    setIsSubmitting(true);
    try {
      const response = await generateRecommendationLetter(selectedMember.id, documentPurpose);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `carta_recomendacao_${selectedMember.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      handleShowInfoModal('Sucesso!', 'Documento gerado e baixado com sucesso!');
      closeModal();
    } catch (error) {
      handleShowInfoModal('Erro', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMember, closeModal, handleShowInfoModal, setIsSubmitting]);

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
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleGenerateCredential(member)} title="Gerar Credencial"><FaIdCard /></button>
                  <button className="btn btn-sm btn-info" onClick={() => handleGenerateDocument(member)} title="Gerar Documento"><FaFileAlt /></button>
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

      {selectedMember && (
        <Modal isOpen={modalType === 'document'} onClose={closeModal} title="Gerar Documento">
          <div className="form-group mb-3">
            <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
            <select
              id="documentType"
              className="form-select"
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
            >
              <option value="">Selecione...</option>
              {/* Aqui a gente usaria o ENUM de documentos para gerar as opções */}
              <option value="DECLARACAO_MEMBRESIA">Declaração de Membresia</option>
              <option value="CARTA_RECOMENDACAO">Carta de Recomendação</option>
            </select>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleDocumentSubmit} disabled={isSubmitting || !selectedDocumentType}>
              {isSubmitting ? 'Gerando...' : 'Gerar Documento'}
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

export default MemberPage;