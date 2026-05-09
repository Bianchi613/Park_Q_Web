import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveSession, saveVisitorSession } from '../../services/authService';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleVisitor = () => {
    saveVisitorSession();
    navigate('/client-dashboard');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const session = await login(formData);

      if (!session.access_token || !session.role) {
        setError('Erro ao fazer login: dados invalidos.');
        return;
      }

      saveSession(session);

      if (session.role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
        return;
      }

      navigate('/client-dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="login-container">
      <h1>Park Q</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn">
          Entrar
        </button>

        <button type="button" className="visitor-button" onClick={handleVisitor}>
          Entrar como visitante
        </button>

        <a href="/forgot-password" className="forgot-password">
          Esqueceu a senha?
        </a>
      </form>
    </div>
  );
}

export default Login;
