import { Children, cloneElement, isValidElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiCalendar,
  FiBell,
  FiTag,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
} from 'react-icons/fi';

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

  const getTextFromNode = (node) => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(getTextFromNode).join(' ');
    }

    if (isValidElement(node)) {
      return getTextFromNode(node.props.children);
    }

    return '';
  };

  const getIconData = (text) => {
    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const countMatch = text.match(/\((\d+)\)/);
    const count = countMatch ? countMatch[1] : null;

    if (normalized.includes('buscar')) {
      return {
        icon: <FiSearch />,
        label: 'Buscar vaga',
      };
    }

    if (normalized.includes('reserva')) {
      return {
        icon: <FiCalendar />,
        label: 'Reservas',
        count,
      };
    }

    if (
      normalized.includes('notificacao') ||
      normalized.includes('notificacoes')
    ) {
      return {
        icon: <FiBell />,
        label: 'Notificações',
        count,
      };
    }

    if (normalized.includes('tarifa')) {
      return {
        icon: <FiTag />,
        label: 'Tarifas',
      };
    }

    return null;
  };

  const transformChildrenButtons = (node) => {
    return Children.map(node, (child) => {
      if (!isValidElement(child)) return child;

      const text = getTextFromNode(child.props.children);
      const iconData = getIconData(text);

      if (iconData && child.type === 'button') {
        return cloneElement(child, {
          className: `${child.props.className || ''} header-nav-icon-button`.trim(),
          title: iconData.label,
          'aria-label': iconData.label,
          children: (
            <>
              {iconData.icon}
              {iconData.count && (
                <span className="notification-badge">{iconData.count}</span>
              )}
            </>
          ),
        });
      }

      if (child.props.children) {
        return cloneElement(child, {
          children: transformChildrenButtons(child.props.children),
        });
      }

      return child;
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="brand-button" type="button" onClick={handleDashboard}>
          Park Q
        </button>

        {children && (
          <div className="header-center">
            {transformChildrenButtons(children)}
          </div>
        )}

        <div className="header-buttons">
          {isVisitor ? (
            <>
              <button
                type="button"
                className="header-icon-button"
                onClick={() => navigate('/login')}
                title="Fazer login"
                aria-label="Fazer login"
              >
                <FiLogIn />
              </button>

              <button
                type="button"
                className="header-icon-button"
                onClick={() => navigate('/register')}
                title="Cadastrar-se"
                aria-label="Cadastrar-se"
              >
                <FiUserPlus />
              </button>
            </>
          ) : (
            <>
              <button
                className="header-icon-button"
                type="button"
                onClick={() => userId && navigate(`/perfil/${userId}`)}
                title="Perfil"
                aria-label="Perfil"
              >
                <FiUser />
              </button>

              <button
                className="header-icon-button logout-icon"
                type="button"
                onClick={handleLogout}
                title="Sair"
                aria-label="Sair"
              >
                <FiLogOut />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;