import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import { estacionamentosApi, vagasApi } from '../../services/api';
import './ParkingManagement.css';

const emptyParking = {
  nome: '',
  localizacao: '',
  latitude: '',
  longitude: '',
  capacidade: '',
  vagas_disponiveis: '',
  categoria: '',
  imagemUrl: '',
};

const emptySpot = {
  numero: '',
  status: 'disponivel',
  tipo: 'carro',
  reservada: false,
};

const ParkingManagement = () => {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [spots, setSpots] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [showParkingForm, setShowParkingForm] = useState(false);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [currentParking, setCurrentParking] = useState(emptyParking);
  const [currentSpot, setCurrentSpot] = useState(emptySpot);
  const [status, setStatus] = useState('');

  const fetchParkings = async () => {
    try {
      const data = await estacionamentosApi.list();
      setParkings(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao buscar estacionamentos.');
    }
  };

  const fetchSpots = async (parkingId) => {
    try {
      const data = await vagasApi.list({ id_estacionamento: parkingId });
      setSpots(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao buscar vagas.');
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  useEffect(() => {
    if (selectedParking) {
      fetchSpots(selectedParking.id);
    }
  }, [selectedParking]);

  const handleSaveParking = async (event) => {
    event.preventDefault();

    const payload = {
      ...currentParking,
      capacidade: Number(currentParking.capacidade),
      vagas_disponiveis:
        currentParking.vagas_disponiveis === ''
          ? Number(currentParking.capacidade)
          : Number(currentParking.vagas_disponiveis),
      latitude:
        currentParking.latitude === '' ? undefined : Number(currentParking.latitude),
      longitude:
        currentParking.longitude === ''
          ? undefined
          : Number(currentParking.longitude),
    };

    try {
      if (currentParking.id) {
        await estacionamentosApi.update(currentParking.id, payload);
      } else {
        await estacionamentosApi.create(payload);
      }
      setShowParkingForm(false);
      setCurrentParking(emptyParking);
      await fetchParkings();
      setStatus('Estacionamento salvo.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao salvar estacionamento.');
    }
  };

  const handleSaveSpot = async (event) => {
    event.preventDefault();

    const payload = {
      ...currentSpot,
      numero: Number(currentSpot.numero),
      id_estacionamento: selectedParking.id,
    };

    try {
      if (currentSpot.id) {
        await vagasApi.update(currentSpot.id, payload);
      } else {
        await vagasApi.create(payload);
      }
      setShowSpotForm(false);
      setCurrentSpot(emptySpot);
      await fetchSpots(selectedParking.id);
      setStatus('Vaga salva.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao salvar vaga.');
    }
  };

  const handleDeleteParking = async (id) => {
    try {
      await estacionamentosApi.remove(id);
      await fetchParkings();
      setSelectedParking(null);
      setStatus('Estacionamento removido.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao remover estacionamento.');
    }
  };

  const handleDeleteSpot = async (id) => {
    try {
      await vagasApi.remove(id);
      await fetchSpots(selectedParking.id);
      setStatus('Vaga removida.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao remover vaga.');
    }
  };

  return (
    <div className="parking-management">
      <Header />

      <main className="parking-management-shell">
        <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
          Voltar ao dashboard
        </button>

        <h1>Estacionamentos e vagas</h1>
        {status && <p className="status-message">{status}</p>}

        <section className="parking-section">
          <div className="section-header">
            <h2>Estacionamentos</h2>
            <button
              type="button"
              onClick={() => {
                setCurrentParking(emptyParking);
                setShowParkingForm(true);
              }}
            >
              Adicionar estacionamento
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Endereco</th>
                <th>Capacidade</th>
                <th>Livres</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {parkings.map((parking) => (
                <tr key={parking.id}>
                  <td>{parking.nome}</td>
                  <td>{parking.localizacao}</td>
                  <td>{parking.capacidade}</td>
                  <td>{parking.vagas_disponiveis}</td>
                  <td>
                    <button type="button" onClick={() => setSelectedParking(parking)}>
                      Vagas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentParking(parking);
                        setShowParkingForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteParking(parking.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {selectedParking && (
          <section className="spot-section">
            <div className="section-header">
              <h2>Vagas: {selectedParking.nome}</h2>
              <button
                type="button"
                onClick={() => {
                  setCurrentSpot(emptySpot);
                  setShowSpotForm(true);
                }}
              >
                Adicionar vaga
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Status</th>
                  <th>Tipo</th>
                  <th>Reservada</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot.id}>
                    <td>{spot.numero}</td>
                    <td>{spot.status}</td>
                    <td>{spot.tipo}</td>
                    <td>{spot.reservada ? 'Sim' : 'Nao'}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSpot(spot);
                          setShowSpotForm(true);
                        }}
                      >
                        Editar
                      </button>
                      <button type="button" onClick={() => handleDeleteSpot(spot.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {showParkingForm && (
          <div className="modal">
            <form className="modal-content" onSubmit={handleSaveParking}>
              <h3>{currentParking.id ? 'Editar' : 'Adicionar'} estacionamento</h3>
              <label>
                Nome
                <input
                  value={currentParking.nome || ''}
                  onChange={(event) =>
                    setCurrentParking({ ...currentParking, nome: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Endereco
                <input
                  value={currentParking.localizacao || ''}
                  onChange={(event) =>
                    setCurrentParking({
                      ...currentParking,
                      localizacao: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <div className="form-grid">
                <label>
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={currentParking.latitude || ''}
                    onChange={(event) =>
                      setCurrentParking({
                        ...currentParking,
                        latitude: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={currentParking.longitude || ''}
                    onChange={(event) =>
                      setCurrentParking({
                        ...currentParking,
                        longitude: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  Capacidade
                  <input
                    type="number"
                    value={currentParking.capacidade || ''}
                    onChange={(event) =>
                      setCurrentParking({
                        ...currentParking,
                        capacidade: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label>
                  Vagas livres
                  <input
                    type="number"
                    value={currentParking.vagas_disponiveis || ''}
                    onChange={(event) =>
                      setCurrentParking({
                        ...currentParking,
                        vagas_disponiveis: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <label>
                Categoria
                <input
                  value={currentParking.categoria || ''}
                  onChange={(event) =>
                    setCurrentParking({
                      ...currentParking,
                      categoria: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Imagem URL
                <input
                  value={currentParking.imagemUrl || ''}
                  onChange={(event) =>
                    setCurrentParking({
                      ...currentParking,
                      imagemUrl: event.target.value,
                    })
                  }
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowParkingForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {showSpotForm && (
          <div className="modal">
            <form className="modal-content" onSubmit={handleSaveSpot}>
              <h3>{currentSpot.id ? 'Editar' : 'Adicionar'} vaga</h3>
              <label>
                Numero
                <input
                  type="number"
                  value={currentSpot.numero || ''}
                  onChange={(event) =>
                    setCurrentSpot({ ...currentSpot, numero: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Status
                <select
                  value={currentSpot.status || 'disponivel'}
                  onChange={(event) =>
                    setCurrentSpot({ ...currentSpot, status: event.target.value })
                  }
                >
                  <option value="disponivel">Disponivel</option>
                  <option value="ocupada">Ocupada</option>
                </select>
              </label>
              <label>
                Tipo
                <select
                  value={currentSpot.tipo || 'carro'}
                  onChange={(event) =>
                    setCurrentSpot({ ...currentSpot, tipo: event.target.value })
                  }
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={Boolean(currentSpot.reservada)}
                  onChange={(event) =>
                    setCurrentSpot({
                      ...currentSpot,
                      reservada: event.target.checked,
                    })
                  }
                />
                Reservada
              </label>
              <div className="modal-actions">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowSpotForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ParkingManagement;
