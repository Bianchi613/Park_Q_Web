'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.sequelize.transaction(async (transaction) => {
      const [estacionamentos] = await queryInterface.sequelize.query(
        `
        SELECT
          e."id",
          e."capacidade",
          COUNT(v."id")::int AS "totalVagas"
        FROM "Estacionamentos" e
        LEFT JOIN "Vagas" v ON v."id_estacionamento" = e."id"
        GROUP BY e."id", e."capacidade"
        HAVING COUNT(v."id") = 0 AND e."capacidade" > 0;
        `,
        { transaction },
      );

      for (const estacionamento of estacionamentos) {
        const capacidade = Number(estacionamento.capacidade || 0);
        const vagas = Array.from({ length: capacidade }, (_, index) => ({
          numero: index + 1,
          id_estacionamento: estacionamento.id,
          status: 'disponivel',
          tipo: (index + 1) % 5 === 0 ? 'moto' : 'carro',
          reservada: false,
          id_reserva: null,
          createdAt: now,
          updatedAt: now,
        }));

        if (vagas.length > 0) {
          await queryInterface.bulkInsert('Vagas', vagas, { transaction });
        }

        await queryInterface.sequelize.query(
          `
          UPDATE "Estacionamentos"
          SET "vagas_disponiveis" = :capacidade, "updatedAt" = :now
          WHERE "id" = :id;
          `,
          {
            replacements: {
              capacidade,
              id: estacionamento.id,
              now,
            },
            transaction,
          },
        );
      }
    });
  },

  async down() {
    // Nao remove vagas para evitar apagar dados criados durante uso local.
  },
};
