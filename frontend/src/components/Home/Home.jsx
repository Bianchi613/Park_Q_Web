import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Park Q</h1>
        <h2 className="home-subtitle">Bem-Vindo ao Futuro do Estacionamento</h2>
        <div className="buttons">
          <Link to="/login">
            <button className="btn btn-primary">Entrar</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-secondary">Registrar-se</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;