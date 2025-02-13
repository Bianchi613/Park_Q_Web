import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [vagas, setVagas] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [estacionamento, setEstacionamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Pegando o ID do estacionamento do localStorage
  const estacionamentoId = localStorage.getItem("id_estacionamento");

  const navigate = useNavigate();

  useEffect(() => {
    if (!estacionamentoId) {
      setError("❌ ID do estacionamento não encontrado. Faça login novamente.");
      return;
    }

    console.log("📡 Buscando dados para o estacionamento ID:", estacionamentoId);

    // Buscar vagas
    axios
      .get(`http://localhost:3000/vagas?estacionamentoId=${estacionamentoId}`)
      .then((response) => {
        setVagas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erro ao buscar vagas.");
        console.error(error);
        setLoading(false);
      });

    // Buscar informações do estacionamento
    axios
      .get(`http://localhost:3000/estacionamentos/${estacionamentoId}`)
      .then((response) => {
        setEstacionamento(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar estacionamento:", error);
      });
  }, [estacionamentoId]);

  const gerarRelatorio = () => {
    if (!estacionamentoId) {
      setError("❌ Não é possível gerar o relatório sem um estacionamento associado.");
      return;
    }

    axios
      .get(`http://localhost:3000/estacionamentos/${estacionamentoId}/relatorio`)
      .then((response) => setRelatorio(response.data))
      .catch((error) => {
        setError("Erro ao gerar relatório.");
        console.error(error);
      });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Painel do Administrador</h1>
        <button
          className="back-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          Voltar ao Início
        </button>
      </div>

      {/* Vagas na Parte Superior */}
      <div className="vagas-container">
        <h2>Vagas</h2>
        {loading ? (
          <p className="loading-message">Carregando vagas...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="vagas-scroll">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className={`vaga-card ${vaga.status} ${
                  vaga.reservada ? "reservada" : ""
                }`}
              >
                <p className="vaga-numero">Vaga {vaga.numero}</p>
                <p className="vaga-tipo">
                  {vaga.tipo === "carro" ? "🚗 Carro" : "🏍️ Moto"}
                </p>
                <p className="vaga-status">
                  {vaga.reservada ? "✅ Reservada" : "❌ Disponível"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações do Estacionamento e Relatório no Meio */}
      <div className="middle-section">
        {estacionamento && (
          <div className="estacionamento-info">
            <h2>Informações do Estacionamento</h2>
            <div className="info-card">
              <p>
                <strong>Nome:</strong> {estacionamento.nome}
              </p>
              <p>
                <strong>Localização:</strong> {estacionamento.localizacao}
              </p>
              <p>
                <strong>Capacidade Total:</strong> {estacionamento.capacidade}{" "}
                vagas
              </p>
              <p>
                <strong>Vagas Disponíveis:</strong>{" "}
                {estacionamento.vagas_disponiveis}
              </p>
            </div>
          </div>
        )}

        <div className="relatorio-container">
          <h2>Relatório</h2>
          {error && <p className="error-message">{error}</p>}
          {relatorio && (
            <div className="relatorio-card">
              <p>
                <strong>Ocupação:</strong> {relatorio.ocupacao}%
              </p>
              <p>
                <strong>Faturamento:</strong> R$ {relatorio.faturamento}
              </p>
              <p>
                <strong>Tempo Médio:</strong> {relatorio.tempoMedio} min
              </p>
            </div>
          )}
          <button className="gerar-relatorio-button" onClick={gerarRelatorio}>
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Botões na Parte Inferior */}
      <div className="buttons-container">
        <button
          className="nav-button"
          onClick={() => navigate("/estacionamento")}
        >
          Cadastrar Estacionamento
        </button>
        <button
          className="nav-button"
          onClick={() => navigate("/tariff-plan")}
        >
          Plano de Tarifação
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
