'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_atualizar_vagas_disponiveis ON "Vagas";

      CREATE OR REPLACE FUNCTION atualizar_vagas_disponiveis()
      RETURNS TRIGGER AS
      $$
      BEGIN
        IF NEW.status = 'disponivel' AND OLD.status = 'ocupada' THEN
          UPDATE "Estacionamentos"
          SET "vagas_disponiveis" = "vagas_disponiveis" + 1
          WHERE "id" = NEW.id_estacionamento;
        ELSIF NEW.status = 'ocupada' AND OLD.status = 'disponivel' THEN
          UPDATE "Estacionamentos"
          SET "vagas_disponiveis" = GREATEST("vagas_disponiveis" - 1, 0)
          WHERE "id" = NEW.id_estacionamento;
        END IF;
        RETURN NEW;
      END;
      $$
      LANGUAGE plpgsql;

      CREATE TRIGGER trg_atualizar_vagas_disponiveis
      AFTER UPDATE ON "Vagas"
      FOR EACH ROW
      EXECUTE FUNCTION atualizar_vagas_disponiveis();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_atualizar_vagas_disponiveis ON "Vagas";
      DROP FUNCTION IF EXISTS atualizar_vagas_disponiveis;
    `);
  },
};
