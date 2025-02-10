import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h2>Bem-Vindos!</h2>
      <h1>Park Q</h1>
      <div className="buttons">
        <Link to="/login">
          <button className="btn">Entrar</button>
        </Link>
        <Link to="/register">
          <button className="btn">Registrar-se</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
