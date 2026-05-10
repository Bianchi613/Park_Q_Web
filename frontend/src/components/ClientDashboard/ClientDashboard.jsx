import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../Layout/Header';
import {
  estacionamentosApi,
  notificacoesApi,
  planosApi,
  reservasApi,
  usuariosApi,
  vagasApi,
} from '../../services/api';
import './ClientDashboard.css';

const defaultCenter = [-23.55052, -46.633308];
const locationStorageKey = 'parkq_user_location';
const clientDashboardViews = ['buscar', 'reservas', 'notificacoes', 'tarifas'];

const getDashboardView = (value) =>
  clientDashboardViews.includes(value) ? value : 'buscar';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getStoredLocation = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(locationStorageKey) || 'null');

    if (
      Array.isArray(parsed) &&
      parsed.length === 2 &&
      parsed.every((coordinate) => Number.isFinite(Number(coordinate)))
    ) {
      return parsed.map(Number);
    }
  } catch {
    return null;
  }

  return null;
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('pt-BR') : 'Sem data';

const normalizeStatus = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const MapFocusController = ({ lat, lng, focusKey }) => {
  const map = useMap();

  useEffect(() => {
    if (!focusKey || !lat || !lng) {
      return;
    }

    map.flyTo([lat, lng], focusKey ? 17 : 15, {
      animate: true,
      duration: 0.7,
    });
  }, [focusKey, lat, lng, map]);

  return null;
};

const UserLocationFocusController = ({ userLocation, focusKey }) => {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !focusKey) {
      return;
    }

    map.flyTo(userLocation, 16, {
      animate: true,
      duration: 0.7,
    });
  }, [focusKey, map, userLocation]);

  return null;
};

const VehicleIcon = ({ type }) => {
  const isMoto = normalizeStatus(type) === 'moto';

  if (isMoto) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M5.4 16.8a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 0 0-4.8 0Z" />
        <path d="M15.6 16.8a2.4 2.4 0 1 0 4.8 0 2.4 2.4 0 0 0-4.8 0Z" />
        <path d="M8.2 16.1h3.1l2.4-4.1h2.1l2.2 4.1" />
        <path d="M11.2 12h-2l-2 3.8" />
        <path d="M14.2 9.3h3l1.4 2.7" />
        <path d="M13.7 8h1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M5 14.5 6.8 9.2A2 2 0 0 1 8.7 8h6.6a2 2 0 0 1 1.9 1.2l1.8 5.3" />
      <path d="M4.5 14.5h15v4h-2.2v-1.4H6.7v1.4H4.5v-4Z" />
      <path d="M7.2 15.8h.1" />
      <path d="M16.7 15.8h.1" />
      <path d="M7.7 11h8.6" />
    </svg>
  );
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedView = getDashboardView(searchParams.get('view'));
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const canReserve = role === 'CLIENT';
  const storedLocation = useMemo(() => getStoredLocation(), []);
  const [activeView, setActiveView] = useState(requestedView);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [selectedVagas, setSelectedVagas] = useState([]);
  const [selectedVagaId, setSelectedVagaId] = useState('');
  const [loadingVagas, setLoadingVagas] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParkingId, setSelectedParkingId] = useState(null);
  const [userLocation, setUserLocation] = useState(storedLocation);
  const [locationFocusKey, setLocationFocusKey] = useState(0);
  const [parkingFocusKey, setParkingFocusKey] = useState(0);
  const [locationState, setLocationState] = useState(
    storedLocation ? 'granted' : 'checking',
  );
  const [searchRadiusKm, setSearchRadiusKm] = useState(5);
  const [status, setStatus] = useState('');
  const [tarifaForm, setTarifaForm] = useState({
    planoId: '',
    tipoVaga: 'carro',
    duracaoHoras: 2,
  });
  const [tarifaResultado, setTarifaResultado] = useState(null);

  const loadDashboard = useCallback(async () => {
    setStatus('Carregando dados...');

    try {
      const [parkingsData, planosData, reservasData, notificacoesData] =
        await Promise.all([
          estacionamentosApi.list(),
          planosApi.list(),
          canReserve && userId
            ? usuariosApi.historicoReservas(userId)
            : Promise.resolve([]),
          canReserve && userId
            ? notificacoesApi.byUsuario(userId)
            : Promise.resolve([]),
        ]);

      const parkings = Array.isArray(parkingsData) ? parkingsData : [];

      setEstacionamentos(parkings);
      setSelectedParkingId((current) => current || parkings[0]?.id || null);
      setPlanos(Array.isArray(planosData) ? planosData : []);
      setReservas(Array.isArray(reservasData) ? reservasData : []);
      setNotificacoes(Array.isArray(notificacoesData) ? notificacoesData : []);
      setStatus('');
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Nao foi possivel carregar o painel do cliente.',
      );
    }
  }, [canReserve, userId]);

  const requestLocation = useCallback((shouldFocusMap = false) => {
    if (!navigator.geolocation) {
      setLocationState('unavailable');
      return;
    }

    setLocationState('checking');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation = [coords.latitude, coords.longitude];
        localStorage.setItem(locationStorageKey, JSON.stringify(nextLocation));
        setUserLocation(nextLocation);
        if (shouldFocusMap) {
          setLocationFocusKey((current) => current + 1);
        }
        setLocationState('granted');
      },
      () => {
        setUserLocation(null);
        setLocationState('unavailable');
      },
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    setActiveView(requestedView);
  }, [requestedView]);

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    estacionamentosApi
      .nearby({ lat: userLocation[0], lng: userLocation[1] })
      .then((data) => {
        if (Array.isArray(data)) {
          setEstacionamentos(data);
          setSelectedParkingId((current) => {
            const selectedStillExists = data.some((parking) => parking.id === current);
            return selectedStillExists ? current : data[0]?.id || null;
          });
        }
      })
      .catch(() => {});
  }, [userLocation]);

  useEffect(() => {
    if (!selectedParkingId) {
      setSelectedVagas([]);
      return;
    }

    setLoadingVagas(true);
    vagasApi
      .list({ id_estacionamento: selectedParkingId })
      .then((data) => {
        const vagas = Array.isArray(data) ? data : [];

        setSelectedVagas(vagas);
        setSelectedVagaId((current) =>
          vagas.some((vaga) => String(vaga.id) === String(current)) ? current : '',
        );
      })
      .catch((error) => {
        setSelectedVagas([]);
        setStatus(
          error.response?.data?.message ||
            'Nao foi possivel carregar as vagas desse estacionamento.',
        );
      })
      .finally(() => setLoadingVagas(false));
  }, [selectedParkingId]);

  const filteredEstacionamentos = useMemo(
    () =>
      estacionamentos.filter((estacionamento) => {
        const term = searchTerm.toLowerCase();
        const isInsideRadius =
          !userLocation ||
          estacionamento.distanciaKm === undefined ||
          Number(estacionamento.distanciaKm) <= searchRadiusKm;

        return (
          isInsideRadius &&
          (estacionamento.nome?.toLowerCase().includes(term) ||
            estacionamento.localizacao?.toLowerCase().includes(term) ||
            estacionamento.categoria?.toLowerCase().includes(term))
        );
      }),
    [estacionamentos, searchRadiusKm, searchTerm, userLocation],
  );

  const selectedParking = selectedParkingId
    ? estacionamentos.find((parking) => parking.id === selectedParkingId)
    : null;

  const vagasDisponiveis = useMemo(
    () =>
      selectedVagas.filter((vaga) => {
        const statusVaga = normalizeStatus(vaga.status);
        return !vaga.reservada && statusVaga === 'disponivel';
      }),
    [selectedVagas],
  );

  const selectedVaga = useMemo(
    () =>
      vagasDisponiveis.find((vaga) => String(vaga.id) === String(selectedVagaId)),
    [selectedVagaId, vagasDisponiveis],
  );

  const planosDoEstacionamento = useMemo(
    () =>
      selectedParkingId
        ? planos.filter(
            (plano) =>
              String(plano.id_estacionamento) === String(selectedParkingId),
          )
        : [],
    [planos, selectedParkingId],
  );

  useEffect(() => {
    setTarifaForm((current) => {
      const planoAtualPertenceAoEstacionamento = planosDoEstacionamento.some(
        (plano) => String(plano.id) === String(current.planoId),
      );

      if (planoAtualPertenceAoEstacionamento) {
        return current;
      }

      return {
        ...current,
        planoId: planosDoEstacionamento[0]?.id || '',
      };
    });
  }, [planosDoEstacionamento]);

  const vagasPorTipo = useMemo(() => {
    const groups = [
      {
        id: 'carro',
        label: 'Carro',
        vagas: vagasDisponiveis.filter(
          (vaga) => normalizeStatus(vaga.tipo) !== 'moto',
        ),
      },
      {
        id: 'moto',
        label: 'Moto',
        vagas: vagasDisponiveis.filter(
          (vaga) => normalizeStatus(vaga.tipo) === 'moto',
        ),
      },
    ];

    return groups.filter((group) => group.vagas.length > 0);
  }, [vagasDisponiveis]);

  const mapCenter = useMemo(() => {
    if (userLocation) {
      return userLocation;
    }

    const firstWithCoordinates = estacionamentos.find(
      (parking) => toNumber(parking.latitude) && toNumber(parking.longitude),
    );
    const lat = toNumber(firstWithCoordinates?.latitude);
    const lng = toNumber(firstWithCoordinates?.longitude);

    return lat && lng ? [lat, lng] : defaultCenter;
  }, [estacionamentos, userLocation]);

  const reservasAtivas = reservas.filter((reserva) => reserva.status === 'ATIVA');
  const reservasFinalizadas = reservas.filter((reserva) =>
    ['CANCELADA', 'FINALIZADA', 'EXPIRADA'].includes(reserva.status),
  );
  const novasNotificacoes = notificacoes.filter((notificacao) => !notificacao.lida);
  const focusParkingOnMap = (parking) => {
    const lat = toNumber(parking?.latitude);
    const lng = toNumber(parking?.longitude);

    if (!lat || !lng) {
      return;
    }

    setSelectedParkingId(parking.id);
    setParkingFocusKey((current) => current + 1);
  };

  const handleSelectParking = (parking) => {
    focusParkingOnMap(parking);
    setSelectedVagaId('');
  };

  const handleSelectVaga = (vaga) => {
    setSelectedVagaId(vaga.id);

    if (selectedParking) {
      focusParkingOnMap(selectedParking);
    }
  };

  const handleReservar = (estacionamentoId, vagaId = selectedVagaId) => {
    if (!canReserve) {
      setStatus(
        'Visitante pode consultar vagas e tarifas. Para reservar, crie uma conta CLIENT.',
      );
      return;
    }

    if (!vagaId) {
      setStatus('Escolha uma vaga livre no painel antes de reservar.');
      return;
    }

    navigate(`/reservation/${estacionamentoId}?vaga=${vagaId}`);
  };

  const handleCancelarReserva = async (reservaId) => {
    try {
      await usuariosApi.cancelarReserva(userId, { id_reserva: reservaId });
      await loadDashboard();
      setStatus('Reserva cancelada.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao cancelar reserva.');
    }
  };

  const handleMonitorarReserva = async (reservaId) => {
    try {
      const monitoramento = await reservasApi.monitorarTempo(reservaId);
      setStatus(
        `Reserva #${reservaId}: ${monitoramento.tempoRestanteMinutos} min restantes. Status ${monitoramento.status}.`,
      );
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao monitorar reserva.');
    }
  };

  const handlePagarReserva = (reserva) => {
    navigate('/payment', {
      state: {
        reservaId: reserva.id,
        valor: reserva.valor,
        id_vaga: reserva.id_vaga,
        planoDescricao: reserva.plano?.descricao || `Plano ${reserva.id_plano}`,
      },
    });
  };

  const handleMarcarLida = async (id) => {
    try {
      await notificacoesApi.marcarLida(id);
      await loadDashboard();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao atualizar notificacao.');
    }
  };

  const handleMarcarTodasLidas = async () => {
    try {
      await notificacoesApi.marcarTodasLidas(userId);
      await loadDashboard();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao atualizar notificacoes.');
    }
  };

  const calcularTarifa = async () => {
    if (!tarifaForm.planoId) {
      setStatus('Selecione um plano para calcular a tarifa.');
      return;
    }

    try {
      const resultado = await planosApi.calcular(tarifaForm.planoId, {
        tipoVaga: tarifaForm.tipoVaga,
        duracaoHoras: Number(tarifaForm.duracaoHoras),
      });
      setTarifaResultado(resultado);
      setStatus('');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao calcular tarifa.');
    }
  };

  return (
    <div className="client-dashboard">
      <Header
        clientNavCounts={{
          reservas: reservasAtivas.length,
          notificacoes: novasNotificacoes.length,
        }}
      />

      <main className="client-shell">
        {status && <div className="client-alert">{status}</div>}

        {activeView === 'buscar' && (
          <>
            <section className="find-layout">
              <div className="map-panel">
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom>
                  <MapFocusController
                    lat={toNumber(selectedParking?.latitude)}
                    lng={toNumber(selectedParking?.longitude)}
                    focusKey={parkingFocusKey}
                  />
                  <UserLocationFocusController
                    userLocation={userLocation}
                    focusKey={locationFocusKey}
                  />
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {userLocation && (
                    <CircleMarker
                      center={userLocation}
                      pathOptions={{ color: '#0f766e', fillColor: '#14b8a6' }}
                      radius={9}
                    >
                      <Popup>Voce esta aqui</Popup>
                    </CircleMarker>
                  )}

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
                            parking.id === selectedParkingId ? '#0f766e' : '#1f2937',
                          fillColor:
                            parking.id === selectedParkingId ? '#14b8a6' : '#f97316',
                          fillOpacity: 0.78,
                          weight: parking.id === selectedParkingId ? 5 : 3,
                        }}
                        radius={parking.id === selectedParkingId ? 11 : 8}
                        eventHandlers={{ click: () => handleSelectParking(parking) }}
                      >
                        <Popup>
                          <strong>{parking.nome}</strong>
                          <br />
                          {parking.vagas_disponiveis ?? 0} vagas livres
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>

              <aside className="parking-panel">
                <div className="ride-search">
                  <label htmlFor="parking-search">Para onde voce vai estacionar?</label>
                  <input
                    id="parking-search"
                    type="search"
                    placeholder="Buscar por endereco, bairro ou estacionamento"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <div className="ride-meta">
                    <span>
                      {filteredEstacionamentos.length}{' '}
                      {userLocation ? 'proximos' : 'cadastrados'}
                    </span>
                    <button type="button" onClick={() => requestLocation(true)}>
                      Minha localizacao
                    </button>
                  </div>
                  {userLocation && (
                    <label className="radius-control" htmlFor="parking-radius">
                      <span>
                        Alcance
                        <strong>{searchRadiusKm} km</strong>
                      </span>
                      <input
                        id="parking-radius"
                        type="range"
                        min="1"
                        max="600"
                        step="1"
                        value={searchRadiusKm}
                        onChange={(event) =>
                          setSearchRadiusKm(Number(event.target.value))
                        }
                      />
                    </label>
                  )}
                </div>

                {locationState === 'unavailable' && (
                  <div className="location-banner">
                    Ative a localizacao para ordenar por proximidade.
                  </div>
                )}

                <div className="parking-results">
                  {filteredEstacionamentos.map((estacionamento) => {
                    const isSelected = estacionamento.id === selectedParkingId;

                    return (
                      <button
                        key={estacionamento.id}
                        type="button"
                        className={`parking-result ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectParking(estacionamento)}
                      >
                        <span className="pin-dot" />
                        <span>
                          <strong>{estacionamento.nome}</strong>
                          <small>{estacionamento.localizacao}</small>
                          <em>
                            {estacionamento.vagas_disponiveis ?? 0} vagas livres
                            {estacionamento.distanciaKm !== undefined &&
                              ` - ${Number(estacionamento.distanciaKm).toFixed(1)} km`}
                          </em>
                        </span>
                      </button>
                    );
                  })}
                  {filteredEstacionamentos.length === 0 && (
                    <p className="empty-results">
                      {userLocation
                        ? 'Nenhum estacionamento dentro desse alcance.'
                        : 'Nenhum estacionamento nessa busca.'}
                    </p>
                  )}
                </div>
              </aside>

              <aside className="spot-panel">
                {selectedParking && (
                  <div className="selected-stop">
                    <div className="spot-panel-header">
                      <span>Vagas</span>
                      <h3>{selectedParking.nome}</h3>
                      <p>
                        {vagasDisponiveis.length} livres
                        {selectedParking.distanciaKm !== undefined &&
                          ` - ${Number(selectedParking.distanciaKm).toFixed(1)} km`}
                      </p>
                    </div>
                    <div className="spot-preview">
                      <div className="spot-preview-head">
                        <strong>Escolha sua vaga</strong>
                        <span>{loadingVagas ? 'Carregando' : `${vagasDisponiveis.length} livres`}</span>
                      </div>
                      <p className="spot-hint">Clique em uma vaga livre para selecionar.</p>
                      {loadingVagas ? (
                        <p>Buscando vagas desse estacionamento...</p>
                      ) : vagasDisponiveis.length > 0 ? (
                        <div className="spot-groups">
                          {vagasPorTipo.map((group) => (
                            <section className="spot-group" key={group.id}>
                              <div className="spot-group-title">
                                <span className={`vehicle-badge ${group.id}`}>
                                  <VehicleIcon type={group.id} />
                                </span>
                                <strong>{group.label}</strong>
                                <em>{group.vagas.length}</em>
                              </div>
                              <div className="spot-chip-grid">
                                {group.vagas.map((vaga) => {
                                  const isSelected =
                                    String(vaga.id) === String(selectedVagaId);

                                  return (
                                    <button
                                      key={vaga.id}
                                      type="button"
                                      className={isSelected ? 'active' : ''}
                                      aria-pressed={isSelected}
                                      onClick={() => handleSelectVaga(vaga)}
                                    >
                                      <VehicleIcon type={vaga.tipo} />
                                      <strong>{vaga.numero}</strong>
                                      {isSelected && <em>OK</em>}
                                    </button>
                                  );
                                })}
                              </div>
                            </section>
                          ))}
                        </div>
                      ) : (
                        <p>Nenhuma vaga livre encontrada agora.</p>
                      )}
                    </div>
                    {selectedVaga && (
                      <p className="selected-vaga-note">
                        Vaga #{selectedVaga.numero} selecionada para reserva.
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!selectedVaga}
                      onClick={() => handleReservar(selectedParking.id)}
                    >
                      {selectedVaga
                        ? `Reservar vaga #${selectedVaga.numero}`
                        : 'Selecione uma vaga'}
                    </button>
                  </div>
                )}
                {!selectedParking && (
                  <div className="selected-stop empty-selection">
                    <span>Vagas</span>
                    <h3>Escolha um estacionamento</h3>
                    <p>Selecione um item na lista ou um marcador no mapa.</p>
                  </div>
                )}
              </aside>
            </section>
          </>
        )}

        {activeView === 'reservas' && (
          <section className="client-card">
            <div className="section-heading">
              <h3>Minhas reservas</h3>
              <button type="button" onClick={loadDashboard}>
                Atualizar
              </button>
            </div>
            <div className="table-like">
              {[...reservasAtivas, ...reservasFinalizadas].map((reserva) => (
                <div key={reserva.id} className="table-row">
                  <div>
                    <strong>Reserva #{reserva.id}</strong>
                    <span>
                      Vaga {reserva.vaga?.numero || reserva.id_vaga} -{' '}
                      {formatDate(reserva.data_reserva)}
                    </span>
                  </div>
                  <span className={`status-pill ${reserva.status?.toLowerCase()}`}>
                    {reserva.status}
                  </span>
                  <strong>{formatMoney(reserva.valor)}</strong>
                  <div className="row-actions">
                    <button type="button" onClick={() => handleMonitorarReserva(reserva.id)}>
                      Tempo
                    </button>
                    {reserva.status === 'ATIVA' && (
                      <>
                        <button type="button" onClick={() => handlePagarReserva(reserva)}>
                          Pagar
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleCancelarReserva(reserva.id)}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {reservas.length === 0 && <p>Nenhuma reserva encontrada.</p>}
            </div>
          </section>
        )}

        {activeView === 'notificacoes' && (
          <section className="client-card">
            <div className="section-heading">
              <h3>Notificacoes</h3>
              {canReserve && (
                <button type="button" onClick={handleMarcarTodasLidas}>
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <div className="notification-list">
              {notificacoes.map((notificacao) => (
                <article key={notificacao.id} className={notificacao.lida ? '' : 'new'}>
                  <div>
                    <strong>{notificacao.titulo}</strong>
                    <p>{notificacao.mensagem}</p>
                  </div>
                  {!notificacao.lida && (
                    <button type="button" onClick={() => handleMarcarLida(notificacao.id)}>
                      Marcar lida
                    </button>
                  )}
                </article>
              ))}
              {notificacoes.length === 0 && <p>Nenhuma notificacao ainda.</p>}
            </div>
          </section>
        )}

        {activeView === 'tarifas' && (
          <section className="tariff-layout">
            <div className="client-card">
              <h3>Calculadora de tarifa</h3>
              <label>
                Plano
                <select
                  value={tarifaForm.planoId}
                  onChange={(event) =>
                    setTarifaForm((current) => ({
                      ...current,
                      planoId: event.target.value,
                    }))
                  }
                >
                  <option value="">Selecione</option>
                  {planosDoEstacionamento.map((plano) => (
                    <option key={plano.id} value={plano.id}>
                      {plano.descricao || `Plano ${plano.id}`}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tipo da vaga
                <select
                  value={tarifaForm.tipoVaga}
                  onChange={(event) =>
                    setTarifaForm((current) => ({
                      ...current,
                      tipoVaga: event.target.value,
                    }))
                  }
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>
              </label>
              <label>
                Duracao em horas
                <input
                  min="1"
                  type="number"
                  value={tarifaForm.duracaoHoras}
                  onChange={(event) =>
                    setTarifaForm((current) => ({
                      ...current,
                      duracaoHoras: event.target.value,
                    }))
                  }
                />
              </label>
              <button type="button" onClick={calcularTarifa}>
                Calcular
              </button>
              {tarifaResultado && (
                <div className="tariff-result">
                  <span>Total estimado</span>
                  <strong>{formatMoney(tarifaResultado.valor)}</strong>
                </div>
              )}
            </div>

            <div className="client-card">
              <h3>
                Planos de {selectedParking?.nome || 'estacionamento selecionado'}
              </h3>
              <div className="plan-grid">
                {planosDoEstacionamento.map((plano) => (
                  <article key={plano.id}>
                    <strong>{plano.descricao || `Plano ${plano.id}`}</strong>
                    <span>Base: {formatMoney(plano.taxa_base)}</span>
                    <span>Hora: {formatMoney(plano.taxa_hora)}</span>
                    <span>Diaria: {formatMoney(plano.taxa_diaria)}</span>
                  </article>
                ))}
                {planosDoEstacionamento.length === 0 && (
                  <article>
                    <strong>Sem plano cadastrado</strong>
                    <span>Este estacionamento ainda nao tem tarifa propria.</span>
                  </article>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
