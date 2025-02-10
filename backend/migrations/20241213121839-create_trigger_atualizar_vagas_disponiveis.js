'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      -- Remove o trigger antes de criar
      DROP TRIGGER IF EXISTS trg_atualizar_vagas_disponiveis ON Vaga;

      -- Cria ou atualiza a função
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

      -- Cria o trigger novamente
      CREATE TRIGGER trg_atualizar_vagas_disponiveis
      AFTER UPDATE ON Vaga
      FOR EACH ROW
      EXECUTE FUNCTION atualizar_vagas_disponiveis();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      -- Remove o trigger e a função no rollback
      DROP TRIGGER IF EXISTS trg_atualizar_vagas_disponiveis ON Vaga;
      DROP FUNCTION IF EXISTS atualizar_vagas_disponiveis;
    `);
  },
};
