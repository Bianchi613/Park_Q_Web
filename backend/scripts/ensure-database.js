'use strict';

const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const quoteIdentifier = (identifier) => `"${identifier.replace(/"/g, '""')}"`;

async function ensureDatabase() {
  const databaseName = requiredEnv('DATABASE_NAME');
  const maintenanceDatabase = process.env.DATABASE_MAINTENANCE_DB || 'postgres';

  const client = new Client({
    host: requiredEnv('DATABASE_HOST'),
    port: Number(requiredEnv('DATABASE_PORT')),
    user: requiredEnv('DATABASE_USER'),
    password: requiredEnv('DATABASE_PASSWORD'),
    database: maintenanceDatabase,
  });

  await client.connect();

  try {
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );

    if (result.rowCount > 0) {
      console.log(`Database "${databaseName}" already exists.`);
      return;
    }

    await client.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
    console.log(`Database "${databaseName}" created.`);
  } finally {
    await client.end();
  }
}

ensureDatabase().catch((error) => {
  console.error(`Failed to ensure database: ${error.message}`);
  process.exit(1);
});
