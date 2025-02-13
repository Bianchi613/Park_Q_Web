import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    CPF: '',
    idioma: 'Português',
    notificacoes: false,
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Recuperar o ID do usuário do localStorage
  const userId = localStorage.getItem('userId'); // Mantém como string

  // Verificar se o ID do usuário está presente
  useEffect(() => {
    if (!userId) {
      console.error('ID do usuário não encontrado.');
      navigate('/login'); // Redireciona para o login se o ID não estiver presente
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3000/usuarios/${userId}`);
        setUserData(data);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        setError('Erro ao carregar os dados do usuário. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // Atualizar estado dos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Alternar estado das notificações
  const handleToggleNotifications = () => {
    setUserData({
      ...userData,
      notificacoes: !userData.notificacoes,
    });
  };

  // Validar campos antes de salvar
  const validateFields = () => {
    const { nome, email, telefone, CPF } = userData;

    if (!nome || !email || !telefone || !CPF) {
      setError('Todos os campos são obrigatórios.');
      return false;
    }

    if (!/^\d{11}$/.test(CPF)) {
      setError('CPF inválido. Deve conter 11 dígitos.');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email inválido.');
      return false;
    }

    setError('');
    return true;
  };

  // Salvar alterações
  const handleSaveChanges = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/usuarios/${userId}`, userData);
      alert('Alterações salvas com sucesso!');
      setEditing(false); // Desativar modo de edição após salvar
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      setError('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Voltar para a página anterior
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="profile-settings">
      <h2>Configurações do Perfil</h2>

      {/* Mensagem de erro */}
      {error && <div className="error-message">{error}</div>}

      {/* Campos do formulário */}
      <div className="input-group">
        <label>Nome</label>
        <input
          type="text"
          name="nome"
          value={userData.nome}
          onChange={handleChange}
          disabled={!editing || loading}
        />
      </div>
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          disabled={!editing || loading}
        />
      </div>
      <div className="input-group">
        <label>Telefone</label>
        <input
          type="text"
          name="telefone"
          value={userData.telefone}
          onChange={handleChange}
          disabled={!editing || loading}
        />
      </div>
      <div className="input-group">
        <label>CPF</label>
        <input
          type="text"
          name="CPF"
          value={userData.CPF}
          onChange={handleChange}
          disabled={!editing || loading}
        />
      </div>
      <div className="input-group">
        <label>Idioma</label>
        <select
          name="idioma"
          value={userData.idioma}
          onChange={handleChange}
          disabled={!editing || loading}
        >
          <option value="Português">Português</option>
          <option value="Inglês">Inglês</option>
        </select>
      </div>
      <div className="input-group">
        <label>Notificações</label>
        <input
          type="checkbox"
          checked={userData.notificacoes}
          onChange={handleToggleNotifications}
          disabled={!editing || loading}
        />
      </div>

      {/* Botões de ação */}
      <div className="button-group">
        {!editing ? (
          <button
            className="edit-button"
            onClick={() => setEditing(true)}
            disabled={loading}
          >
            Editar
          </button>
        ) : (
          <button
            className="save-button"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
        <button
          className="back-button"
          onClick={handleBack}
          disabled={loading}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;