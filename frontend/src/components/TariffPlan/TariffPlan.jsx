import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/Header";
import { planosApi } from "../../services/api";
import "./TariffPlan.css";

const TariffPlan = () => {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [dataVigencia, setDataVigencia] = useState("");
  const [taxaBase, setTaxaBase] = useState("");
  const [taxaHora, setTaxaHora] = useState("");
  const [taxaDiaria, setTaxaDiaria] = useState("");
  const [editingPlan, setEditingPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      const data = await planosApi.list();
      setPlanos(data);
    } catch (requestError) {
      setError("Erro ao buscar planos de tarifacao.");
      console.error(requestError);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      parseFloat(taxaBase) < 0 ||
      parseFloat(taxaHora) < 0 ||
      parseFloat(taxaDiaria) < 0
    ) {
      setError("As taxas devem ser valores positivos.");
      return;
    }

    if (new Date(dataVigencia) < new Date()) {
      setError("A data de vigencia nao pode ser uma data passada.");
      return;
    }

    const novoPlano = {
      descricao,
      data_vigencia: dataVigencia,
      taxa_base: parseFloat(taxaBase),
      taxa_hora: parseFloat(taxaHora),
      taxa_diaria: parseFloat(taxaDiaria),
    };

    try {
      if (editingPlan) {
        await planosApi.update(editingPlan.id, novoPlano);
        setSuccess("Plano atualizado com sucesso!");
      } else {
        await planosApi.create(novoPlano);
        setSuccess("Plano criado com sucesso!");
      }

      fetchPlanos();
      resetForm();
      setError(null);
    } catch (requestError) {
      setError("Erro ao salvar plano de tarifacao.");
      console.error(requestError);
    }
  };

  const handleDelete = async (id) => {
    try {
      await planosApi.remove(id);
      setSuccess("Plano excluido com sucesso!");
      fetchPlanos();
    } catch (requestError) {
      setError("Erro ao excluir plano de tarifacao.");
      console.error(requestError);
    }
  };

  const handleEdit = (plano) => {
    setEditingPlan(plano);
    setDescricao(plano.descricao);
    setDataVigencia(plano.data_vigencia.split("T")[0]);
    setTaxaBase(plano.taxa_base);
    setTaxaHora(plano.taxa_hora);
    setTaxaDiaria(plano.taxa_diaria);
  };

  const resetForm = () => {
    setDescricao("");
    setDataVigencia("");
    setTaxaBase("");
    setTaxaHora("");
    setTaxaDiaria("");
    setEditingPlan(null);
  };

  return (
    <div className="tariff-page">
      <Header />

      <main className="tariff-shell">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/admin-dashboard")}
        >
          Voltar ao dashboard
        </button>

        <section className="tariff-heading">
          <p className="eyebrow">Tarifas</p>
          <h2>Planos de tarifacao</h2>
        </section>

        {error && <p className="tariff-message error">{error}</p>}
        {success && <p className="tariff-message success">{success}</p>}

        <form onSubmit={handleSubmit} className="tariff-form">
          <div className="tariff-form-grid">
            <input
              type="text"
              placeholder="Descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              required
            />
            <input
              type="date"
              value={dataVigencia}
              onChange={(event) => setDataVigencia(event.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Taxa Base"
              value={taxaBase}
              onChange={(event) => setTaxaBase(event.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Taxa Hora"
              value={taxaHora}
              onChange={(event) => setTaxaHora(event.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Taxa Diaria"
              value={taxaDiaria}
              onChange={(event) => setTaxaDiaria(event.target.value)}
              required
            />
          </div>
          <button type="submit">
            {editingPlan ? "Atualizar plano" : "Criar plano"}
          </button>
        </form>

        <section className="tariff-list">
          <h3>Planos cadastrados</h3>
          <div className="carousel-container">
            {planos.map((plano) => (
              <article key={plano.id} className="carousel-item">
                <div className="tariff-plan-card">
                  <div>
                    <h3>{plano.descricao}</h3>
                    <p>Vigencia: {plano.data_vigencia.split("T")[0]}</p>
                    <p>Taxa Base: R${plano.taxa_base}</p>
                    <p>Taxa Hora: R${plano.taxa_hora}</p>
                    <p>Taxa Diaria: R${plano.taxa_diaria}</p>
                  </div>
                  <div className="carousel-buttons">
                    <button type="button" onClick={() => handleEdit(plano)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(plano.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TariffPlan;
