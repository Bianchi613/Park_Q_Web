import { useState } from 'react';
import './Payment.css';
import Header from '../Layout/Header'; // Corrigido o caminho do Header
const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleConfirm = () => {
    // Logic for confirming the payment goes here
    alert(`Payment confirmed using ${paymentMethod}`);
  };

  const handleBack = () => {
    // Logic for going back to the previous page
    alert('Going back...');
  };

  return (
    <div className="payment-container">
       <Header /> {/* Adicionando o Header acima da lista de estacionamentos */}
      <h2>Escolha da forma de Pagamento:</h2>
      <div className="payment-methods">
        <label className="payment-option">
          <input
            type="radio"
            value="Boleto bancário"
            checked={paymentMethod === 'Boleto bancário'}
            onChange={handlePaymentChange}
          />
          Boleto bancário
        </label>
        <label className="payment-option">
          <input
            type="radio"
            value="Depósito bancário"
            checked={paymentMethod === 'Depósito bancário'}
            onChange={handlePaymentChange}
          />
          Depósito bancário
        </label>
        <label className="payment-option">
          <input
            type="radio"
            value="AmExpress"
            checked={paymentMethod === 'AmExpress'}
            onChange={handlePaymentChange}
          />
          AmExpress (1x de R$ 34,80)
        </label>
      </div>
      <div className="buttons">
        <button onClick={handleConfirm} className="confirm-button">Confirmar Pagamento</button>
        <button onClick={handleBack} className="back-button">Voltar</button>
      </div>
    </div>
  );
};

export default Payment;
