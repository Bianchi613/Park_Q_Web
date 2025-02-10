-- Tabela Estacionamento
CREATE TABLE Estacionamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    capacidade INT NOT NULL,
    vagas_disponiveis INT NOT NULL
);

-- Tabela PlanoTarifacao (precisa ser criada antes de Reserva)
CREATE TABLE PlanoTarifacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255),
    data_vigencia DATE NOT NULL,
    taxa_base DECIMAL(10, 2) NOT NULL,
    taxa_hora DECIMAL(10, 2),
    taxa_diaria DECIMAL(10, 2)
);

-- Tabela Usuario (dados gerais)
CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY, -- Identificador único do usuário
    CPF BIGINT UNIQUE NOT NULL, -- ALTERADO para BIGINT para comportar números grandes
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('cliente', 'administrador', 'visitante')) NOT NULL, -- Alterado o ENUM para um campo VARCHAR com CHECK
    id_estacionamento INT,
    FOREIGN KEY (id_estacionamento) REFERENCES Estacionamento(id)
);

-- Tabela Vaga
CREATE TABLE Vaga (
    id SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    id_estacionamento INT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('disponivel', 'ocupada')) NOT NULL, -- Usando VARCHAR e CHECK no lugar de ENUM
    tipo VARCHAR(20) CHECK (tipo IN ('carro', 'moto')) NOT NULL,
    reservada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_estacionamento) REFERENCES Estacionamento(id)
);

-- Tabela Reserva
CREATE TABLE Reserva (
    id SERIAL PRIMARY KEY,
    data_reserva TIMESTAMP NOT NULL,
    data_fim TIMESTAMP,
    valor DECIMAL(10, 2) NOT NULL,
    id_usuario INT NOT NULL, -- Relacionamento com a tabela Usuario (não com Cliente ou Administrador diretamente)
    id_vaga INT NOT NULL,
    id_plano INT, -- Plano de tarifação vinculado diretamente
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_vaga) REFERENCES Vaga(id),
    FOREIGN KEY (id_plano) REFERENCES PlanoTarifacao(id)
);

-- Tabela Operacao
CREATE TABLE Operacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    id_usuario INT NOT NULL, -- Relacionamento com a tabela Usuario
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

-- Tabela Pagamento
CREATE TABLE Pagamento (
    id SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL,
    metodo_pagamento VARCHAR(20) CHECK (metodo_pagamento IN ('cartao_credito', 'PIX', 'boleto')) NOT NULL,
    valor_pago DECIMAL(10, 2) NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id)
);

-- Tabela Cliente (relacionada com Usuario)
CREATE TABLE Cliente (
    id SERIAL PRIMARY KEY, -- Identificador único do cliente
    id_usuario INT NOT NULL, -- Chave estrangeira para Usuario
    data_registro TIMESTAMP NOT NULL, -- Data de registro do cliente
    preferencias TEXT, -- Preferências do cliente
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

-- Tabela Administrador (relacionada com Usuario)
CREATE TABLE Administrador (
    id SERIAL PRIMARY KEY, -- Identificador único do administrador
    id_usuario INT NOT NULL, -- Chave estrangeira para Usuario
    cargo VARCHAR(100), -- Cargo do administrador
    privilegios TEXT, -- Privilegios especiais
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

-- Função para atualizar vagas disponíveis automaticamente
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

-- Criar o Trigger em si
CREATE TRIGGER trg_atualizar_vagas_disponiveis
AFTER UPDATE ON Vaga
FOR EACH ROW
EXECUTE FUNCTION atualizar_vagas_disponiveis();

