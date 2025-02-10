import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login'; // Adicionando a importação do Login
import ForgotPassword from './components/ForgotPassword/ForgotPassword'; // Importando o componente ForgotPassword
import ClientDashboard from './components/ClientDashboard/ClientDashboard'; // Importando o ClientDashboard
import ProfileSettings from './components/ProfileSettings/ProfileSettings'; // Importando o ProfileSettings
import Reservation from './components/Reservation/Reservation'; // Importando o componente de Reserva
import Payment from './components/Payment/Payment'; // Importando o Payment
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Rota para a página de login */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Rota para Esqueci a Senha */}
        <Route path="/client-dashboard" element={<ClientDashboard />} /> {/* Rota para o ClientDashboard */}
        
        {/* Rota para as configurações de perfil com ID */}
        <Route path="/perfil/:id" element={<ProfileSettings />} />

        {/* Rota para a página de reservas com ID do estacionamento */}
        <Route path="/reservation/:id" element={<Reservation />} /> {/* Nova Rota de Reserva */}
        
        {/* Rota para o pagamento */}
        <Route path="/payment" element={<Payment />} /> {/* Rota para a página de pagamento */}
      </Routes>
    </Router>
  );
}

export default App;
