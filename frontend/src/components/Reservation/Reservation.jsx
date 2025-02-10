import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Reservation.css';
import Header from '../Layout/Header'; // Corrigido o caminho do Header

const Reservation = () => {
  const [vagas, setVagas] = useState([]);
  const { id } = useParams(); // Obtém o ID do estacionamento da URL
  const navigate = useNavigate();

  useEffect(() => {
    // Requisição para obter as vagas do estacionamento específico
    axios.get(`http://localhost:3000/vagas?id_estacionamento=${id}`)
      .then(response => {
        setVagas(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar as vagas:', error);
      });
  }, [id]);

  const handleConfirm = (vagaId) => {
    // Requisição para reservar a vaga
    axios.post(`http://localhost:3000/vagas/${vagaId}/reservar`)
      .then(() => {
        // Redireciona para a página de pagamento
        navigate('/payment');
      })
      .catch(error => {
        console.error('Erro ao reservar a vaga:', error);
      });
  };

  const handleBack = () => {
    // Volta para a página anterior
    navigate(-1);
  };

  return (
    <div className="reservation-container">
     
  
      <h2>Escolha uma vaga para reservar</h2>
      <Header /> {/* Adicionando o Header acima da lista de estacionamentos */}
      
      <div className="vaga-list">
        {vagas.length > 0 ? (
          vagas.map(vaga => (
            <div key={vaga.id} className="vaga-item">
              <div className="vaga-info">
                <h3>{`Vaga ${vaga.numero}`}</h3>
                <p>{vaga.status === 'disponivel' ? 'Disponível' : 'Indisponível'}</p>
                <p>{vaga.tipo}</p>
              </div>
              <button
                className="confirm-button"
                disabled={vaga.status !== 'disponivel'}
                onClick={() => handleConfirm(vaga.id)}
              >
                {vaga.status === 'disponivel' ? 'Confirmar' : 'Indisponível'}
              </button>
            </div>
          ))
        ) : (
          <p>Não há vagas disponíveis no momento.</p>
        )}
      </div>
      <button className="back-button" onClick={handleBack}>
        Voltar
      </button>
    </div>
  );
};

export default Reservation;
