import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const [error, setError] = useState(''); // Estado para mensagens de erro
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Resetando o erro antes de enviar

    try {
      // Enviando a requisição para a API de login
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: formData.email,
        senha: formData.senha,
      });

      console.log('Resposta da API:', response.data); // Verifique o que está sendo retornado pela API

      const { role, access_token: token, id: userId, id_estacionamento } = response.data;

      if (role && token) {
        // Armazenar o token JWT e o ID do usuário no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Armazenar o id_estacionamento, se existir
        if (id_estacionamento) {
          localStorage.setItem('id_estacionamento', id_estacionamento);
        } else {
          console.warn('id_estacionamento não encontrado na resposta do login.');
        }

        // Redireciona conforme o perfil do usuário
        if (role === 'ADMIN') {
          console.log('Redirecionando para o Admin Dashboard');
          navigate('/admin-dashboard', { replace: true });
        } else if (role === 'CLIENT') {
          console.log('Redirecionando para o Client Dashboard');
          navigate('/client-dashboard', { replace: true });
        } else {
          setError('Perfil inválido');
        }
      } else {
        setError('Erro ao fazer login: dados inválidos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(error.response?.data?.message || 'Erro ao fazer login.');
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

        <a href="/forgot-password" className="forgot-password">
          Esqueceu a senha?
        </a>
      </form>
    </div>
  );
}

export default Login;