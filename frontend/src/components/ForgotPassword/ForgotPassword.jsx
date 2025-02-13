import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // Importando o CSS atualizado

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o email de recuperação de senha
    setMessage('Instruções de recuperação foram enviadas para o seu e-mail.');

    // Redirecionar para a página de login após 3 segundos
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="forgot-password-container">
      <h2>Esqueci a Senha</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu e-mail"
          />
        </div>
        <button type="submit" className="submit-button">
          Enviar Instruções
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;