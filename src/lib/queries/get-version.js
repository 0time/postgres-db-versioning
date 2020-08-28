const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { VERSIONS_TABLE_NAME },
} = require('../constants');
const pgFormat = require('pg-format');

module.exports = context =>
  pgFormat(
    'SELECT MAX(version) AS version FROM %I;',
    get(context, VERSIONS_TABLE_NAME),
  );
