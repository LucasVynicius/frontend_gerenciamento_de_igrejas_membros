import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import './Login.css'; 
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login({ username, password });
      navigate('/');
    } catch (err: unknown) {
      let message = 'Credenciais inválidas.';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as { message?: string }).message || message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/logo-login.png" alt="IGR Logo" className="login-logo" />
          <h2>Bem-vindo(a)</h2>
          <p>Sistema de Gerenciamento IGR</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required disabled={isSubmitting} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isSubmitting} />
          </div>
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;