import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Pegando os dados da reserva e plano de tarifação
  const { id_vaga, valor, id_usuario, plano_id } = location.state || {};

  // Exibindo os dados da reserva e plano
  const planoDescricao = location.state?.plano_descricao || 'Plano não selecionado';

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // 📌 CONFIRMAR PAGAMENTO
  const handleConfirm = async () => {
    if (!paymentMethod) {
      alert('Por favor, escolha uma forma de pagamento.');
      return;
    }

    try {
      // 1. Cria a reserva
      const dataReserva = new Date().toISOString(); // Data e hora atuais
      const dataFim = null; // Data de fim (pode ser nula ou uma data futura)

      const reservaResponse = await axios.post('http://localhost:3000/reservas', {
        id_vaga: id_vaga,    // ID da vaga
        id_usuario: id_usuario,  // ID do usuário recuperado do localStorage
        valor: valor,        // Valor da vaga
        dataReserva: dataReserva, // Data e hora da reserva
        dataFim: dataFim,   // Data de fim (pode ser nulo)
        plano_id: plano_id  // ID do plano de tarifação
      });

      const reservaId = reservaResponse.data.id; // ID da reserva criada
      console.log('Reserva criada com sucesso. ID:', reservaId);

      // 2. Recupera os detalhes da reserva
      const detalhesReservaResponse = await axios.get(`http://localhost:3000/reservas/${reservaId}`);
      const detalhesReserva = detalhesReservaResponse.data;
      console.log('Detalhes da reserva:', detalhesReserva);

      // 3. Registra o pagamento
      const pagamentoResponse = await axios.post('http://localhost:3000/pagamentos', {
        id_reserva: reservaId, // ID da reserva
        metodo_pagamento: paymentMethod,
        valor_pago: valor, // Valor do pagamento
        data_hora: new Date().toISOString(), // Data e hora do pagamento
      });

      console.log('Pagamento registrado:', pagamentoResponse.data);

      // 4. Reserva a vaga
      const reservaVagaResponse = await axios.post(`http://localhost:3000/vagas/${id_vaga}/reservar`);
      console.log('Vaga reservada:', reservaVagaResponse.data);

      alert('Pagamento e reserva realizados com sucesso!');
      navigate('/success'); // Redireciona para a página de sucesso
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  // 📌 VOLTAR E LIBERAR A VAGA SE CANCELAR O PAGAMENTO
  const handleBack = async () => {
    if (id_vaga) {
      try {
        await axios.post(`http://localhost:3000/vagas/${id_vaga}/liberar`);
        alert('Vaga liberada com sucesso.');
      } catch (error) {
        console.error('Erro ao liberar a vaga:', error);
        alert('Erro ao liberar a vaga. Tente novamente.');
      }
    }

    navigate(-1); // Voltar para a tela anterior
  };

  return (
    <div className="payment-container">
      <h2>Escolha a forma de Pagamento:</h2>
      
      {/* Exibindo informações da reserva */}
      <div className="reservation-details">
        <p><strong>Vaga ID:</strong> {id_vaga}</p>
        <p><strong>Valor da Reserva:</strong> R$ {valor}</p>
        <p><strong>Plano Selecionado:</strong> {planoDescricao}</p>
      </div>

      <div className="payment-methods">
        <label className="payment-option">
          <input
            type="radio"
            value="PIX"
            checked={paymentMethod === 'PIX'}
            onChange={handlePaymentChange}
          />
          <span>Pagamento por PIX</span>
        </label>
        <label className="payment-option">
          <input
            type="radio"
            value="Cartão de Crédito"
            checked={paymentMethod === 'Cartão de Crédito'}
            onChange={handlePaymentChange}
          />
          Cartão de Crédito
        </label>
        <label className="payment-option">
          <input
            type="radio"
            value="Boleto Bancário"
            checked={paymentMethod === 'Boleto Bancário'}
            onChange={handlePaymentChange}
          />
          Boleto Bancário
        </label>
      </div>
      
      <div className="buttons">
        <button onClick={handleConfirm} className="confirm-button">Confirmar Pagamento</button>
        <button onClick={handleBack} className="back-button">Cancelar e Voltar</button>
      </div>
    </div>
  );
};

export default Payment;
