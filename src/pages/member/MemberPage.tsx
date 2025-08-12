import { useState, useEffect } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal";
import useAuth from "../../context/useAuth";
import MemberForm from "../../components/member-form/MemberForm";
import type { MemberRequestDTO } from "../../dtos/MemberRequestDTO";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface Member {
    id: number;
    fullName: string;
    cpf: string;
    rg: string;
    telephone: string;
    email: string;
    dateOfBirth: string;
    baptismDate: string;
    entryDate: string;
    active: boolean;
    address: {
        street: string;
        number: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        nationality: string;
        zipCode: string;
    };
    idChurch: number;
    churchName: string;
    churchTradeName: string;
    churchCity: string;
    churchCounty: string;
}

const MemberPage = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalContent, setModalContent] = useState({
        title: "",
        message: "",
        type: "info",
    });
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const { user } = useAuth();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

    const fetchMembers = async () => {
        try {
            const response = await api.get<Member[]>("/membros");
            setMembers(response.data);
        } catch {
            setModalContent({
                title: "Erro ao carregar membros",
                message: "Não foi possível carregar a lista de membros. Tente novamente mais tarde.",
                type: "error",
            });
            setIsInfoModalOpen(true);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user) {
            fetchMembers();
        }
    }, [user]);

    const openMemberDetails = (member: Member) => {
        setSelectedMember(member);
    };
    const closeDetailsModal = () => {
        setSelectedMember(null);
    };

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const openEditModal = (member: Member) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedMember(null);
    };

    const openDeleteModal = (member: Member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedMember(null);
    };

    const handleCreateSubmit = async (data: MemberRequestDTO) => {
        setIsSubmitting(true);
        try {
            await api.post("/membros", data);
            closeCreateModal();
            setModalContent({
                title: "Sucesso!",
                message: "Membro criado com sucesso!",
                type: "success",
            });
            setIsInfoModalOpen(true);
            fetchMembers();
        } catch {
            setModalContent({
                title: "Erro na criação",
                message: "Não foi possível criar o membro.",
                type: "error",
            });
            setIsInfoModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (data: MemberRequestDTO) => {
        if (!selectedMember) return;
        setIsSubmitting(true);
        try {
            await api.put(`/membros/${selectedMember.id}`, data);
            closeEditModal();
            setModalContent({
                title: "Sucesso!",
                message: "Membro atualizado com sucesso!",
                type: "success",
            });
            setIsInfoModalOpen(true);
            fetchMembers();
        } catch {
            setModalContent({
                title: "Erro na edição",
                message: "Não foi possível editar o membro.",
                type: "error",
            });
            setIsInfoModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedMember) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/membros/${selectedMember.id}`);
            closeDeleteModal();
            setModalContent({
                title: "Sucesso!",
                message: "Membro excluído com sucesso!",
                type: "success",
            });
            setIsInfoModalOpen(true);
            fetchMembers();
        } catch {
            setModalContent({
                title: "Erro na exclusão",
                message: "Não foi possível excluir o membro.",
                type: "error",
            });
            setIsInfoModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const MemberDetailsModal = () => {
        if (!selectedMember) return null;
        return (
            <Modal
                isOpen={!!selectedMember}
                onClose={closeDetailsModal}
                title="Detalhes do Membro"
                type="info"
            >
                <div>
                    <h6 style={{ textAlign: "center", marginBottom: "20px" }}>
                        {selectedMember.fullName}
                    </h6>
                    <p><strong>CPF:</strong> {selectedMember.cpf}</p>
                    <p><strong>RG:</strong> {selectedMember.rg}</p>
                    <p><strong>Email:</strong> {selectedMember.email}</p>
                    <p><strong>Telefone:</strong> {selectedMember.telephone}</p>
                    <p><strong>Data de Nascimento:</strong> {selectedMember.dateOfBirth}</p>
                    <p><strong>Status:</strong> {selectedMember.active ? "Ativo" : "Inativo"}</p>
                    <hr />
                    <p><strong>Igreja:</strong> {selectedMember.churchName}</p>
                    <p><strong>Endereço da Igreja:</strong> {selectedMember.churchCity}, {selectedMember.churchCounty}</p>
                    <hr />
                    <p><strong>Endereço do Membro:</strong> {selectedMember.address.street}, {selectedMember.address.number}</p>
                    <p><strong>Bairro:</strong> {selectedMember.address.neighborhood}</p>
                    <p><strong>Cidade/Estado:</strong> {selectedMember.address.city}/{selectedMember.address.state}</p>
                    <p><strong>País:</strong> {selectedMember.address.country}</p>
                </div>
            </Modal>
        );
    };

    if (loading) {
        return <div className="text-center mt-5">Carregando membros...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Gerenciamento de Membros</h2>
            <p className="text-center">
                Esta é uma página protegida. O usuário logado é:{" "}
                <strong>{user?.username}</strong>
            </p>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-success" onClick={openCreateModal}>
                    Adicionar Membro
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome Completo</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Igreja</th>
                            <th>Nome Fantasia</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? (
                            members.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.fullName}</td>
                                    <td>{member.cpf}</td>
                                    <td>{member.telephone}</td>
                                    <td>{member.churchName}</td>
                                    <td>{member.churchTradeName}</td>
                                    <td>{member.active ? "Ativo" : "Inativo"}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => openMemberDetails(member)}
                                        >
                                            
                                        <FaEye />
                                        </button>

                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => openEditModal(member)}
                                        >
                                           
                                        <FaEdit />
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => openDeleteModal(member)}
                                        >
                                            
                                        <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Nenhum membro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <MemberDetailsModal />

            <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title={modalContent.title} type={modalContent.type as "info" | "error" | "success" | undefined}>
                <p>{modalContent.message}</p>
            </Modal>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                title="Adicionar Novo Membro"
            >
                <MemberForm
                    onSubmit={handleCreateSubmit}
                    onCancel={closeCreateModal}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {selectedMember && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    title={`Editar Membro: ${selectedMember.fullName}`}
                >
                    <MemberForm
                        initialData={{
                            ...selectedMember,
                            address: {
                                ...selectedMember.address,
                                complement: selectedMember.address.complement ?? ""
                            }
                        }}
                        onSubmit={handleEditSubmit}
                        onCancel={closeEditModal}
                        isSubmitting={isSubmitting}
                    />
                </Modal>
            )}

            {selectedMember && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    title="Confirmar Exclusão"
                >
                    <div>
                        <p>
                            Tem certeza que deseja excluir o membro{" "}
                            <strong>{selectedMember.fullName}</strong>?
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeDeleteModal}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MemberPage;