const bcrypt = require('bcrypt');
const { Client } = require('pg');
require('dotenv').config();

const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const client = new Client({
  user: requiredEnv('DATABASE_USER'),
  host: requiredEnv('DATABASE_HOST'),
  database: requiredEnv('DATABASE_NAME'),
  password: requiredEnv('DATABASE_PASSWORD'),
  port: Number(requiredEnv('DATABASE_PORT')),
});

client.connect();

const senha = requiredEnv('TEST_USER_PASSWORD');

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    client.end();
    return;
  }

  console.log('Hash gerado:', hash);

  const updateQuery = `
    UPDATE "Usuarios"
    SET "senha" = $1
    WHERE "email" = 'alan@bianchi.com'`;

  client.query(updateQuery, [hash], (queryError) => {
    if (queryError) {
      console.error('Erro ao atualizar o banco:', queryError);
    } else {
      console.log('Senha do usuario atualizada com sucesso!');
    }

    client.end();
  });
});
