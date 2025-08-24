import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth';
import { getAllUsers } from '../../services/user/userService';
import type { UserInfo, UserRequestDTO, UserUpdateRequestDTO} from '../../services/user/userService';
import Modal from '../../components/Modal';
import UserForm from '../../components/user/UserForm';
import { FaUserPlus, FaToggleOn, FaToggleOff, FaTrashAlt, FaKey, FaEdit } from 'react-icons/fa';
import { Role } from '../../enums/Role';
import { useUserMutations } from '../../hooks/useUserMutations';
import "./AdminUserPage.css"

const AdminUserPage: React.FC = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'delete' | 'resetPassword' | 'info' | 'edit' | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [newPassword, setNewPassword] = useState('');
    const { user: loggedInUser } = useAuth();
    
    const {
        isSubmitting,
        handleCreateUser,
        handleUpdateUser,
        handleDeleteUser,
        handleToggleUserActivation,
        handleResetUserPassword,
    } = useUserMutations();

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


    const handleCreate = useCallback(() => { setModalType('create'); setIsModalOpen(true); }, []);
    const handleEdit = useCallback((user: UserInfo) => { setSelectedUser(user); setModalType('edit'); setIsModalOpen(true); }, []);
    const handleDelete = useCallback((user: UserInfo) => { setSelectedUser(user); setModalType('delete'); setIsModalOpen(true); }, []);
    const handleResetPassword = useCallback((user: UserInfo) => { setSelectedUser(user); setModalType('resetPassword'); setIsModalOpen(true); }, []);

  
    const handleFormSubmit = useCallback(async (data: UserRequestDTO | UserUpdateRequestDTO) => {
        let result;
        // A chave para a refatoração está aqui: verificamos a existência do ID
        if ('id' in data && typeof data.id === 'number' && data.id > 0) {
            // Se tem um ID válido, é uma atualização
            result = await handleUpdateUser(data as UserUpdateRequestDTO);
        } else {
            // Caso contrário, é uma criação
            result = await handleCreateUser(data as UserRequestDTO);
        }

        if (result.success) {
            handleShowInfoModal('Sucesso!', result.message);
            closeModal();
            fetchUsers();
        } else {
            handleShowInfoModal('Erro', result.message);
        }
    }, [handleCreateUser, handleUpdateUser, closeModal, fetchUsers, handleShowInfoModal]);

    const onToggleActivation = useCallback(async (user: UserInfo) => {
        const result = await handleToggleUserActivation(user.id, !user.enabled);
        if (result.success) {
            handleShowInfoModal('Sucesso!', result.message);
            fetchUsers();
        } else {
            handleShowInfoModal('Erro', result.message);
        }
    }, [handleToggleUserActivation, handleShowInfoModal, fetchUsers]);


    const onDeleteConfirm = useCallback(async () => {
        if (!selectedUser) return;
        const result = await handleDeleteUser(selectedUser.id);
        if (result.success) {
            handleShowInfoModal('Sucesso!', result.message);
            closeModal();
            fetchUsers();
        } else {
            handleShowInfoModal('Erro', result.message);
        }
    }, [selectedUser, handleDeleteUser, closeModal, fetchUsers, handleShowInfoModal]);

    const onResetPasswordConfirm = useCallback(async () => {
        if (!selectedUser || !newPassword) {
            handleShowInfoModal('Atenção', 'Por favor, digite uma nova senha.');
            return;
        }
        const result = await handleResetUserPassword(selectedUser.id, newPassword);
        if (result.success) {
            handleShowInfoModal('Sucesso!', result.message);
            closeModal();
        } else {
            handleShowInfoModal('Erro', result.message);
        }
    }, [selectedUser, newPassword, handleResetUserPassword, closeModal, handleShowInfoModal]);
    
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
                                    <button onClick={() => onToggleActivation(user)} className={`btn btn-sm me-2 ${user.enabled ? 'btn-secondary' : 'btn-success'}`} title={user.enabled ? 'Desativar' : 'Ativar'}>
                                        {user.enabled ? <FaToggleOff /> : <FaToggleOn />}
                                    </button>
                                    <button onClick={() => handleEdit(user)} className="btn btn-sm btn-primary me-2" title="Editar"><FaEdit /></button>
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
                <UserForm onSubmit={handleFormSubmit} onCancel={closeModal} isSubmitting={isSubmitting} />
            </Modal>

            {selectedUser && (
                <Modal isOpen={isModalOpen && modalType === 'edit'} onClose={closeModal} title={`Editar Usuário: ${selectedUser.username}`}>
                    <UserForm onSubmit={handleFormSubmit} onCancel={closeModal} isSubmitting={isSubmitting} initialData={selectedUser} />
                </Modal>
            )}

            {selectedUser && (
                <Modal isOpen={isModalOpen && modalType === 'resetPassword'} onClose={closeModal} title={`Resetar Senha para ${selectedUser.username}`}>
                    <div className="mb-3">
                        <label htmlFor="newPassword">Nova Senha</label>
                        <input type="password" id="newPassword" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancelar</button>
                        <button className="btn btn-primary" onClick={onResetPasswordConfirm} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}</button>
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