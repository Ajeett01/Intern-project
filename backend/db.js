const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'token_system',
  password: 'ajeettiwari',
  port: 5432,
});

module.exports = pool;