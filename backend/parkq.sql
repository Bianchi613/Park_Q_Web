CREATE TABLE Estacionamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    capacidade INT NOT NULL,
    vagas_disponiveis INT NOT NULL,
    categoria VARCHAR(100),
    imagemUrl VARCHAR(500),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE PlanoTarifacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255),
    data_vigencia TIMESTAMP NOT NULL,
    taxa_base DECIMAL(10, 2) NOT NULL,
    taxa_hora DECIMAL(10, 2),
    taxa_diaria DECIMAL(10, 2),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    CPF VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    preferencias TEXT,
    cargo VARCHAR(100),
    privilegios TEXT,
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('ADMIN', 'CLIENT', 'VISITOR')) NOT NULL DEFAULT 'CLIENT',
    id_estacionamento INT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_estacionamento) REFERENCES Estacionamento(id)
);

CREATE TABLE Vaga (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    id_estacionamento INT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('disponivel', 'ocupada')) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('carro', 'moto')) NOT NULL,
    reservada BOOLEAN DEFAULT FALSE,
    id_reserva INT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_estacionamento) REFERENCES Estacionamento(id)
);

CREATE TABLE Reserva (
    id SERIAL PRIMARY KEY,
    data_reserva TIMESTAMP DEFAULT NOW(),
    data_fim TIMESTAMP,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA')) NOT NULL DEFAULT 'ATIVA',
    id_usuario INT NOT NULL,
    id_vaga INT NOT NULL,
    id_plano INT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_vaga) REFERENCES Vaga(id),
    FOREIGN KEY (id_plano) REFERENCES PlanoTarifacao(id)
);

ALTER TABLE Vaga
ADD CONSTRAINT fk_vaga_reserva
FOREIGN KEY (id_reserva) REFERENCES Reserva(id);

CREATE TABLE Notificacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(30) CHECK (tipo IN ('CADASTRO', 'RESERVA', 'PAGAMENTO', 'CANCELAMENTO', 'EXPIRACAO', 'SISTEMA')) NOT NULL DEFAULT 'SISTEMA',
    titulo VARCHAR(120) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    chave VARCHAR(120) UNIQUE,
    id_usuario INT NOT NULL,
    id_reserva INT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id)
);

CREATE TABLE Operacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(30) CHECK (tipo IN ('RESERVA', 'CANCELAMENTO', 'PAGAMENTO', 'VAGA', 'ESTACIONAMENTO', 'RELATORIO', 'USUARIO', 'SISTEMA')) NOT NULL DEFAULT 'SISTEMA',
    descricao VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    entidade VARCHAR(80),
    id_entidade INT,
    dados JSONB,
    resultado VARCHAR(20) CHECK (resultado IN ('SUCESSO', 'FALHA')) NOT NULL DEFAULT 'SUCESSO',
    id_usuario INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

CREATE TABLE Pagamento (
    id SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL,
    metodo_pagamento VARCHAR(20) CHECK (metodo_pagamento IN ('cartao_credito', 'PIX', 'boleto')) NOT NULL,
    valor_pago DECIMAL(10, 2) NOT NULL,
    data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id)
);

CREATE OR REPLACE FUNCTION atualizar_vagas_disponiveis()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.status = 'disponivel' AND OLD.status = 'ocupada' THEN
        UPDATE Estacionamento SET vagas_disponiveis = vagas_disponiveis + 1
        WHERE id = NEW.id_estacionamento;
    ELSIF NEW.status = 'ocupada' AND OLD.status = 'disponivel' THEN
        UPDATE Estacionamento SET vagas_disponiveis = vagas_disponiveis - 1
        WHERE id = NEW.id_estacionamento;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_atualizar_vagas_disponiveis
AFTER UPDATE ON Vaga
FOR EACH ROW
EXECUTE FUNCTION atualizar_vagas_disponiveis();
