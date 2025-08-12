import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth'; // Assumindo que o hook foi movido
import { getAllUsers, createUser, activateUser, resetUserPassword, deleteUser } from '../../services/user/userService';
import type { UserInfo, UserRequestDTO } from '../../services/user/userService';
import Modal from '../../components/Modal';
import UserForm from '../../components/user/UserForm';
import { FaUserPlus, FaToggleOn, FaToggleOff, FaTrashAlt, FaKey } from 'react-icons/fa';
import { Role } from '../../enums/Role';

const AdminUserPage: React.FC = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'delete' | 'resetPassword' | 'info' | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user: loggedInUser } = useAuth();

    // 1. Envolvemos as funções em useCallback para otimização
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setModalType(null);
        setNewPassword('');
    }, []);

    const handleShowInfoModal = useCallback((title: string, message: string) => {
        setModalType('info');
        setModalContent({ title, message });
        setIsModalOpen(true);
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Falha ao carregar a lista de usuários.';
            handleShowInfoModal('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [handleShowInfoModal]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Handlers para abrir modais ---
    const handleCreate = useCallback(() => { setModalType('create'); setIsModalOpen(true); }, []);
    const handleDelete = useCallback((user: UserInfo) => { setSelectedUser(user); setModalType('delete'); setIsModalOpen(true); }, []);
    const handleResetPassword = useCallback((user: UserInfo) => { setSelectedUser(user); setModalType('resetPassword'); setIsModalOpen(true); }, []);

    // --- Handlers de Ações ---
    const handleToggleActivation = useCallback(async (user: UserInfo) => {
        try {
            await activateUser(user.id, !user.enabled);
            handleShowInfoModal('Sucesso!', `Status do usuário ${user.username} foi atualizado.`);
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Falha ao atualizar o status do usuário.';
            handleShowInfoModal('Erro', message);
        }
    }, [fetchUsers, handleShowInfoModal]);

    const handleCreateSubmit = useCallback(async (data: UserRequestDTO) => {
        setIsSubmitting(true);
        try {
            await createUser(data);
            handleShowInfoModal('Sucesso!', `Usuário "${data.username}" criado. Agora precisa ser ativado.`);
            closeModal();
            fetchUsers();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [closeModal, fetchUsers, handleShowInfoModal]);

    const onDeleteConfirm = useCallback(async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            await deleteUser(selectedUser.id); 
            handleShowInfoModal('Sucesso!', 'Usuário excluído.');
            closeModal();
            fetchUsers();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedUser, closeModal, fetchUsers, handleShowInfoModal]);

    const handleResetPasswordConfirm = useCallback(async () => {
        if (!selectedUser || !newPassword) {
            handleShowInfoModal('Atenção', 'Por favor, digite uma nova senha.');
            return;
        }
        setIsSubmitting(true);
        try {
            await resetUserPassword(selectedUser.id, newPassword);
            handleShowInfoModal('Sucesso!', `Senha do usuário ${selectedUser.username} foi resetada.`);
            closeModal();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedUser, newPassword, closeModal, handleShowInfoModal]);

    if (loading) return <div className="loading-message">Carregando usuários...</div>;

    // O JSX continua o mesmo, pois a lógica de renderização já estava correta.
    return (
        <div className="page-container">
            <div className="page-header-container">
                 <div className="page-title-group">
                    <h1>Gerenciamento de Usuários</h1>
                    <p>Crie, ative e gerencie os usuários do sistema.</p>
                </div>
                <div className="page-actions">
                    <button className="btn-add" onClick={handleCreate}>
                        <FaUserPlus /> Adicionar Usuário
                    </button>
                </div>
            </div>

             <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role === Role.ADMIN ? 'Administrador' : 'Secretaria'}</td>
                                <td>{user.enabled ? 'Ativo' : 'Inativo'}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleToggleActivation(user)} className={`btn btn-sm me-2 ${user.enabled ? 'btn-secondary' : 'btn-success'}`} title={user.enabled ? 'Desativar' : 'Ativar'}>
                                        {user.enabled ? <FaToggleOff /> : <FaToggleOn />}
                                    </button>
                                    <button onClick={() => handleResetPassword(user)} className="btn btn-sm btn-warning me-2" title="Resetar Senha"><FaKey /></button>
                                    {loggedInUser?.id !== user.id && (
                                        <button onClick={() => handleDelete(user)} className="btn btn-sm btn-danger" title="Excluir"><FaTrashAlt /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen && modalType === 'create'} onClose={closeModal} title="Adicionar Novo Usuário">
                <UserForm onSubmit={handleCreateSubmit} onCancel={closeModal} isSubmitting={isSubmitting} />
            </Modal>

            {selectedUser && (
                <Modal isOpen={isModalOpen && modalType === 'resetPassword'} onClose={closeModal} title={`Resetar Senha para ${selectedUser.username}`}>
                    <div className="mb-3">
                        <label htmlFor="newPassword">Nova Senha</label>
                        <input type="password" id="newPassword" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleResetPasswordConfirm} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}</button>
                    </div>
                </Modal>
            )}

            {selectedUser && (
                <Modal isOpen={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
                    <p>Tem certeza que deseja excluir o usuário <strong>{selectedUser.username}</strong>? Esta ação não pode ser desfeita.</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>
                            {isSubmitting ? 'Excluindo...' : 'Sim, Excluir'}
                        </button>
                    </div>
                </Modal>
            )}

            <Modal isOpen={isModalOpen && modalType === 'info'} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
};

export default AdminUserPage;