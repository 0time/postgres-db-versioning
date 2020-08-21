const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { VERSIONS_TABLE_NAME },
} = require('../constants');
const pgFormat = require('pg-format');

module.exports = context =>
  pgFormat(
    'CREATE TABLE %I (version INT NOT NULL, description VARCHAR(255));',
    get(context, VERSIONS_TABLE_NAME),
  );
