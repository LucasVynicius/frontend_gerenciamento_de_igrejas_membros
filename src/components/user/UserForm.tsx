import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { UserRequestDTO } from '../../services/user/userService';


interface UserFormProps {
    onSubmit: (data: UserRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<UserRequestDTO>({
        defaultValues: {
            role: 'ADMIN',
        },
    });

    const handleFormSubmit: SubmitHandler<UserRequestDTO> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Nome de Usuário</label>
                <input id="username" {...register('username', { required: 'Nome de usuário é obrigatório' })} className="form-control" autoComplete='off' />
                {errors.username && <p className="text-danger">{errors.username.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" {...register('email', { required: 'Email é obrigatório' })} className="form-control" />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha</label>
                <input type="password" id="password" {...register('password', { required: 'Senha é obrigatória', minLength: 6 })} className="form-control" autoComplete='off' />
                {errors.password && <p className="text-danger">A senha precisa ter no mínimo 6 caracteres.</p>}
            </div>
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
            </div>
            <div className="modal-footer mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Criando...' : 'Criar Usuário'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;