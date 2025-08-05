import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { Modal } from '../components';

interface AuthRequest {
    username: string;
    password: string;
}

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estados para o modal de ERRO
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsErrorModalOpen(false); 

        try {
            const credentials: AuthRequest = { username, password };
            await login(credentials);
            navigate('/'); // Redireciona para o Dashboard (raiz do site)

        } catch (error: unknown) {

            const message = (error as Error).message || 'Erro inesperado. Tente novamente.';
            setErrorMessage(message);
            setIsErrorModalOpen(true);
        } finally {
            setIsSubmitting(false); 
        }
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
                                    <input type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} required disabled={isSubmitting} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Senha</label>
                                    <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isSubmitting} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={isErrorModalOpen} 
                onClose={() => setIsErrorModalOpen(false)} 
                title="Erro ao Efetuar Login" 
                type="error"
            >
                <p>{errorMessage}</p>
            </Modal>
        </div>
    );
}

export default Login;