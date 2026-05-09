import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import { usuariosApi } from '../../services/api';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState({
    CPF: '',
    nome: '',
    email: '',
    telefone: '',
    login: '',
    role: '',
    preferencias: '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await usuariosApi.get(userId);
        setUserData({
          CPF: data.CPF || '',
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          login: data.login || '',
          role: data.role || '',
          preferencias: data.preferencias || '',
        });
      } catch (error) {
        setStatus(error.response?.data?.message || 'Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((current) => ({ ...current, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setStatus('');

    try {
      await usuariosApi.update(userId, {
        CPF: userData.CPF,
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        login: userData.login,
        preferencias: userData.preferencias,
      });
      setStatus('Perfil atualizado.');
      setEditing(false);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao salvar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-settings">
        <h2>Configuracoes do perfil</h2>
        {status && <div className="error-message">{status}</div>}

        {['nome', 'email', 'telefone', 'CPF', 'login', 'preferencias'].map(
          (field) => (
            <div className="input-group" key={field}>
              <label>{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={userData[field]}
                onChange={handleChange}
                disabled={!editing || loading}
              />
            </div>
          ),
        )}

        <div className="input-group">
          <label>Perfil</label>
          <input value={userData.role} disabled />
        </div>

        <div className="button-group">
          {!editing ? (
            <button type="button" onClick={() => setEditing(true)} disabled={loading}>
              Editar
            </button>
          ) : (
            <button type="button" onClick={handleSaveChanges} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          )}
          <button type="button" className="back-button" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
