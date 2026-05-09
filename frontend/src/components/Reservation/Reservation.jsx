import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../Layout/Header';
import {
  estacionamentosApi,
  planosApi,
  reservasApi,
  vagasApi,
} from '../../services/api';
import './Reservation.css';

const formatMoney = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const toLocalInputValue = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const Reservation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialVagaId = searchParams.get('vaga') || '';
  const [estacionamento, setEstacionamento] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [selectedVagaId, setSelectedVagaId] = useState('');
  const [selectedPlanoId, setSelectedPlanoId] = useState('');
  const [dataInicio, setDataInicio] = useState(toLocalInputValue(new Date()));
  const [dataFim, setDataFim] = useState(
    toLocalInputValue(new Date(Date.now() + 2 * 60 * 60 * 1000)),
  );
  const [tarifa, setTarifa] = useState(null);
  const [status, setStatus] = useState('Carregando reserva...');

  useEffect(() => {
    const loadReservationData = async () => {
      try {
        const [parkingData, vagasData, planosData] = await Promise.all([
          estacionamentosApi.get(id),
          vagasApi.list({ id_estacionamento: id }),
          planosApi.list(),
        ]);

        setEstacionamento(parkingData);
        const vagasList = Array.isArray(vagasData) ? vagasData : [];

        setVagas(vagasList);
        if (initialVagaId && vagasList.some((vaga) => String(vaga.id) === initialVagaId)) {
          setSelectedVagaId(initialVagaId);
        }
        setPlanos(Array.isArray(planosData) ? planosData : []);
        setStatus('');
      } catch (error) {
        setStatus(
          error.response?.data?.message ||
            'Nao foi possivel carregar dados para reserva.',
        );
      }
    };

    loadReservationData();
  }, [id, initialVagaId]);

  const selectedVaga = useMemo(
    () => vagas.find((vaga) => String(vaga.id) === String(selectedVagaId)),
    [selectedVagaId, vagas],
  );

  const selectedPlano = useMemo(
    () => planos.find((plano) => String(plano.id) === String(selectedPlanoId)),
    [selectedPlanoId, planos],
  );

  useEffect(() => {
    const calcularTarifa = async () => {
      if (!selectedPlano || !selectedVaga || !dataInicio || !dataFim) {
        setTarifa(null);
        return;
      }

      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const duracaoHoras = Math.max(
        1,
        Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)),
      );

      try {
        const calculo = await planosApi.calcular(selectedPlano.id, {
          tipoVaga: selectedVaga.tipo,
          duracaoHoras,
        });
        setTarifa(calculo);
      } catch {
        setTarifa({
          valor: Number(selectedPlano.taxa_base || 0),
          duracaoHoras,
        });
      }
    };

    calcularTarifa();
  }, [dataFim, dataInicio, selectedPlano, selectedVaga]);

  const vagasDisponiveis = vagas.filter(
    (vaga) => vaga.status === 'disponivel' && !vaga.reservada,
  );

  const criarReserva = async () => {
    if (!selectedVaga || !selectedPlano) {
      setStatus('Selecione uma vaga e um plano.');
      return;
    }

    if (new Date(dataFim) <= new Date(dataInicio)) {
      setStatus('A data final precisa ser maior que a data inicial.');
      return;
    }

    try {
      const reserva = await reservasApi.create({
        id_vaga: selectedVaga.id,
        id_plano: selectedPlano.id,
        data_reserva: new Date(dataInicio).toISOString(),
        data_fim: new Date(dataFim).toISOString(),
      });

      navigate('/payment', {
        state: {
          reservaId: reserva.id,
          valor: reserva.valor,
          id_vaga: selectedVaga.id,
          planoDescricao: selectedPlano.descricao,
        },
      });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao criar reserva.');
    }
  };

  return (
    <div className="reservation-page">
      <Header />

      <main className="reservation-shell">
        <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
          Voltar
        </button>

        <section className="reservation-title">
          <div>
            <p className="eyebrow">Reserva</p>
            <h2>{estacionamento?.nome || 'Escolha sua vaga'}</h2>
            <p>{estacionamento?.localizacao}</p>
          </div>
          <div className="reservation-count">
            <strong>{vagasDisponiveis.length}</strong>
            vagas livres
          </div>
        </section>

        {status && <div className="reservation-alert">{status}</div>}

        <section className="reservation-grid">
          <div className="reservation-card">
            <h3>Periodo e plano</h3>
            <label>
              Inicio
              <input
                type="datetime-local"
                value={dataInicio}
                onChange={(event) => setDataInicio(event.target.value)}
              />
            </label>
            <label>
              Fim
              <input
                type="datetime-local"
                value={dataFim}
                onChange={(event) => setDataFim(event.target.value)}
              />
            </label>
            <label>
              Plano de tarifacao
              <select
                value={selectedPlanoId}
                onChange={(event) => setSelectedPlanoId(event.target.value)}
              >
                <option value="">Selecione um plano</option>
                {planos.map((plano) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.descricao || `Plano ${plano.id}`} ·{' '}
                    {formatMoney(plano.taxa_base)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="reservation-card">
            <h3>Resumo</h3>
            <div className="summary-line">
              <span>Vaga</span>
              <strong>
                {selectedVaga ? `#${selectedVaga.numero} (${selectedVaga.tipo})` : '-'}
              </strong>
            </div>
            <div className="summary-line">
              <span>Plano</span>
              <strong>{selectedPlano?.descricao || '-'}</strong>
            </div>
            <div className="summary-line">
              <span>Duracao</span>
              <strong>{tarifa?.duracaoHoras || 0}h</strong>
            </div>
            <div className="summary-total">
              <span>Total previsto</span>
              <strong>{formatMoney(tarifa?.valor || selectedPlano?.taxa_base)}</strong>
            </div>
            <button type="button" onClick={criarReserva}>
              Criar reserva e pagar
            </button>
          </div>
        </section>

        <section className="reservation-card">
          <h3>Vagas disponiveis</h3>
          <div className="reservation-spots">
            {vagasDisponiveis.map((vaga) => (
              <button
                key={vaga.id}
                type="button"
                className={String(vaga.id) === String(selectedVagaId) ? 'active' : ''}
                onClick={() => setSelectedVagaId(vaga.id)}
              >
                <strong>Vaga {vaga.numero}</strong>
                <span>{vaga.tipo}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reservation;
