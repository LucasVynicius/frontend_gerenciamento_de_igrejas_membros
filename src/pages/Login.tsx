import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { Modal } from '../components';


interface AuthRequest {
    username: string;
    password: string;
}

interface ModalContent {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        title: '',
        message: '',
        type: 'info'
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const credentials: AuthRequest = { username, password };
            await login(credentials);
            setModalContent({
                title: 'Login bem-sucedido',
                message: 'Você será redirecionado para a página inicial.',
                type: 'success'
            });
            setIsModalOpen(true);
            navigate('/home'); // Redireciona para a página inicial após o login
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || 'Erro ao efetuar login. Verifique suas credenciais.';
            setModalContent({
                title: 'Erro ao efetuar login',
                message: errorMessage,
                type: 'error'
            });
            setIsModalOpen(true);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header text-center">Login</h5>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nome de Usuário</label>
                  <input type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Senha</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title} children={modalContent.message} type={modalContent.type} />
    </div>
  );
}

export default Login;