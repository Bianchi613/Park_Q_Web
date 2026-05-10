'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const clientPassword = process.env.SEED_CLIENT_PASSWORD || 'cliente123';
    const visitorPassword = process.env.SEED_VISITOR_PASSWORD || 'visitor123';

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        INSERT INTO "Estacionamentos"
          ("nome", "localizacao", "latitude", "longitude", "capacidade", "vagas_disponiveis", "categoria", "imagemUrl", "createdAt", "updatedAt")
        SELECT
          'Park Q Centro',
          'Av. Paulista, 1000 - Sao Paulo, SP',
          -23.5630990,
          -46.6544000,
          5,
          5,
          'Centro comercial',
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a',
          :now,
          :now
        WHERE NOT EXISTS (
          SELECT 1 FROM "Estacionamentos" WHERE "nome" = 'Park Q Centro'
        );
        `,
        { replacements: { now }, transaction },
      );

      const [estacionamentos] = await queryInterface.sequelize.query(
        `
        SELECT "id" FROM "Estacionamentos"
        WHERE "nome" = 'Park Q Centro'
        LIMIT 1;
        `,
        { transaction },
      );
      const estacionamentoId = estacionamentos[0].id;

      await queryInterface.sequelize.query(
        `
        INSERT INTO "PlanoTarifacaos"
          ("descricao", "id_estacionamento", "data_vigencia", "taxa_base", "taxa_hora", "taxa_diaria", "createdAt", "updatedAt")
        SELECT
          'Plano padrao',
          :estacionamentoId,
          :now,
          5.00,
          8.00,
          60.00,
          :now,
          :now
        WHERE NOT EXISTS (
          SELECT 1 FROM "PlanoTarifacaos"
          WHERE "id_estacionamento" = :estacionamentoId
        );
        `,
        { replacements: { estacionamentoId, now }, transaction },
      );

      for (let numero = 1; numero <= 5; numero += 1) {
        await queryInterface.sequelize.query(
          `
          INSERT INTO "Vagas"
            ("numero", "id_estacionamento", "status", "tipo", "reservada", "id_reserva", "createdAt", "updatedAt")
          SELECT
            :numero,
            :estacionamentoId,
            'disponivel',
            :tipo,
            false,
            NULL,
            :now,
            :now
          WHERE NOT EXISTS (
            SELECT 1 FROM "Vagas"
            WHERE "numero" = :numero AND "id_estacionamento" = :estacionamentoId
          );
          `,
          {
            replacements: {
              estacionamentoId,
              now,
              numero,
              tipo: numero === 5 ? 'moto' : 'carro',
            },
            transaction,
          },
        );
      }

      const usuarios = [
        {
          CPF: '00000000000',
          nome: 'Admin Park Q',
          email: 'admin@parkq.local',
          telefone: '(11) 90000-0000',
          login: 'admin',
          senha: await bcrypt.hash(adminPassword, 10),
          role: 'ADMIN',
          cargo: 'Administrador',
          privilegios: 'gerenciar_estacionamento',
          id_estacionamento: estacionamentoId,
        },
        {
          CPF: '11111111111',
          nome: 'Cliente Park Q',
          email: 'cliente@parkq.local',
          telefone: '(11) 91111-1111',
          login: 'cliente',
          senha: await bcrypt.hash(clientPassword, 10),
          role: 'CLIENT',
          preferencias: 'vaga_carro',
          id_estacionamento: null,
        },
        {
          CPF: '22222222222',
          nome: 'Visitante Park Q',
          email: 'visitor@parkq.local',
          telefone: '(11) 92222-2222',
          login: 'visitor',
          senha: await bcrypt.hash(visitorPassword, 10),
          role: 'VISITOR',
          preferencias: 'consulta_tarifas',
          id_estacionamento: null,
        },
      ];

      for (const usuario of usuarios) {
        await queryInterface.sequelize.query(
          `
          INSERT INTO "Usuarios"
            ("CPF", "nome", "email", "telefone", "preferencias", "cargo", "privilegios", "login", "senha", "role", "id_estacionamento", "createdAt", "updatedAt")
          SELECT
            :CPF,
            :nome,
            :email,
            :telefone,
            :preferencias,
            :cargo,
            :privilegios,
            :login,
            :senha,
            :role,
            :id_estacionamento,
            :now,
            :now
          WHERE NOT EXISTS (
            SELECT 1 FROM "Usuarios"
            WHERE "email" = :email OR "login" = :login OR "CPF" = :CPF
          );
          `,
          {
            replacements: {
              ...usuario,
              preferencias: usuario.preferencias || null,
              cargo: usuario.cargo || null,
              privilegios: usuario.privilegios || null,
              now,
            },
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        DELETE FROM "Usuarios"
        WHERE "email" IN (
          'admin@parkq.local',
          'cliente@parkq.local',
          'visitor@parkq.local'
        );
        `,
        { transaction },
      );

      const [estacionamentos] = await queryInterface.sequelize.query(
        `
        SELECT "id" FROM "Estacionamentos"
        WHERE "nome" = 'Park Q Centro'
        LIMIT 1;
        `,
        { transaction },
      );

      if (estacionamentos[0]) {
        await queryInterface.sequelize.query(
          `
          DELETE FROM "Vagas"
          WHERE "id_estacionamento" = :estacionamentoId;
          `,
          {
            replacements: { estacionamentoId: estacionamentos[0].id },
            transaction,
          },
        );
      }

      await queryInterface.sequelize.query(
        `
        DELETE FROM "PlanoTarifacaos"
        WHERE "descricao" = 'Plano padrao';
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        DELETE FROM "Estacionamentos"
        WHERE "nome" = 'Park Q Centro';
        `,
        { transaction },
      );
    });
  },
};
