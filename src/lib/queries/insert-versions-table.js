const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { VERSIONS_TABLE_NAME },
} = require('../constants');
const pgFormat = require('pg-format');

module.exports = context => ({ description, version }) => [
  pgFormat(
    'INSERT INTO %I (version, description) VALUES ($1, $2)',
    get(context, VERSIONS_TABLE_NAME),
  ),
  [version, description],
];
