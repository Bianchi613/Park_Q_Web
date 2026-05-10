'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        INSERT INTO "PlanoTarifacaos"
          ("descricao", "id_estacionamento", "data_vigencia", "taxa_base", "taxa_hora", "taxa_diaria", "createdAt", "updatedAt")
        SELECT
          'Plano padrao',
          e."id",
          NOW(),
          5.00,
          8.00,
          60.00,
          NOW(),
          NOW()
        FROM "Estacionamentos" e
        WHERE NOT EXISTS (
          SELECT 1
          FROM "PlanoTarifacaos" p
          WHERE p."id_estacionamento" = e."id"
        );
        `,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        DELETE FROM "PlanoTarifacaos" p
        WHERE p."descricao" = 'Plano padrao'
          AND NOT EXISTS (
            SELECT 1 FROM "Reservas" r WHERE r."id_plano" = p."id"
          );
        `,
        { transaction },
      );
    });
  },
};
