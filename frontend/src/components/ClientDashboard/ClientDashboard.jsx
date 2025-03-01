import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientDashboard.css'; // Importando o CSS para estilização
import Header from '../Layout/Header'; // Corrigido o caminho do Header

const ClientDashboard = () => {
  const [estacionamentos, setEstacionamentos] = useState([]); // Inicializando com um array
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Para mensagens de erro
  const navigate = useNavigate();

  useEffect(() => {
    // Alterando a URL para refletir o endereço correto do backend
    axios.get('http://localhost:3000/estacionamentos') // Agora a URL está completa para chamar o backend
      .then(({ data }) => {
        // Verificando se os dados são um array válido antes de definir o estado
        if (Array.isArray(data)) {
          setEstacionamentos(data); // Usando destructuring para pegar os dados diretamente
        } else {
          setErrorMessage('Dados de estacionamentos inválidos.');
        }
      })
      .catch(error => {
        setErrorMessage('Erro ao carregar estacionamentos. Tente novamente mais tarde.');
        console.error('Erro ao carregar estacionamentos:', error);
      });
  }, []);

  // Filtrando estacionamentos com base no termo de busca
  const filteredEstacionamentos = estacionamentos.filter(estacionamento =>
    estacionamento.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estacionamento.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReserva = (estacionamentoId) => {
    // Redireciona para a página de reserva com o ID do estacionamento
    navigate(`/reservation/${estacionamentoId}`);
  };

 

  return (
    <div className="client-dashboard">
      <Header /> {/* Adicionando o Header acima da lista de estacionamentos */}
      <h2>Vagas Próximas</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Digite o Local da Vaga"
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
      />
      <div className="estacionamentos-list">
        {filteredEstacionamentos.length > 0 ? (
          filteredEstacionamentos.map(estacionamento => (
            <div key={estacionamento.id} className="estacionamento-item">
              {/* Imagem à esquerda */}
              {estacionamento.imagemUrl ? (
                <img
                  src={estacionamento.imagemUrl}
                  alt={estacionamento.nome}
                  className="estacionamento-image"
                />
              ) : (
                <div className="default-image">Imagem indisponível</div>
              )}

              {/* Texto à direita */}
              <div className="estacionamento-info">
                <h3>{estacionamento.nome}</h3>
                <p>{estacionamento.localizacao}</p>
                <p>{estacionamento.capacidade} vagas disponíveis</p>
                <p>Categoria: {estacionamento.categoria}</p>
              </div>

              {/* Botão de reserva */}
              <button
                className="reservar-button"
                onClick={() => handleReserva(estacionamento.id)} // Agora redireciona para a página de reservas
              >
                Reservar
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum estacionamento encontrado para a busca.</p> // Mensagem quando não houver resultados
        )}
      </div>
      
    </div>
  );
};

export default ClientDashboard;