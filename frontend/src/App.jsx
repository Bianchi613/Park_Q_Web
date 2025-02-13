import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ClientDashboard from './components/ClientDashboard/ClientDashboard';
import ProfileSettings from './components/ProfileSettings/ProfileSettings';
import Reservation from './components/Reservation/Reservation';
import Payment from './components/Payment/Payment';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import TariffPlan from './components/TariffPlan/TariffPlan';

import ParkingManagement from './components/ParkingManagement/ParkingManagement'; // Importando o ParkingManagement

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tariff-plan" element={<TariffPlan />} />

        {/* Rota para as configurações de perfil com ID */}
        <Route path="/perfil/:id" element={<ProfileSettings />} />

        {/* Rota para a página de reservas com ID do estacionamento */}
        <Route path="/reservation/:id" element={<Reservation />} />

        {/* Rota para o pagamento */}
        <Route path="/payment" element={<Payment />} />

        {/* Rota para o ParkingManagement */}
        <Route path="/estacionamento" element={<ParkingManagement />} /> {/* Nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
