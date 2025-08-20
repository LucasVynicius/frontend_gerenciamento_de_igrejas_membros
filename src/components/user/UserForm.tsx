import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
// As interfaces importadas estão corretas.
import type { UserRequestDTO, UserUpdateRequestDTO, UserInfo, UserFormValues } from '../../services/user/userService';
import { Role } from '../../enums/Role';
import './UserForm.css';

interface UserFormProps {
    // O tipo de dado no onSubmit está correto para lidar com criação e atualização.
    onSubmit: (data: UserRequestDTO | UserUpdateRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    initialData?: UserInfo;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isSubmitting, initialData }) => {
    // O `useForm` agora inicializa com valores padrão para criar ou editar.
    // O `reset` no `useEffect` já garante que os valores do `initialData` sejam carregados.
    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormValues>({
        defaultValues: {
            // A inicialização `initialData?....` já cuida do valor padrão para novos formulários
            id: initialData?.id || undefined,
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            username: initialData?.username || '',
            email: initialData?.email || '',
            // No modo de edição, a role do usuário deve ser exibida
            // Para criação, o padrão é 'SECRETARY'
            role: initialData?.role || Role.SECRETARY,
            enabled: initialData?.enabled ?? false,
            password: '', // A senha deve ser sempre limpa ao abrir o formulário
        },
    });

    // O useEffect agora tem um reset mais simples e direto,
    // que será disparado apenas quando `initialData` mudar.
    // Usar o objeto completo no reset é mais seguro e limpo.
    useEffect(() => {
        if (initialData) {
            reset({
                id: initialData.id,
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                username: initialData.username,
                email: initialData.email,
                role: initialData.role,
                enabled: initialData.enabled,
                // Garantimos que o campo de senha está sempre vazio na edição
                password: '',
            });
        }
    }, [initialData, reset]);

    // O `handleFormSubmit` agora verifica o tipo de `data` para
    // decidir se é uma atualização ou criação, sem forçar tipagem.
    const handleFormSubmit: SubmitHandler<UserFormValues> = (data) => {
        // Se há um ID válido, é uma atualização
        if (data.id) {
            const updateData: UserUpdateRequestDTO = {
                id: data.id, // TS já sabe que é um number aqui
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                role: data.role as 'ADMIN' | 'SECRETARY', // Força o tipo do role
                enabled: data.enabled as boolean,
            };
            onSubmit(updateData);
        } else {
            // Se não há ID, é uma criação
            const createData: UserRequestDTO = {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                // A validação de senha é feita pelo `useForm`
                password: data.password!, // Use '!' para garantir que a senha existe na criação
                role: data.role as 'ADMIN' | 'SECRETARY',
            };
            onSubmit(createData);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div className="mb-3">
                <label htmlFor="firstName" className="form-label">Primeiro nome:</label>
                <input id="firstName" {...register('firstName', { required: 'Primeiro nome é obrigatório' })} className="form-control" autoComplete="off" />
                {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Último nome:</label>
                <input id="lastName" {...register('lastName', { required: 'Último nome é obrigatório' })} className="form-control" autoComplete="off" />
                {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Nome de Usuário</label>
                <input id="username" {...register('username', { required: 'Nome de usuário é obrigatório' })} className="form-control" autoComplete="off" disabled={!!initialData} />
                {errors.username && <p className="text-danger">{errors.username.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" {...register('email', { required: 'Email é obrigatório' })} className="form-control" />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            {/* O campo de senha só aparece se não for uma edição */}
            {!initialData && (
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input type="password" id="password" {...register('password', { required: 'Senha é obrigatória', minLength: 6 })} className="form-control" autoComplete="off" />
                    {errors.password && <p className="text-danger">A senha precisa ter no mínimo 6 caracteres.</p>}
                </div>
            )}
            <div className="mb-3">
                <label htmlFor="role" className="form-label">Perfil do Usuário</label>
                <select
                    id="role"
                    {...register('role', { required: 'O perfil é obrigatório' })}
                    className="form-select"
                >
                    <option value="">Selecione um perfil...</option>
                    <option value={Role.SECRETARY}>Secretaria</option>
                    <option value={Role.ADMIN}>Administrador</option>
                </select>
                {errors.role && <p className="text-danger">{errors.role.message}</p>}
            </div>
            <div className="modal-footer mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Criar Usuário'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;