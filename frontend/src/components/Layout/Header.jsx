import { Children, cloneElement, isValidElement, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
import { notificacoesApi, usuariosApi } from '../../services/api';
import './Header.css';

const clientNavItems = [
  {
    id: 'buscar',
    label: 'Buscar vaga',
    icon: <FiSearch />,
  },
  {
    id: 'reservas',
    label: 'Reservas',
    icon: <FiCalendar />,
  },
  {
    id: 'notificacoes',
    label: 'Notificacoes',
    icon: <FiBell />,
  },
  {
    id: 'tarifas',
    label: 'Tarifas',
    icon: <FiTag />,
  },
];

const Header = ({ children, clientNavCounts = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { userId, role } = getSession();
  const isVisitor = role === 'VISITOR' || !userId;
  const shouldShowClientNav = role !== 'ADMIN';
  const activeClientView = searchParams.get('view') || 'buscar';
  const [headerCounts, setHeaderCounts] = useState({
    reservas: 0,
    notificacoes: 0,
  });
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (role !== 'CLIENT' || !userId) {
      setHeaderCounts({ reservas: 0, notificacoes: 0 });
      setHasNewNotification(false);
      return;
    }

    let isMounted = true;

    const loadHeaderCounts = () => {
      Promise.all([
        usuariosApi.historicoReservas(userId),
        notificacoesApi.byUsuario(userId),
      ])
        .then(([reservasData, notificacoesData]) => {
          if (!isMounted) {
            return;
          }

          const reservas = Array.isArray(reservasData) ? reservasData : [];
          const notificacoes = Array.isArray(notificacoesData) ? notificacoesData : [];
          const nextCounts = {
            reservas: reservas.filter((reserva) => reserva.status === 'ATIVA').length,
            notificacoes: notificacoes.filter((notificacao) => !notificacao.lida)
              .length,
          };

          setHeaderCounts((current) => {
            if (nextCounts.notificacoes > current.notificacoes) {
              setHasNewNotification(true);
            }

            return nextCounts;
          });
        })
        .catch(() => {
          if (isMounted) {
            setHeaderCounts({ reservas: 0, notificacoes: 0 });
          }
        });
    };

    loadHeaderCounts();
    const intervalId = window.setInterval(loadHeaderCounts, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [role, userId]);

  useEffect(() => {
    if (!hasNewNotification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setHasNewNotification(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [hasNewNotification]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate(role === 'ADMIN' ? '/admin-dashboard' : '/client-dashboard');
  };

  const goToClientView = (view) => {
    navigate(`/client-dashboard?view=${view}`);
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

        {(children || shouldShowClientNav) && (
          <div className="header-center">
            {children ? (
              transformChildrenButtons(children)
            ) : (
              <nav className="header-nav-tabs" aria-label="Areas do cliente">
                {clientNavItems.map((item) => {
                  const count = clientNavCounts[item.id] ?? headerCounts[item.id];
                  const isActive =
                    location.pathname === '/client-dashboard' &&
                    activeClientView === item.id;
                  const showBadge = item.id === 'reservas' || item.id === 'notificacoes';
                  const displayCount = count > 99 ? '99+' : count;
                  const badgeClassName = `notification-badge ${
                    item.id === 'notificacoes' && hasNewNotification
                      ? 'has-new'
                      : ''
                  }`.trim();

                  return (
                    <button
                      key={item.id}
                      className={isActive ? 'active' : ''}
                      type="button"
                      onClick={() => goToClientView(item.id)}
                      title={item.label}
                      aria-label={item.label}
                    >
                      {item.icon}
                      {showBadge && (
                        <span className={badgeClassName}>{displayCount}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            )}
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
                className={`header-icon-button ${
                  location.pathname.startsWith('/perfil/') ? 'active' : ''
                }`}
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
