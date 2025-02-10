import { useNavigate } from 'react-router-dom';
import './Header.css'; // Importando o CSS para o estilo

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ação para deslogar o usuário, como limpar o token de autenticação
    localStorage.removeItem('token'); // Exemplo de remoção do token do localStorage
    localStorage.removeItem('userId'); // Limpar o userId do localStorage também
    navigate('/login'); // Redireciona para a página de login
  };

  const handleProfile = () => {
    // Acessa o userId do localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate(`/perfil/${userId}`); // Redireciona para a página de perfil com o ID
    } else {
      console.error('ID do usuário não encontrado!');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>ParkQ </h1>
        <div className="header-buttons">
          <button className="profile-button" onClick={handleProfile}>
            Perfil
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
