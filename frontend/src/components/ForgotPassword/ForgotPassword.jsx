import { useState } from 'react'; // Removendo a importação de React
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para redirecionamento
import './ForgotPassword.css'; // Importando o CSS para estilização

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Inicializando o hook useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o email para recuperação de senha
    setMessage('Instruções de recuperação foram enviadas para o seu e-mail.');

    // Redirecionar para a página de login após 3 segundos
    setTimeout(() => {
      navigate('/login'); // Redireciona para a página de login
    }, 3000); // 3 segundos de delay para mostrar a mensagem antes de redirecionar
  };

  return (
    <div className="forgot-password-container">
      <h2>Esqueci a Senha</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar Instruções</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
