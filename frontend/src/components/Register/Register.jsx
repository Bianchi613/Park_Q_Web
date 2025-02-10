import { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
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
      setError("As senhas não coincidem!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/usuarios", {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        cpf: formData.cpf,
        role: formData.isAdmin ? "admin" : "cliente",
      });

      alert("Cadastro realizado com sucesso!");
      console.log(response.data);
    } catch (err) {
      setError("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label>Nome Completo</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Telefone</label>
        <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />

        <label>Senha</label>
        <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />

        <label>Confirmação de Senha</label>
        <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />

        <label>CPF</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />

        <div className="admin-toggle">
          <label>Tipo de Perfil</label>
          <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
          <span className="toggle-description">Só acione este botão caso você seja um administrador.</span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="register-button">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;
