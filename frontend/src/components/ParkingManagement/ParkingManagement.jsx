/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import "./ParkingManagement.css";

const ParkingManagement = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [parkings, setParkings] = useState([]); // Lista de estacionamentos
  const [spots, setSpots] = useState([]); // Lista de vagas
  const [selectedParking, setSelectedParking] = useState(null); // Estacionamento selecionado
  const [showParkingForm, setShowParkingForm] = useState(false); // Modal do formulário de estacionamento
  const [showSpotForm, setShowSpotForm] = useState(false); // Modal do formulário de vaga
  const [currentParking, setCurrentParking] = useState({}); // Dados do estacionamento sendo editado
  const [currentSpot, setCurrentSpot] = useState({}); // Dados da vaga sendo editada

  // Carrega estacionamentos ao iniciar
  useEffect(() => {
    fetchParkings();
  }, []);

  // Carrega vagas quando um estacionamento é selecionado
  useEffect(() => {
    if (selectedParking) {
      fetchSpots(selectedParking.id);
    }
  }, [selectedParking]);

  // Função para buscar estacionamentos
  const fetchParkings = async () => {
    try {
      const response = await fetch("http://localhost:3000/estacionamentos");
      const data = await response.json();
      setParkings(data);
    } catch (error) {
      console.error("Erro ao buscar estacionamentos:", error);
    }
  };

  // Função para buscar vagas de um estacionamento
  const fetchSpots = async (parkingId) => {
    try {
      const response = await fetch(`http://localhost:3000/vagas?id_estacionamento=${parkingId}`);
      const data = await response.json();
      setSpots(data);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    }
  };

  // Função para adicionar/editar estacionamento
  const handleSaveParking = async (parking) => {
    const url = parking.id
      ? `http://localhost:3000/estacionamentos/${parking.id}`
      : "http://localhost:3000/estacionamentos";
    const method = parking.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parking),
      });
      if (response.ok) {
        fetchParkings(); // Atualiza a lista de estacionamentos
        setShowParkingForm(false); // Fecha o modal
        setCurrentParking({}); // Limpa o formulário
      }
    } catch (error) {
      console.error("Erro ao salvar estacionamento:", error);
    }
  };

  // Função para adicionar/editar vaga
  const handleSaveSpot = async (spot) => {
    const url = spot.id
      ? `http://localhost:3000/vagas/${spot.id}`
      : "http://localhost:3000/vagas";
    const method = spot.id ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...spot, id_estacionamento: selectedParking.id }),
      });
      if (response.ok) {
        fetchSpots(selectedParking.id); // Atualiza a lista de vagas
        setShowSpotForm(false); // Fecha o modal
        setCurrentSpot({}); // Limpa o formulário
      }
    } catch (error) {
      console.error("Erro ao salvar vaga:", error);
    }
  };

  // Função para excluir estacionamento
  const handleDeleteParking = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/estacionamentos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchParkings(); // Atualiza a lista de estacionamentos
      }
    } catch (error) {
      console.error("Erro ao excluir estacionamento:", error);
    }
  };

  // Função para excluir vaga
  const handleDeleteSpot = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/vagas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSpots(selectedParking.id); // Atualiza a lista de vagas
      }
    } catch (error) {
      console.error("Erro ao excluir vaga:", error);
    }
  };

  return (
    <div className="parking-management">
      {/* Botão para voltar ao Admin Dashboard */}
      <button
        className="back-button"
        onClick={() => navigate("/admin-dashboard")} // Redireciona para o dashboard
      >
        Voltar ao Admin Dashboard
      </button>

      <h1>Gerenciamento de Estacionamentos e Vagas</h1>

      {/* Seção de Estacionamentos */}
      <div className="parking-section">
        <h2>Estacionamentos</h2>
        <button onClick={() => { setShowParkingForm(true); setCurrentParking({}); }}>
          Adicionar Estacionamento
        </button>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Localização</th>
              <th>Capacidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {parkings.map((parking) => (
              <tr key={parking.id}>
                <td>{parking.nome}</td>
                <td>{parking.localizacao}</td>
                <td>{parking.capacidade}</td>
                <td>
                  <button
                    onClick={() => {
                      setCurrentParking(parking);
                      setShowParkingForm(true);
                    }}
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDeleteParking(parking.id)}>Excluir</button>
                  <button onClick={() => setSelectedParking(parking)}>Ver Vagas</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seção de Vagas */}
      {selectedParking && (
        <div className="spot-section">
          <h2>Vagas do Estacionamento: {selectedParking.nome}</h2>
          <button onClick={() => { setShowSpotForm(true); setCurrentSpot({}); }}>
            Adicionar Vaga
          </button>
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Status</th>
                <th>Tipo</th>
                <th>Reservada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot.id}>
                  <td>{spot.numero}</td>
                  <td>{spot.status}</td>
                  <td>{spot.tipo}</td>
                  <td>{spot.reservada ? "Sim" : "Não"}</td>
                  <td>
                    <button
                      onClick={() => {
                        setCurrentSpot(spot);
                        setShowSpotForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDeleteSpot(spot.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal do Formulário de Estacionamento */}
      {showParkingForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentParking.id ? "Editar Estacionamento" : "Adicionar Estacionamento"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveParking(currentParking);
              }}
            >
              <label>
                Nome:
                <input
                  type="text"
                  value={currentParking.nome || ""}
                  onChange={(e) =>
                    setCurrentParking({ ...currentParking, nome: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Localização:
                <input
                  type="text"
                  value={currentParking.localizacao || ""}
                  onChange={(e) =>
                    setCurrentParking({ ...currentParking, localizacao: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Capacidade:
                <input
                  type="number"
                  value={currentParking.capacidade || ""}
                  onChange={(e) =>
                    setCurrentParking({ ...currentParking, capacidade: e.target.value })
                  }
                  required
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowParkingForm(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal do Formulário de Vaga */}
      {showSpotForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentSpot.id ? "Editar Vaga" : "Adicionar Vaga"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSpot(currentSpot);
              }}
            >
              <label>
                Número:
                <input
                  type="number"
                  value={currentSpot.numero || ""}
                  onChange={(e) =>
                    setCurrentSpot({ ...currentSpot, numero: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Status:
                <select
                  value={currentSpot.status || "disponivel"}
                  onChange={(e) =>
                    setCurrentSpot({ ...currentSpot, status: e.target.value })
                  }
                  required
                >
                  <option value="disponivel">Disponível</option>
                  <option value="ocupada">Ocupada</option>
                </select>
              </label>
              <label>
                Tipo:
                <select
                  value={currentSpot.tipo || "carro"}
                  onChange={(e) =>
                    setCurrentSpot({ ...currentSpot, tipo: e.target.value })
                  }
                  required
                >
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>
              </label>
              <label>
                Reservada:
                <input
                  type="checkbox"
                  checked={currentSpot.reservada || false}
                  onChange={(e) =>
                    setCurrentSpot({ ...currentSpot, reservada: e.target.checked })
                  }
                />
              </label>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setShowSpotForm(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingManagement;