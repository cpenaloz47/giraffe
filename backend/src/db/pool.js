const { Pool } = require('pg');
const path = require('path');
const envFile = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../../.env.test')
  : path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envFile });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('📦 Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err.message);
});

module.exports = pool;
