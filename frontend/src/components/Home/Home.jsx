import { Link, useNavigate } from 'react-router-dom';
import { saveVisitorSession } from '../../services/authService';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const enterAsVisitor = () => {
    saveVisitorSession();
    navigate('/client-dashboard');
  };

  return (
    <div className="home-container">
      <header className="home-nav">
        <strong>Park Q</strong>
        <nav>
          <button type="button" onClick={enterAsVisitor}>
            Ver vagas
          </button>
          <Link to="/login">Fazer login</Link>
          <Link className="pill-link" to="/register">
            Cadastre-se
          </Link>
        </nav>
      </header>

      <main className="home-content">
        <section>
          <h1 className="home-title">Estacione perto, sem enrolacao</h1>
          <p className="home-subtitle">
            Encontre estacionamentos no mapa, compare vagas e veja tarifas antes de
            criar uma conta.
          </p>
          <div className="buttons">
            <button className="btn btn-primary" type="button" onClick={enterAsVisitor}>
              Entrar como visitante
            </button>
            <Link to="/login">
              <button className="btn btn-secondary" type="button">
                Fazer login
              </button>
            </Link>
          </div>
        </section>

        <section className="home-preview">
          <div>
            <span>Mapa</span>
            <strong>30+ estacionamentos</strong>
          </div>
          <div>
            <span>Consulta</span>
            <strong>Vagas e tarifas</strong>
          </div>
          <div>
            <span>Conta cliente</span>
            <strong>Reserva e pagamento</strong>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
