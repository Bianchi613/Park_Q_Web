const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

module.exports = {
  development: {
    username: requiredEnv('DATABASE_USER'),
    password: requiredEnv('DATABASE_PASSWORD'),
    database: requiredEnv('DATABASE_NAME'),
    host: requiredEnv('DATABASE_HOST'),
    port: Number(requiredEnv('DATABASE_PORT')),
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
  test: {
    username: requiredEnv('DATABASE_USER'),
    password: requiredEnv('DATABASE_PASSWORD'),
    database: `${requiredEnv('DATABASE_NAME')}_test`,
    host: requiredEnv('DATABASE_HOST'),
    port: Number(requiredEnv('DATABASE_PORT')),
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
  production: {
    username: requiredEnv('DATABASE_USER'),
    password: requiredEnv('DATABASE_PASSWORD'),
    database: `${requiredEnv('DATABASE_NAME')}_production`,
    host: requiredEnv('DATABASE_HOST'),
    port: Number(requiredEnv('DATABASE_PORT')),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
  },
};
