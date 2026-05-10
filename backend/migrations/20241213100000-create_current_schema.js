'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Estacionamentos" (
        "id" SERIAL PRIMARY KEY,
        "nome" VARCHAR(100) NOT NULL,
        "localizacao" VARCHAR(255) NOT NULL,
        "latitude" DECIMAL(10, 7),
        "longitude" DECIMAL(10, 7),
        "capacidade" INT NOT NULL,
        "vagas_disponiveis" INT NOT NULL,
        "categoria" VARCHAR(100),
        "imagemUrl" VARCHAR(500),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      ALTER TABLE "Estacionamentos"
        ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(10, 7),
        ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(10, 7),
        ADD COLUMN IF NOT EXISTS "categoria" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "imagemUrl" VARCHAR(500);

      CREATE TABLE IF NOT EXISTS "PlanoTarifacaos" (
        "id" SERIAL PRIMARY KEY,
        "descricao" VARCHAR(255),
        "data_vigencia" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "id_estacionamento" INT NOT NULL REFERENCES "Estacionamentos"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "taxa_base" DECIMAL(10, 2) NOT NULL,
        "taxa_hora" DECIMAL(10, 2),
        "taxa_diaria" DECIMAL(10, 2),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      ALTER TABLE "PlanoTarifacaos"
        ADD COLUMN IF NOT EXISTS "id_estacionamento" INT;

      CREATE TABLE IF NOT EXISTS "Usuarios" (
        "id" SERIAL PRIMARY KEY,
        "CPF" VARCHAR(255) UNIQUE NOT NULL,
        "nome" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "telefone" VARCHAR(255),
        "preferencias" TEXT,
        "cargo" VARCHAR(100),
        "privilegios" TEXT,
        "login" VARCHAR(255) UNIQUE NOT NULL,
        "senha" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
        "id_estacionamento" INT REFERENCES "Estacionamentos"("id") ON UPDATE CASCADE ON DELETE SET NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "Usuarios_role_check" CHECK ("role" IN ('ADMIN', 'CLIENT', 'VISITOR'))
      );

      ALTER TABLE "Usuarios"
        ADD COLUMN IF NOT EXISTS "preferencias" TEXT,
        ADD COLUMN IF NOT EXISTS "cargo" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "privilegios" TEXT,
        ADD COLUMN IF NOT EXISTS "role" VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
        ADD COLUMN IF NOT EXISTS "id_estacionamento" INT;

      CREATE TABLE IF NOT EXISTS "Vagas" (
        "id" SERIAL PRIMARY KEY,
        "numero" INT NOT NULL,
        "id_estacionamento" INT NOT NULL REFERENCES "Estacionamentos"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "status" VARCHAR(20) NOT NULL,
        "tipo" VARCHAR(20) NOT NULL,
        "reservada" BOOLEAN DEFAULT FALSE,
        "id_reserva" INT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "Vagas_status_check" CHECK ("status" IN ('disponivel', 'ocupada')),
        CONSTRAINT "Vagas_tipo_check" CHECK ("tipo" IN ('carro', 'moto'))
      );

      ALTER TABLE "Vagas"
        ADD COLUMN IF NOT EXISTS "id_reserva" INT;

      CREATE TABLE IF NOT EXISTS "Reservas" (
        "id" SERIAL PRIMARY KEY,
        "data_reserva" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "data_fim" TIMESTAMP WITH TIME ZONE,
        "valor" DECIMAL(10, 2) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
        "id_usuario" INT NOT NULL REFERENCES "Usuarios"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "id_vaga" INT NOT NULL REFERENCES "Vagas"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "id_plano" INT REFERENCES "PlanoTarifacaos"("id") ON UPDATE CASCADE ON DELETE SET NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "Reservas_status_check" CHECK ("status" IN ('ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'))
      );

      ALTER TABLE "Reservas"
        ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) NOT NULL DEFAULT 'ATIVA';

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Vagas_id_reserva_fkey'
        ) THEN
          ALTER TABLE "Vagas"
          ADD CONSTRAINT "Vagas_id_reserva_fkey"
          FOREIGN KEY ("id_reserva") REFERENCES "Reservas"("id")
          ON UPDATE CASCADE ON DELETE SET NULL;
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS "Pagamentos" (
        "id" SERIAL PRIMARY KEY,
        "id_reserva" INT NOT NULL REFERENCES "Reservas"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "metodo_pagamento" VARCHAR(30) NOT NULL,
        "valor_pago" DECIMAL(10, 2) NOT NULL,
        "data_hora" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "Pagamentos_metodo_pagamento_check" CHECK ("metodo_pagamento" IN ('cartao_credito', 'PIX', 'boleto'))
      );

      CREATE TABLE IF NOT EXISTS "Operacaos" (
        "id" SERIAL PRIMARY KEY,
        "tipo" VARCHAR(30) NOT NULL DEFAULT 'SISTEMA',
        "descricao" VARCHAR(255) NOT NULL,
        "data_hora" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "entidade" VARCHAR(80),
        "id_entidade" INT,
        "dados" JSONB,
        "resultado" VARCHAR(20) NOT NULL DEFAULT 'SUCESSO',
        "id_usuario" INT NOT NULL REFERENCES "Usuarios"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "Operacaos_tipo_check" CHECK ("tipo" IN ('RESERVA', 'CANCELAMENTO', 'PAGAMENTO', 'VAGA', 'ESTACIONAMENTO', 'RELATORIO', 'USUARIO', 'SISTEMA')),
        CONSTRAINT "Operacaos_resultado_check" CHECK ("resultado" IN ('SUCESSO', 'FALHA'))
      );

      ALTER TABLE "Operacaos"
        ADD COLUMN IF NOT EXISTS "tipo" VARCHAR(30) NOT NULL DEFAULT 'SISTEMA',
        ADD COLUMN IF NOT EXISTS "entidade" VARCHAR(80),
        ADD COLUMN IF NOT EXISTS "id_entidade" INT,
        ADD COLUMN IF NOT EXISTS "dados" JSONB,
        ADD COLUMN IF NOT EXISTS "resultado" VARCHAR(20) NOT NULL DEFAULT 'SUCESSO';

      CREATE TABLE IF NOT EXISTS "Notificacaos" (
        "id" SERIAL PRIMARY KEY,
        "tipo" VARCHAR(30) NOT NULL DEFAULT 'SISTEMA',
        "titulo" VARCHAR(120) NOT NULL,
        "mensagem" TEXT NOT NULL,
        "lida" BOOLEAN NOT NULL DEFAULT FALSE,
        "data_hora" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "chave" VARCHAR(120) UNIQUE,
        "id_usuario" INT NOT NULL REFERENCES "Usuarios"("id") ON UPDATE CASCADE ON DELETE CASCADE,
        "id_reserva" INT REFERENCES "Reservas"("id") ON UPDATE CASCADE ON DELETE SET NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "Notificacaos_tipo_check" CHECK ("tipo" IN ('CADASTRO', 'RESERVA', 'PAGAMENTO', 'CANCELAMENTO', 'EXPIRACAO', 'SISTEMA'))
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "Notificacaos" CASCADE;
      DROP TABLE IF EXISTS "Operacaos" CASCADE;
      DROP TABLE IF EXISTS "Pagamentos" CASCADE;
      DROP TABLE IF EXISTS "Reservas" CASCADE;
      DROP TABLE IF EXISTS "Vagas" CASCADE;
      DROP TABLE IF EXISTS "Usuarios" CASCADE;
      DROP TABLE IF EXISTS "PlanoTarifacaos" CASCADE;
      DROP TABLE IF EXISTS "Estacionamentos" CASCADE;
    `);
  },
};
