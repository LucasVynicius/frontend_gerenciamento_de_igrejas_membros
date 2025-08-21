import React, { useState, useEffect, useCallback } from 'react';
import { getAllRoles, getAllPermissions, updateRolePermissions } from '../../services/permission/permissionService';
import { getAllUsers } from '../../services/user/userService';
import { UserInfo } from '../../services/user/userService';
import { RoleResponseDTO, PermissionResponseDTO } from '../../types/permission/permission';
import Modal from '../../components/Modal'; // Assumindo que você tem um componente Modal
import { FaEdit } from 'react-icons/fa';
import './PermissionPage.css';

const PermissionsPage: React.FC = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [roles, setRoles] = useState<RoleResponseDTO[]>([]);
    const [permissions, setPermissions] = useState<PermissionResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleResponseDTO | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null); // Adicionado estado de erro

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        setError(null); // Limpa o erro anterior
        try {
            const [usersData, rolesData, permissionsData] = await Promise.all([
                getAllUsers(),
                getAllRoles(),
                getAllPermissions()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setPermissions(permissionsData);
        } catch (err) {
            let errorMessage = 'Falha ao carregar os dados. Verifique sua conexão ou permissões.';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage); // Armazena a mensagem de erro
            console.error('Erro ao carregar dados de permissões', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const handleEditPermissions = useCallback((role: RoleResponseDTO) => {
        setSelectedRole(role);
        setSelectedPermissions(role.permissions.map(p => p.name));
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedRole(null);
        setSelectedPermissions([]);
    }, []);

    const handlePermissionChange = useCallback((permissionName: string, isChecked: boolean) => {
        setSelectedPermissions(prevPermissions => 
            isChecked ? [...prevPermissions, permissionName] : prevPermissions.filter(p => p !== permissionName)
        );
    }, []);

    const handleSavePermissions = useCallback(async () => {
        if (!selectedRole) return;

        setIsSaving(true);
        try {
            await updateRolePermissions(selectedRole.id, selectedPermissions);
            closeModal();
            fetchPageData(); // Recarrega os dados para mostrar as mudanças
        } catch (err) {
            let errorMessage = 'Erro ao salvar as permissões.';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage); // Armazena a mensagem de erro
            console.error('Erro ao salvar permissões', err);
        } finally {
            setIsSaving(false);
        }
    }, [selectedRole, selectedPermissions, closeModal, fetchPageData]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div className="error-message">Erro: {error}</div>;
    }

    return (
        <div className="permissions-page-container">
            <h1>Gerenciamento de Permissões</h1>
            
            {/* Tabela de Papéis (Roles) */}
            <h2>Papéis (Roles)</h2>
            <table className="roles-table">
                <thead>
                    <tr>
                        <th>Papel</th>
                        <th>Permissões</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.id}>
                            <td>{role.name}</td>
                            <td>
                                {role.permissions.map(p => p.name).join(', ')}
                            </td>
                            <td>
                                <button className="btn btn-sm btn-info" onClick={() => handleEditPermissions(role)}>
                                    <FaEdit /> Gerenciar Permissões
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para gerenciar permissões de um papel */}
            {selectedRole && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    title={`Gerenciar Permissões de ${selectedRole.name}`}
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSavePermissions(); }}>
                        <h3>Permissões Disponíveis:</h3>
                        <div className="permissions-list">
                            {permissions.map(p => (
                                <div key={p.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        id={`permission-${p.id}`}
                                        className="form-check-input"
                                        checked={selectedPermissions.includes(p.name)}
                                        onChange={(e) => handlePermissionChange(p.name, e.target.checked)}
                                        disabled={isSaving}
                                    />
                                    <label htmlFor={`permission-${p.id}`} className="form-check-label">
                                        {p.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer mt-4">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={closeModal} 
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={isSaving}
                            >
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            <hr />

            {/* Tabela de Usuários */}
            <h2>Usuários</h2>
            <p>O gerenciamento do papel de cada usuário pode ser feito em um formulário de edição de usuário, como já discutimos.</p>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nome de Usuário</th>
                        <th>Papel</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PermissionsPage;