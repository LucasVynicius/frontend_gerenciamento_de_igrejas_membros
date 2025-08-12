import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { UserRequestDTO, UserUpdateRequestDTO, UserInfo, UserFormValues } from '../../services/user/userService';
import { Role } from '../../enums/Role';

interface UserFormProps {
    onSubmit: (data: UserRequestDTO | UserUpdateRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    initialData?: UserInfo;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isSubmitting, initialData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormValues>({
        defaultValues: {
            id: initialData?.id || undefined,
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            username: initialData?.username || '',
            email: initialData?.email || '',
            role: initialData?.role || Role.SECRETARY,
            enabled: initialData?.enabled ?? false,
            password: '',
        },
    });

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
            });
        } else {
            reset({
                id: undefined,
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                role: Role.SECRETARY,
                enabled: false,
                password: '',
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit: SubmitHandler<UserFormValues> = (data) => {
        if (initialData) {
            const updateData: UserUpdateRequestDTO = {
                id: data.id as number,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                role: data.role,
                enabled: data.enabled as boolean,
            };
            onSubmit(updateData);
        } else {
            const createData: UserRequestDTO = {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                password: data.password as string,
                role: data.role,
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
                <input id="username" {...register('username', { required: 'Nome de usuário é obrigatório' })} className="form-control" autoComplete="off" />
                {errors.username && <p className="text-danger">{errors.username.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" {...register('email', { required: 'Email é obrigatório' })} className="form-control" />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
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
                    <option value={'SECRETARY'}>Secretaria</option>
                    <option value={'ADMIN'}>Administrador</option>
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