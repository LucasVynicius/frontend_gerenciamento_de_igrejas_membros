import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { Modal } from '../components';

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'SECRETARY';
}

interface ModalContent {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

const RegisterPage = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<'ADMIN' | 'SECRETARY' | ''>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        message: '',
        type: 'info'
    });
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData: RegisterRequest = { username, email, password, role: role as 'ADMIN' | 'SECRETARY' };
            await register(userData);
            setModalContent({
                title: 'Registro bem-sucedido',
                message: 'Usuário registrado com sucesso. Você será redirecionado para a página de login.',
                type: 'success'
            });
            setIsModalOpen(true);
            navigate('/');
        }
        catch (error: unknown) {
            const errorMessage = (error as Error).message || 'Erro ao registrar usuário. Verifique os dados informados.';
            setModalContent({
                title: 'Erro ao registrar',
                message: errorMessage,
                type: 'error'
            });
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header text-center">Registrar</h5>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nome de Usuário</label>
                  <input type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Senha</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Função</label>
                  <select className="form-select" id="role" value={role} onChange={e => setRole(e.target.value as 'ADMIN' | 'SECRETARY' | '')} required>
                    <option value="">Selecione uma função</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SECRETARY">Secretária</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title} children={modalContent.message} type={modalContent.type} />
    </div>
  );
}

export default RegisterPage;