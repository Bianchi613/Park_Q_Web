import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import './TariffPlan.css';

const TariffPlan = () => {
  const navigate = useNavigate(); // Hook para navegação
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
      const response = await axios.get("http://localhost:3000/planos-tarifacao");
      setPlanos(response.data);
    } catch (error) {
      setError("Erro ao buscar planos de tarifação.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(taxaBase) < 0 || parseFloat(taxaHora) < 0 || parseFloat(taxaDiaria) < 0) {
      setError("As taxas devem ser valores positivos.");
      return;
    }
    if (new Date(dataVigencia) < new Date()) {
      setError("A data de vigência não pode ser uma data passada.");
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
        await axios.patch(`http://localhost:3000/planos-tarifacao/${editingPlan.id}`, novoPlano);
        setSuccess("Plano atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:3000/planos-tarifacao", novoPlano);
        setSuccess("Plano criado com sucesso!");
      }
      fetchPlanos();
      resetForm();
      setError(null);
    } catch (error) {
      setError("Erro ao salvar plano de tarifação.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/planos-tarifacao/${id}`);
      setSuccess("Plano excluído com sucesso!");
      fetchPlanos();
    } catch (error) {
      setError("Erro ao excluir plano de tarifação.");
      console.error(error);
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
    <div className="flex">
      {/* Sidebar à esquerda */}

      {/* Conteúdo principal à direita */}
      <div className="p-6 bg-gray-50 min-h-screen flex-1">
        {/* Botão para voltar ao Admin Dashboard */}
        <button
          className="back-button"
          onClick={() => navigate("/admin-dashboard")} // Redireciona para o dashboard
        >
          Voltar ao Admin Dashboard
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Planos de Tarifação</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
            <input
              type="date"
              value={dataVigencia}
              onChange={(e) => setDataVigencia(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Taxa Base"
              value={taxaBase}
              onChange={(e) => setTaxaBase(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Taxa Hora"
              value={taxaHora}
              onChange={(e) => setTaxaHora(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Taxa Diária"
              value={taxaDiaria}
              onChange={(e) => setTaxaDiaria(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-blue-700 transition-colors"
          >
            {editingPlan ? "Atualizar Plano" : "Criar Plano"}
          </button>
        </form>

        {/* Lista de Planos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Planos Cadastrados</h3>
          <div className="carousel-container">
            {planos.map((plano) => (
              <div key={plano.id} className="carousel-item">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold">{plano.descricao}</h3>
                    <p className="text-sm text-gray-500">Vigência: {plano.data_vigencia.split("T")[0]}</p>
                    <p className="text-sm">Taxa Base: R${plano.taxa_base}</p>
                    <p className="text-sm">Taxa Hora: R${plano.taxa_hora}</p>
                    <p className="text-sm">Taxa Diária: R${plano.taxa_diaria}</p>
                  </div>
                  <div className="carousel-buttons mt-4">
                    <button
                      onClick={() => handleEdit(plano)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(plano.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffPlan;