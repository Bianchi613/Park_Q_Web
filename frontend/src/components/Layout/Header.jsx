import { useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../../services/authService';
import './Header.css';

const Header = ({ children }) => {
  const navigate = useNavigate();
  const { userId, role } = getSession();
  const isVisitor = role === 'VISITOR' || !userId;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate(role === 'ADMIN' ? '/admin-dashboard' : '/client-dashboard');
  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="brand-button" type="button" onClick={handleDashboard}>
          Park Q
        </button>
        {children && <div className="header-center">{children}</div>}
        <div className="header-buttons">
          {isVisitor ? (
            <>
              <button type="button" className="profile-button" onClick={() => navigate('/login')}>
                Fazer login
              </button>
              <button type="button" className="logout-button" onClick={() => navigate('/register')}>
                Cadastrar-se
              </button>
            </>
          ) : (
            <>
              <button
                className="profile-button"
                type="button"
                onClick={() => userId && navigate(`/perfil/${userId}`)}
              >
                Perfil
              </button>
              <button className="logout-button" type="button" onClick={handleLogout}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
