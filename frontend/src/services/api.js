import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = (request) => request.then((response) => response.data);

export const authApi = {
  login: (payload) => unwrap(api.post('/auth/login', payload)),
};

export const usuariosApi = {
  list: (params = {}) => unwrap(api.get('/usuarios', { params })),
  get: (id) => unwrap(api.get(`/usuarios/${id}`)),
  create: (payload) => unwrap(api.post('/usuarios', payload)),
  update: (id, payload) => unwrap(api.put(`/usuarios/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/usuarios/${id}`)),
  reservarVaga: (id, payload) =>
    unwrap(api.post(`/usuarios/${id}/reservar-vaga`, payload)),
  cancelarReserva: (id, payload) =>
    unwrap(api.post(`/usuarios/${id}/cancelar-reserva`, payload)),
  historicoReservas: (id) => unwrap(api.get(`/usuarios/${id}/reservas`)),
  monitorarOcupacao: (id) =>
    unwrap(api.get(`/usuarios/${id}/monitorar-ocupacao`)),
  gerarRelatorio: (id) => unwrap(api.get(`/usuarios/${id}/relatorio`)),
};

export const estacionamentosApi = {
  list: () => unwrap(api.get('/estacionamentos')),
  nearby: (params) => unwrap(api.get('/estacionamentos/proximos', { params })),
  get: (id) => unwrap(api.get(`/estacionamentos/${id}`)),
  create: (payload) => unwrap(api.post('/estacionamentos', payload)),
  update: (id, payload) => unwrap(api.put(`/estacionamentos/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/estacionamentos/${id}`)),
  monitorar: (id) => unwrap(api.get(`/estacionamentos/${id}/monitorar`)),
  relatorio: (id) => unwrap(api.get(`/estacionamentos/${id}/relatorio`)),
};

export const vagasApi = {
  list: (params = {}) => unwrap(api.get('/vagas', { params })),
  get: (id) => unwrap(api.get(`/vagas/${id}`)),
  create: (payload) => unwrap(api.post('/vagas', payload)),
  update: (id, payload) => unwrap(api.patch(`/vagas/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/vagas/${id}`)),
  reservar: (id, payload = {}) => unwrap(api.post(`/vagas/${id}/reservar`, payload)),
  liberar: (id) => unwrap(api.post(`/vagas/${id}/liberar`)),
};

export const planosApi = {
  list: (params = {}) => unwrap(api.get('/planos-tarifacao', { params })),
  get: (id) => unwrap(api.get(`/planos-tarifacao/${id}`)),
  create: (payload) => unwrap(api.post('/planos-tarifacao', payload)),
  update: (id, payload) => unwrap(api.patch(`/planos-tarifacao/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/planos-tarifacao/${id}`)),
  calcular: (id, payload) =>
    unwrap(api.post(`/planos-tarifacao/${id}/calcular-tarifa`, payload)),
};

export const reservasApi = {
  list: () => unwrap(api.get('/reservas')),
  get: (id) => unwrap(api.get(`/reservas/${id}`)),
  create: (payload) => unwrap(api.post('/reservas', payload)),
  update: (id, payload) => unwrap(api.put(`/reservas/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/reservas/${id}`)),
  monitoramento: (params = {}) =>
    unwrap(api.get('/reservas/monitoramento', { params })),
  monitorarTempo: (id) => unwrap(api.get(`/reservas/${id}/monitorar-tempo`)),
};

export const pagamentosApi = {
  list: (params = {}) => unwrap(api.get('/pagamentos', { params })),
  get: (id) => unwrap(api.get(`/pagamentos/${id}`)),
  create: (payload) => unwrap(api.post('/pagamentos', payload)),
  update: (id, payload) => unwrap(api.put(`/pagamentos/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/pagamentos/${id}`)),
};

export const notificacoesApi = {
  list: (params = {}) => unwrap(api.get('/notificacoes', { params })),
  byUsuario: (id) => unwrap(api.get(`/notificacoes/usuario/${id}`)),
  create: (payload) => unwrap(api.post('/notificacoes', payload)),
  marcarLida: (id) => unwrap(api.patch(`/notificacoes/${id}/lida`)),
  marcarTodasLidas: (id) =>
    unwrap(api.patch(`/notificacoes/usuario/${id}/lidas`)),
  remove: (id) => unwrap(api.delete(`/notificacoes/${id}`)),
};

export const operacoesApi = {
  list: (params = {}) => unwrap(api.get('/operacoes', { params })),
  get: (id) => unwrap(api.get(`/operacoes/${id}`)),
  create: (payload) => unwrap(api.post('/operacoes', payload)),
  update: (id, payload) => unwrap(api.put(`/operacoes/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/operacoes/${id}`)),
};

export default api;
