import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Reservation.css';
import Header from '../Layout/Header';

const Reservation = () => {
  const [vagas, setVagas] = useState([]);
  const [estacionamento, setEstacionamento] = useState(null);
  const [coordenadas, setCoordenadas] = useState([-22.9068, -43.1729]); // Coordenadas padrão (Rio de Janeiro)
  const [planosTarifacao, setPlanosTarifacao] = useState([]); // Armazena os planos de tarifação
  const [planoSelecionado, setPlanoSelecionado] = useState({ id: null, taxa_base: 0 }); // Armazena o plano selecionado com id e taxa
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar informações do estacionamento
    axios.get(`http://localhost:3000/estacionamentos/${id}`)
      .then(response => {
        setEstacionamento(response.data);
        // Obter coordenadas a partir do endereço
        geocodificarEndereco(response.data.localizacao);
      })
      .catch(error => {
        console.error('Erro ao carregar o estacionamento:', error);
        // Usar coordenadas padrão em caso de erro
        setCoordenadas([-22.9068, -43.1729]);
      });

    // Buscar vagas
    axios.get(`http://localhost:3000/vagas?id_estacionamento=${id}`)
      .then(response => setVagas(response.data))
      .catch(error => console.error('Erro ao carregar as vagas:', error));

    // Buscar planos de tarifação
    axios.get(`http://localhost:3000/planos-tarifacao`)
      .then(response => setPlanosTarifacao(response.data))
      .catch(error => console.error('Erro ao carregar os planos de tarifação:', error));
  }, [id]);

  // Função para geocodificar o endereço
  const geocodificarEndereco = (endereco) => {
    const apiKey = 'SUA_CHAVE_DE_API_DO_GOOGLE_MAPS'; // Substitua pela sua chave de API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCoordenadas([location.lat, location.lng]); // Define as coordenadas
        } else {
          console.error('Endereço não encontrado. Usando coordenadas padrão.');
          setCoordenadas([-22.9068, -43.1729]); // Usar coordenadas padrão
        }
      })
      .catch(error => {
        console.error('Erro ao buscar coordenadas:', error);
        setCoordenadas([-22.9068, -43.1729]); // Usar coordenadas padrão
      });
  };

  const handleConfirm = (vaga) => {
    const userId = localStorage.getItem('userId'); // Obtém o ID do usuário do localStorage

    if (!userId) {
      alert('Usuário não autenticado. Faça login para continuar.');
      navigate('/login'); // Redireciona para a página de login
      return;
    }

    if (vaga.status === 'disponivel' && planoSelecionado.id) {
      // Redireciona para a página de pagamento com os detalhes da vaga e plano de tarifação
      navigate('/payment', { 
        state: { 
          id_vaga: vaga.id,               // ID da vaga
          id_usuario: userId,             // ID do usuário
          valor: planoSelecionado.taxa_base, // Valor baseado na tarifa selecionada
          plano_id: planoSelecionado.id   // ID do plano de tarifação
        }
      });
    } else if (!planoSelecionado.id) {
      alert('Por favor, selecione um plano de tarifação.');
    } else {
      alert('Esta vaga não está disponível para reserva.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Configurações do carrossel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="reservation-container">
      <Header />
      <h2>Reservar uma vaga</h2>

      {/* Mapa interativo */}
      <div className="map-container">
        <MapContainer
          center={coordenadas} // Usando coordenadas obtidas ou padrão
          zoom={15} // Ajuste o zoom conforme necessário
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={coordenadas}>
            <Popup>📍 {estacionamento ? estacionamento.nome : 'Estacionamento'}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Menu suspenso para selecionar um plano de tarifação */}
      <div className="planos-tarifacao">
        <h3>Selecione um plano de tarifação:</h3>
        <select 
          onChange={(e) => {
            const selectedPlano = planosTarifacao.find(plano => plano.id === Number(e.target.value));
            setPlanoSelecionado(selectedPlano);
          }}
          value={planoSelecionado.id || ''}
        >
          <option value="" disabled>Escolha um plano</option>
          {planosTarifacao.map(plano => (
            <option key={plano.id} value={plano.id}>
              {plano.descricao} - Taxa Base: R$ {plano.taxa_base}
            </option>
          ))}
        </select>
      </div>

      {/* Carrossel de vagas */}
      <div className="vaga-carousel">
        {vagas.length > 0 ? (
          <Slider {...carouselSettings}>
            {vagas.map(vaga => (
              <div key={vaga.id} className="vaga-item">
                <div className="vaga-info">
                  <h3>{`Vaga ${vaga.numero}`}</h3>
                  <p className={`status ${vaga.status}`}>
                    {vaga.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                  </p>
                  <p className="tipo">{vaga.tipo}</p>
                </div>
                <button
                  className={`confirm-button ${vaga.status}`}
                  disabled={vaga.status !== 'disponivel'}
                  onClick={() => handleConfirm(vaga)}
                >
                  {vaga.status === 'disponivel' ? 'Confirmar' : 'Indisponível'}
                </button>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="no-vagas">Não há vagas disponíveis no momento.</p>
        )}
      </div>

      {/* Botão de voltar */}
      <button className="back-button" onClick={handleBack}>Voltar</button>
    </div>
  );
};

export default Reservation;
