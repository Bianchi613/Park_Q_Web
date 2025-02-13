import { useNavigate } from 'react-router-dom';
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  // Função para redirecionar para a página de configurações de perfil
  const handleProfileClick = () => {
    navigate("/profile-settings");
  };

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token de autenticação (exemplo)
    localStorage.removeItem("user"); // Remove os dados do usuário (exemplo)
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>

      <div className="sidebar-buttons">
        <button className="sidebar-button" onClick={handleProfileClick}>
          <span className="icon">👤</span>
          <span className="text">Perfil</span>
        </button>

        <button className="sidebar-button logout" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;