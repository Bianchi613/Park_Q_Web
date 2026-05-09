import { authApi } from './api';

export const login = authApi.login;

export const saveSession = (session) => {
  localStorage.setItem('token', session.access_token);
  localStorage.setItem('userId', session.id);
  localStorage.setItem('role', session.role);

  if (session.id_estacionamento) {
    localStorage.setItem('id_estacionamento', session.id_estacionamento);
  } else {
    localStorage.removeItem('id_estacionamento');
  }
};

export const saveVisitorSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('id_estacionamento');
  localStorage.setItem('role', 'VISITOR');
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('id_estacionamento');
};

export const getSession = () => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  role: localStorage.getItem('role'),
  idEstacionamento: localStorage.getItem('id_estacionamento'),
});
