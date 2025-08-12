import { useState } from 'react';
import {
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  resetUserPassword,
  UserRequestDTO,
  UserUpdateRequestDTO,
} from '../services/user/userService';

export const useUserMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeMutation = async <T>(
    mutationFn: () => Promise<T>,
    successMessage: string
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await mutationFn();
      return { success: true, message: successMessage };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = (userData: UserRequestDTO) =>
    executeMutation(
      () => createUser(userData),
      `Usuário "${userData.username}" criado. Agora precisa ser ativado.`
    );

  const handleUpdateUser = (userData: UserUpdateRequestDTO) =>
    executeMutation(
      () => updateUser(userData),
      `Usuário "${userData.username}" atualizado.`
    );

  const handleDeleteUser = (userId: number) =>
    executeMutation(
      () => deleteUser(userId),
      'Usuário excluído com sucesso.'
    );

  const handleToggleUserActivation = (userId: number, enabled: boolean) =>
    executeMutation(
      () => activateUser(userId, enabled),
      `Status do usuário foi atualizado.`
    );
  
  const handleResetUserPassword = (userId: number, newPassword: string) =>
  executeMutation(
    () => resetUserPassword(userId, newPassword),
    `Senha do usuário foi resetada.`
  );

  return {
    isSubmitting,
    error,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleUserActivation,
    handleResetUserPassword,
  };
};