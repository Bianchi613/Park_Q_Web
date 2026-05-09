import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import { pagamentosApi, usuariosApi } from '../../services/api';
import './Payment.css';

const formatMoney = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const { reservaId, valor, id_vaga: idVaga, planoDescricao } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reservaId) {
      setStatus('Reserva nao encontrada. Volte e crie a reserva novamente.');
      return;
    }

    try {
      setSubmitting(true);
      await pagamentosApi.create({
        id_reserva: reservaId,
        metodo_pagamento: paymentMethod,
        valor_pago: Number(valor || 0),
        data_hora: new Date().toISOString(),
      });

      setStatus('Pagamento registrado com sucesso.');
      navigate('/client-dashboard', { replace: true });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erro ao registrar pagamento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (reservaId && userId) {
        await usuariosApi.cancelarReserva(userId, { id_reserva: reservaId });
      }
    } catch {
      setStatus('Nao foi possivel cancelar a reserva automaticamente.');
      return;
    }

    navigate(-1);
  };

  return (
    <div className="payment-page">
      <Header />

      <main className="payment-shell">
        <section className="payment-card">
          <p className="eyebrow">Pagamento</p>
          <h2>Confirmar pagamento da reserva</h2>

          {status && <div className="payment-alert">{status}</div>}

          <div className="payment-summary">
            <div>
              <span>Reserva</span>
              <strong>#{reservaId || '-'}</strong>
            </div>
            <div>
              <span>Vaga</span>
              <strong>{idVaga || '-'}</strong>
            </div>
            <div>
              <span>Plano</span>
              <strong>{planoDescricao || '-'}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{formatMoney(valor)}</strong>
            </div>
          </div>

          <fieldset className="payment-methods">
            <legend>Metodo de pagamento</legend>
            <label>
              <input
                type="radio"
                value="PIX"
                checked={paymentMethod === 'PIX'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              PIX
            </label>
            <label>
              <input
                type="radio"
                value="cartao_credito"
                checked={paymentMethod === 'cartao_credito'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Cartao de credito
            </label>
            <label>
              <input
                type="radio"
                value="boleto"
                checked={paymentMethod === 'boleto'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Boleto
            </label>
          </fieldset>

          <div className="payment-actions">
            <button type="button" onClick={handleConfirm} disabled={submitting}>
              {submitting ? 'Registrando...' : 'Confirmar pagamento'}
            </button>
            <button type="button" className="secondary-button" onClick={handleCancel}>
              Cancelar reserva
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Payment;
