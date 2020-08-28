const { Pool } = require('pg');

/*
Useful stuff:

const dropTableIgnoreError = tableName =>
  pool.query(`DROP TABLE ${tableName}`).catch(() => null);

afterEach(() => {
  dropTableIgnoreError(versionsTableName);
});

beforeEach(() => {
  dropTableIgnoreError(versionsTableName);
});
*/

module.exports = () =>
  new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.PGPASSWORD,
    database: 'postgres',
  });
