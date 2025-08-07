import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
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

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch {
            handleShowInfoModal('Erro', 'Falha ao carregar a lista de usuários.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setModalType(null);
        setNewPassword('');
    };

    const handleShowInfoModal = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setModalType('info');
        setModalContent({ title, message });
        setIsModalOpen(true);
    };

    const handleCreate = () => { setModalType('create'); setIsModalOpen(true); };
    const handleDelete = (user: UserInfo) => { setSelectedUser(user); setModalType('delete'); setIsModalOpen(true); };
    const handleResetPassword = (user: UserInfo) => { setSelectedUser(user); setModalType('resetPassword'); setIsModalOpen(true); };

    const handleToggleActivation = async (user: UserInfo) => {
        try {

            await activateUser(user.id, !user.enabled);
            handleShowInfoModal('Sucesso!', `Status do usuário ${user.username} foi atualizado.`);
            fetchUsers();
        } catch {
            handleShowInfoModal('Erro', 'Falha ao atualizar o status do usuário.');
        }
    };

    const handleCreateSubmit = async (data: UserRequestDTO) => {
        setIsSubmitting(true);
        try {
            await createUser(data);
            handleShowInfoModal('Sucesso!', `Usuário "${data.username}" criado. Agora precisa ser ativado.`, 'success');
            closeModal();
            fetchUsers();
        } catch (error) {
            handleShowInfoModal('Erro', (error as Error).message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            await deleteUser(selectedUser.id); // Certifique-se que deleteUser existe no seu userService
            handleShowInfoModal('Sucesso!', 'Usuário excluído.', 'success');
            closeModal();
            fetchUsers();
        } catch {
            handleShowInfoModal('Erro', 'Falha ao excluir o usuário.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPasswordConfirm = async () => {
        if (!selectedUser || !newPassword) return;
        setIsSubmitting(true);
        try {
            await resetUserPassword(selectedUser.id, newPassword);
            handleShowInfoModal('Sucesso!', `Senha do usuário ${selectedUser.username} foi resetada.`, 'success');
            closeModal();
        } catch {
            handleShowInfoModal('Erro', 'Falha ao resetar a senha.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading-message">Carregando usuários...</div>;

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
                        <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleResetPasswordConfirm} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}</button>
                    </div>
                </Modal>
            )}

            {selectedUser && (
                <Modal isOpen={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Confirmar Exclusão">
                    <p>Tem certeza que deseja excluir o usuário <strong>{selectedUser.username}</strong>?</p>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                        <button className="btn btn-danger" onClick={onDeleteConfirm} disabled={isSubmitting}>{isSubmitting ? 'Excluindo...' : 'Excluir'}</button>
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