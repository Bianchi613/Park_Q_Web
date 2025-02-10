import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    idioma: 'Português',
    notificacoes: false,
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetching user data based on the ID
    axios.get(`http://localhost:3000/usuarios/${id}`)
      .then(({ data }) => {
        setUserData(data);
      })
      .catch(error => console.error('Erro ao carregar os dados do usuário:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleToggleNotifications = () => {
    setUserData({
      ...userData,
      notificacoes: !userData.notificacoes,
    });
  };

  const handleSaveChanges = () => {
    // Update user data with the API
    axios.put(`http://localhost:3000/usuarios/${id}`, userData)
      .then(() => {
        alert('Alterações salvas com sucesso!');
        navigate(-1); // Navigate back to the previous page
      })
      .catch(error => {
        console.error('Erro ao salvar alterações:', error);
      });
  };

  return (
    <div className="profile-settings">
      <h2>Configurações do Perfil</h2>
      <div className="input-group">
        <label>Nome</label>
        <input
          type="text"
          name="nome"
          value={userData.nome}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>
      <div className="input-group">
        <label>Telefone</label>
        <input
          type="text"
          name="telefone"
          value={userData.telefone}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>
      <div className="input-group">
        <label>CPF</label>
        <input
          type="text"
          name="CPF"
          value={userData.CPF}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>
      <div className="input-group">
        <label>Idioma</label>
        <select
          name="idioma"
          value={userData.idioma}
          onChange={handleChange}
          disabled={!editing}
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
          disabled={!editing}
        />
      </div>
      <div className="button-group">
        {!editing ? (
          <button className="edit-button" onClick={() => setEditing(true)}>Editar</button>
        ) : (
          <button className="save-button" onClick={handleSaveChanges}>Salvar Alterações</button>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
