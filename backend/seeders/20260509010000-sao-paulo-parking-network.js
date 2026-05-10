'use strict';

const parkings = [
  ['Park Q Paulista', 'Av. Paulista, 1578 - Bela Vista, Sao Paulo, SP', -23.561684, -46.655981, 'Avenida'],
  ['Park Q Consolacao', 'Rua da Consolacao, 2300 - Consolacao, Sao Paulo, SP', -23.552739, -46.660827, 'Centro'],
  ['Park Q Republica', 'Praca da Republica, 299 - Republica, Sao Paulo, SP', -23.543203, -46.64291, 'Centro'],
  ['Park Q Se', 'Praca da Se, 1 - Se, Sao Paulo, SP', -23.55031, -46.633961, 'Historico'],
  ['Park Q Liberdade', 'Rua Galvao Bueno, 48 - Liberdade, Sao Paulo, SP', -23.558642, -46.635934, 'Comercial'],
  ['Park Q Vila Mariana', 'Rua Vergueiro, 2400 - Vila Mariana, Sao Paulo, SP', -23.589155, -46.634972, 'Residencial'],
  ['Park Q Moema', 'Av. Ibirapuera, 2700 - Moema, Sao Paulo, SP', -23.609341, -46.666861, 'Shopping'],
  ['Park Q Itaim', 'Rua Joaquim Floriano, 466 - Itaim Bibi, Sao Paulo, SP', -23.584012, -46.676704, 'Empresarial'],
  ['Park Q Faria Lima', 'Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, Sao Paulo, SP', -23.58681, -46.682162, 'Empresarial'],
  ['Park Q Pinheiros', 'Rua dos Pinheiros, 870 - Pinheiros, Sao Paulo, SP', -23.566658, -46.686645, 'Comercial'],
  ['Park Q Vila Madalena', 'Rua Harmonia, 500 - Vila Madalena, Sao Paulo, SP', -23.552564, -46.69043, 'Lazer'],
  ['Park Q Butanta', 'Av. Vital Brasil, 1000 - Butanta, Sao Paulo, SP', -23.571904, -46.710494, 'Universitario'],
  ['Park Q Lapa', 'Rua Doze de Outubro, 300 - Lapa, Sao Paulo, SP', -23.522293, -46.703463, 'Comercial'],
  ['Park Q Barra Funda', 'Av. Marques de Sao Vicente, 1619 - Barra Funda, Sao Paulo, SP', -23.525625, -46.667642, 'Terminal'],
  ['Park Q Santana', 'Rua Voluntarios da Patria, 2200 - Santana, Sao Paulo, SP', -23.501982, -46.625501, 'Zona Norte'],
  ['Park Q Tiete', 'Av. Cruzeiro do Sul, 1800 - Santana, Sao Paulo, SP', -23.516972, -46.625284, 'Terminal'],
  ['Park Q Tatuape', 'Rua Tuiuti, 2000 - Tatuape, Sao Paulo, SP', -23.540319, -46.57652, 'Shopping'],
  ['Park Q Analia Franco', 'Av. Regente Feijo, 1739 - Jardim Analia Franco, Sao Paulo, SP', -23.562848, -46.559102, 'Shopping'],
  ['Park Q Mooca', 'Rua da Mooca, 2400 - Mooca, Sao Paulo, SP', -23.55808, -46.598652, 'Bairro'],
  ['Park Q Ipiranga', 'Rua Bom Pastor, 1200 - Ipiranga, Sao Paulo, SP', -23.586543, -46.609266, 'Historico'],
  ['Park Q Saude', 'Av. Jabaquara, 1500 - Saude, Sao Paulo, SP', -23.617612, -46.638825, 'Metro'],
  ['Park Q Jabaquara', 'Av. Engenheiro Armando de Arruda Pereira, 1000 - Jabaquara, Sao Paulo, SP', -23.646231, -46.641986, 'Terminal'],
  ['Park Q Morumbi', 'Av. Roque Petroni Junior, 1089 - Morumbi, Sao Paulo, SP', -23.622794, -46.699553, 'Shopping'],
  ['Park Q Berrini', 'Av. Engenheiro Luis Carlos Berrini, 1376 - Brooklin, Sao Paulo, SP', -23.608439, -46.696899, 'Empresarial'],
  ['Park Q Santo Amaro', 'Av. Santo Amaro, 5000 - Santo Amaro, Sao Paulo, SP', -23.655003, -46.710575, 'Zona Sul'],
  ['Park Q Interlagos', 'Av. Interlagos, 2255 - Interlagos, Sao Paulo, SP', -23.679019, -46.677746, 'Shopping'],
  ['Park Q Brooklin', 'Rua Florida, 1500 - Brooklin, Sao Paulo, SP', -23.612919, -46.690985, 'Empresarial'],
  ['Park Q Perdizes', 'Rua Cardoso de Almeida, 1000 - Perdizes, Sao Paulo, SP', -23.537953, -46.673074, 'Bairro'],
  ['Park Q Higienopolis', 'Av. Higienopolis, 618 - Higienopolis, Sao Paulo, SP', -23.54385, -46.656238, 'Shopping'],
  ['Park Q Jardins', 'Alameda Lorena, 1500 - Jardim Paulista, Sao Paulo, SP', -23.564933, -46.668183, 'Premium'],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.sequelize.transaction(async (transaction) => {
      for (let index = 0; index < parkings.length; index += 1) {
        const [nome, localizacao, latitude, longitude, categoria] = parkings[index];
        const capacidade = 10 + (index % 6) * 3;
        const vagasDisponiveis = capacidade;
        const imagemUrl =
          index % 2 === 0
            ? 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a'
            : 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98';

        await queryInterface.sequelize.query(
          `
          INSERT INTO "Estacionamentos"
            ("nome", "localizacao", "latitude", "longitude", "capacidade", "vagas_disponiveis", "categoria", "imagemUrl", "createdAt", "updatedAt")
          SELECT
            :nome,
            :localizacao,
            :latitude,
            :longitude,
            :capacidade,
            :vagasDisponiveis,
            :categoria,
            :imagemUrl,
            :now,
            :now
          WHERE NOT EXISTS (
            SELECT 1 FROM "Estacionamentos" WHERE "nome" = :nome
          );
          `,
          {
            replacements: {
              capacidade,
              categoria,
              imagemUrl,
              latitude,
              localizacao,
              longitude,
              nome,
              now,
              vagasDisponiveis,
            },
            transaction,
          },
        );

        const [rows] = await queryInterface.sequelize.query(
          `
          SELECT "id" FROM "Estacionamentos"
          WHERE "nome" = :nome
          LIMIT 1;
          `,
          { replacements: { nome }, transaction },
        );
        const estacionamentoId = rows[0].id;

        for (let numero = 1; numero <= capacidade; numero += 1) {
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
                tipo: numero % 5 === 0 ? 'moto' : 'carro',
              },
              transaction,
            },
          );
        }

        await queryInterface.sequelize.query(
          `
          INSERT INTO "PlanoTarifacaos"
            ("descricao", "id_estacionamento", "data_vigencia", "taxa_base", "taxa_hora", "taxa_diaria", "createdAt", "updatedAt")
          SELECT
            'Plano padrao',
            :estacionamentoId,
            :now,
            :taxaBase,
            :taxaHora,
            :taxaDiaria,
            :now,
            :now
          WHERE NOT EXISTS (
            SELECT 1 FROM "PlanoTarifacaos"
            WHERE "id_estacionamento" = :estacionamentoId
          );
          `,
          {
            replacements: {
              estacionamentoId,
              now,
              taxaBase: 5 + (index % 3),
              taxaHora: 8 + (index % 4),
              taxaDiaria: 60 + (index % 5) * 5,
            },
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const nomes = parkings.map(([nome]) => nome);
      const [rows] = await queryInterface.sequelize.query(
        `
        SELECT "id" FROM "Estacionamentos"
        WHERE "nome" IN (:nomes);
        `,
        { replacements: { nomes }, transaction },
      );
      const ids = rows.map((row) => row.id);

      if (ids.length > 0) {
        await queryInterface.sequelize.query(
          `
          DELETE FROM "Vagas"
          WHERE "id_estacionamento" IN (:ids);
          `,
          { replacements: { ids }, transaction },
        );
      }

      await queryInterface.sequelize.query(
        `
        DELETE FROM "Estacionamentos"
        WHERE "nome" IN (:nomes);
        `,
        { replacements: { nomes }, transaction },
      );
    });
  },
};
