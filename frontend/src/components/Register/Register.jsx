import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook para redirecionamento
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate(); // Hook para redirecionar o usuário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    CPF: "",  // CPF deve estar em maiúsculas
    login: "",
    isAdmin: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas nao coincidem!");
      return;
    }

    if (!formData.CPF) {
      setError("O CPF e obrigatorio.");
      return;
    }

    console.log("Dados enviados:", formData); // Log para depuração

    try {
      const response = await axios.post("http://localhost:3000/usuarios", {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        CPF: formData.CPF, // CPF deve estar em maiúsculas
        login: formData.login,
        role: formData.isAdmin ? "ADMIN" : "CLIENT",
      });

      alert("Cadastro realizado com sucesso!");
      console.log(response.data);

      // 🔥 Redireciona o usuário para a tela de login após o cadastro
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Erro ao cadastrar usuario. Verifique os dados e tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Criar conta</h2>
        <label>Nome Completo</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Telefone</label>
        <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />

        <label>CPF</label>
        <input type="text" name="CPF" value={formData.CPF} onChange={handleChange} required />

        <label>Login</label>
        <input type="text" name="login" value={formData.login} onChange={handleChange} required />

        <label>Senha</label>
        <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />

        <label>Confirmacao de Senha</label>
        <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />

        <div className="admin-toggle">
          <label>Tipo de Perfil</label>
          <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
          <span className="toggle-description">So acione este campo caso voce seja um administrador.</span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="register-button">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;
