'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE "PlanoTarifacaos"
          ADD COLUMN IF NOT EXISTS "id_estacionamento" INT;
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        UPDATE "PlanoTarifacaos"
        SET "id_estacionamento" = (
          SELECT "id" FROM "Estacionamentos" ORDER BY "id" LIMIT 1
        )
        WHERE "id_estacionamento" IS NULL
          AND EXISTS (SELECT 1 FROM "Estacionamentos");
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'PlanoTarifacaos_id_estacionamento_fkey'
          ) THEN
            ALTER TABLE "PlanoTarifacaos"
              ADD CONSTRAINT "PlanoTarifacaos_id_estacionamento_fkey"
              FOREIGN KEY ("id_estacionamento")
              REFERENCES "Estacionamentos"("id")
              ON UPDATE CASCADE
              ON DELETE CASCADE;
          END IF;
        END $$;
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        ALTER TABLE "PlanoTarifacaos"
          ALTER COLUMN "id_estacionamento" SET NOT NULL;
        `,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE "PlanoTarifacaos"
          DROP CONSTRAINT IF EXISTS "PlanoTarifacaos_id_estacionamento_fkey";
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        ALTER TABLE "PlanoTarifacaos"
          DROP COLUMN IF EXISTS "id_estacionamento";
        `,
        { transaction },
      );
    });
  },
};
