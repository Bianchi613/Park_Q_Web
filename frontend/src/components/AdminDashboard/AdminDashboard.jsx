import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import {
  estacionamentosApi,
  notificacoesApi,
  operacoesApi,
  pagamentosApi,
  reservasApi,
  usuariosApi,
  vagasApi,
} from '../../services/api';
import './AdminDashboard.css';

const defaultCenter = [-23.55052, -46.633308];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('pt-BR') : '-';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const estacionamentoId = localStorage.getItem('id_estacionamento');
  const [activeView, setActiveView] = useState('operacao');
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [selectedParkingId, setSelectedParkingId] = useState(estacionamentoId || '');
  const [vagas, setVagas] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [monitoramento, setMonitoramento] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [status, setStatus] = useState('');
  const [notificationForm, setNotificationForm] = useState({
    id_usuario: '',
    tipo: 'SISTEMA',
    titulo: '',
    mensagem: '',
  });

  const selectedParking = useMemo(
    () =>
      estacionamentos.find(
        (parking) => String(parking.id) === String(selectedParkingId),
      ) ||
      estacionamentos.find(
        (parking) => String(parking.id) === String(estacionamentoId),
      ) ||
      estacionamentos[0] ||
      null,
    [estacionamentoId, estacionamentos, selectedParkingId],
  );

  const loadDashboard = useCallback(async () => {
    setStatus('Carregando dados administrativos...');

    try {
      const parkingsData = await estacionamentosApi.list();
      const parkings = Array.isArray(parkingsData) ? parkingsData : [];
      const targetParkingId =
        selectedParkingId || estacionamentoId || parkings[0]?.id || '';

      const [
        vagasData,
        reservasData,
        pagamentosData,
        notificacoesData,
        operacoesData,
        usuariosData,
      ] = await Promise.all([
        vagasApi.list(targetParkingId ? { id_estacionamento: targetParkingId } : {}),
        reservasApi.monitoramento(
          targetParkingId ? { id_estacionamento: targetParkingId } : {},
        ),
        pagamentosApi.list(),
        notificacoesApi.list(),
        operacoesApi.list(),
        usuariosApi.list(),
      ]);

      setEstacionamentos(parkings);
      setSelectedParkingId(String(targetParkingId || ''));
      setVagas(Array.isArray(vagasData) ? vagasData : []);
      setReservas(Array.isArray(reservasData) ? reservasData : []);
      setPagamentos(Array.isArray(pagamentosData) ? pagamentosData : []);
      setNotificacoes(Array.isArray(notificacoesData) ? notificacoesData : []);
      setOperacoes(Array.isArray(operacoesData) ? operacoesData : []);
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
      setStatus('');
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Nao foi possivel carregar o painel administrativo.',
      );
    }
  }, [estacionamentoId, selectedParkingId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const vagasLivres = vagas.filter(
    (vaga) => vaga.status === 'disponivel' && !vaga.reservada,
  ).length;
  const vagasOcupadas = vagas.length - vagasLivres;
  const ocupacao = vagas.length ? Math.round((vagasOcupadas / vagas.length) * 100) : 0;
  const faturamento = pagamentos.reduce(
    (total, pagamento) => total + Number(pagamento.valor_pago || 0),
    0,
  );
  const reservasExpiradas = reservas.filter((reserva) => reserva.expirada).length;

  const mapCenter = useMemo(() => {
    const lat = toNumber(selectedParking?.latitude);
    const lng = toNumber(selectedParking?.longitude);
    return lat && lng ? [lat, lng] : defaultCenter;
  }, [selectedParking]);

  const gerarRelatorio = async () => {
    if (!selectedParking?.id) {
      setStatus('Selecione um estacionamento.');
      return;
    }

    try {
      const data = await estacionamentosApi.relatorio(selectedParking.id);
      setRelatorio(data);
      setStatus('Relatorio atualizado.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao gerar relatorio.');
    }
  };

  const monitorarOcupacao = async () => {
    try {
      const data = await usuariosApi.monitorarOcupacao(userId);
      setMonitoramento(data);
      setStatus('Monitoramento de ocupacao atualizado.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao monitorar ocupacao.');
    }
  };

  const sendNotification = async (event) => {
    event.preventDefault();

    try {
      await notificacoesApi.create({
        ...notificationForm,
        id_usuario: Number(notificationForm.id_usuario),
      });
      setNotificationForm({
        id_usuario: '',
        tipo: 'SISTEMA',
        titulo: '',
        mensagem: '',
      });
      await loadDashboard();
      setStatus('Notificacao enviada.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao enviar notificacao.');
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />

      <main className="admin-shell">
        <section className="admin-hero">
          <div>
            <p className="eyebrow">Admin</p>
            <h2>Controle operacional do Park Q</h2>
            <p>
              Mapa, vagas, reservas, pagamentos, usuarios, notificacoes e auditoria
              em areas separadas.
            </p>
          </div>
          <div className="admin-actions">
            <button type="button" onClick={() => navigate('/estacionamento')}>
              Gerenciar vagas
            </button>
            <button type="button" onClick={() => navigate('/tariff-plan')}>
              Planos
            </button>
            <button type="button" onClick={loadDashboard}>
              Atualizar
            </button>
          </div>
        </section>

        {status && <div className="admin-alert">{status}</div>}

        <section className="admin-kpis">
          <div>
            <span>Vagas livres</span>
            <strong>{vagasLivres}</strong>
          </div>
          <div>
            <span>Ocupacao</span>
            <strong>{ocupacao}%</strong>
          </div>
          <div>
            <span>Reservas expiradas</span>
            <strong>{reservasExpiradas}</strong>
          </div>
          <div>
            <span>Faturamento</span>
            <strong>{formatMoney(faturamento)}</strong>
          </div>
        </section>

        <nav className="admin-tabs" aria-label="Areas administrativas">
          {[
            ['operacao', 'Operacao'],
            ['reservas', `Reservas (${reservas.length})`],
            ['financeiro', 'Financeiro'],
            ['pessoas', `Usuarios (${usuarios.length})`],
            ['notificacoes', `Notificacoes (${notificacoes.length})`],
            ['auditoria', 'Auditoria'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={activeView === id ? 'active' : ''}
              type="button"
              onClick={() => setActiveView(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeView === 'operacao' && (
          <>
            <section className="operation-layout">
              <div className="map-panel">
                <MapContainer center={mapCenter} zoom={14} scrollWheelZoom>
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {estacionamentos.map((parking) => {
                    const lat = toNumber(parking.latitude);
                    const lng = toNumber(parking.longitude);

                    if (!lat || !lng) {
                      return null;
                    }

                    return (
                      <CircleMarker
                        key={parking.id}
                        center={[lat, lng]}
                        pathOptions={{
                          color:
                            String(parking.id) === String(selectedParking?.id)
                              ? '#0f766e'
                              : '#334155',
                          fillColor:
                            String(parking.id) === String(selectedParking?.id)
                              ? '#14b8a6'
                              : '#f97316',
                        }}
                        radius={9}
                        eventHandlers={{ click: () => setSelectedParkingId(parking.id) }}
                      >
                        <Popup>
                          <strong>{parking.nome}</strong>
                          <br />
                          {parking.localizacao}
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>

              <aside className="admin-card">
                <label>
                  Estacionamento
                  <select
                    value={selectedParkingId}
                    onChange={(event) => setSelectedParkingId(event.target.value)}
                  >
                    {estacionamentos.map((parking) => (
                      <option key={parking.id} value={parking.id}>
                        {parking.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <h3>{selectedParking?.nome || 'Sem estacionamento'}</h3>
                <p>{selectedParking?.localizacao}</p>
                <div className="split-metrics">
                  <strong>{vagasLivres} livres</strong>
                  <strong>{vagasOcupadas} ocupadas</strong>
                </div>
                <button type="button" onClick={monitorarOcupacao}>
                  Monitorar ocupacao
                </button>
                <button type="button" onClick={gerarRelatorio}>
                  Gerar relatorio
                </button>
                {(monitoramento || relatorio) && (
                  <div className="report-box">
                    {monitoramento && <span>Disponiveis: {monitoramento.vagasDisponiveis}</span>}
                    {relatorio && <span>Faturamento: {formatMoney(relatorio.faturamento)}</span>}
                    {relatorio && <span>Tempo medio: {relatorio.tempoMedio} min</span>}
                  </div>
                )}
              </aside>
            </section>

            <section className="admin-card">
              <div className="section-heading">
                <h3>Mapa de vagas</h3>
                <button type="button" onClick={() => navigate('/estacionamento')}>
                  Editar vagas
                </button>
              </div>
              <div className="spot-grid">
                {vagas.map((vaga) => (
                  <article key={vaga.id} className={`spot-card ${vaga.status}`}>
                    <strong>Vaga {vaga.numero}</strong>
                    <span>{vaga.tipo}</span>
                    <small>{vaga.reservada ? 'Reservada' : vaga.status}</small>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeView === 'reservas' && (
          <section className="admin-card">
            <div className="section-heading">
              <h3>Reservas e tempo</h3>
              <button type="button" onClick={loadDashboard}>Atualizar</button>
            </div>
            <div className="admin-table">
              {reservas.map((reserva) => (
                <div key={reserva.id_reserva || reserva.id} className="admin-row">
                  <div>
                    <strong>Reserva #{reserva.id_reserva || reserva.id}</strong>
                    <span>Usuario #{reserva.id_usuario} · Vaga #{reserva.id_vaga}</span>
                  </div>
                  <span>{reserva.status}</span>
                  <span>{reserva.tempoRestanteMinutos} min</span>
                  <strong>{reserva.expirada ? 'Expirada' : 'Em andamento'}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'financeiro' && (
          <section className="admin-card">
            <div className="section-heading">
              <h3>Pagamentos</h3>
              <strong>{formatMoney(faturamento)} total</strong>
            </div>
            <div className="admin-table">
              {pagamentos.map((pagamento) => (
                <div key={pagamento.id} className="admin-row">
                  <div>
                    <strong>Pagamento #{pagamento.id}</strong>
                    <span>Reserva #{pagamento.id_reserva}</span>
                  </div>
                  <span>{pagamento.metodo_pagamento}</span>
                  <span>{formatDate(pagamento.data_hora)}</span>
                  <strong>{formatMoney(pagamento.valor_pago)}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'pessoas' && (
          <section className="admin-card">
            <div className="section-heading">
              <h3>Usuarios</h3>
              <button type="button" onClick={() => navigate('/register')}>
                Criar usuario
              </button>
            </div>
            <div className="people-grid">
              {usuarios.map((usuario) => (
                <article key={usuario.id}>
                  <strong>{usuario.nome}</strong>
                  <span>{usuario.email}</span>
                  <small>{usuario.role}</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeView === 'notificacoes' && (
          <section className="notification-workspace">
            <form className="admin-card notification-form" onSubmit={sendNotification}>
              <h3>Enviar notificacao</h3>
              <label>
                Usuario
                <select
                  value={notificationForm.id_usuario}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      id_usuario: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Selecione</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome} ({usuario.role})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tipo
                <select
                  value={notificationForm.tipo}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      tipo: event.target.value,
                    }))
                  }
                >
                  <option value="SISTEMA">Sistema</option>
                  <option value="RESERVA">Reserva</option>
                  <option value="PAGAMENTO">Pagamento</option>
                  <option value="CANCELAMENTO">Cancelamento</option>
                  <option value="EXPIRACAO">Expiracao</option>
                </select>
              </label>
              <label>
                Titulo
                <input
                  value={notificationForm.titulo}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      titulo: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Mensagem
                <textarea
                  value={notificationForm.mensagem}
                  onChange={(event) =>
                    setNotificationForm((current) => ({
                      ...current,
                      mensagem: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <button type="submit">Enviar</button>
            </form>

            <section className="admin-card">
              <h3>Notificacoes recentes</h3>
              <div className="admin-table">
                {notificacoes.map((notificacao) => (
                  <div key={notificacao.id} className="admin-row">
                    <div>
                      <strong>{notificacao.titulo}</strong>
                      <span>{notificacao.mensagem}</span>
                    </div>
                    <span>{notificacao.tipo}</span>
                    <strong>{notificacao.lida ? 'Lida' : 'Nova'}</strong>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeView === 'auditoria' && (
          <section className="admin-card">
            <h3>Operacoes de auditoria</h3>
            <div className="admin-table">
              {operacoes.map((operacao) => (
                <div key={operacao.id} className="admin-row">
                  <div>
                    <strong>{operacao.descricao}</strong>
                    <span>{formatDate(operacao.data_hora)}</span>
                  </div>
                  <span>{operacao.tipo}</span>
                  <span>{operacao.entidade || '-'}</span>
                  <strong>Usuario #{operacao.id_usuario}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
