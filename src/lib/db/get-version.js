const { fp, get } = require('@0ti.me/tiny-pfp');

const {
  JSON_SELECTORS: { POOL, VERSIONS_TABLE_NAME },
} = require('../constants');

module.exports = context =>
  get(context, POOL)
    .query(
      // TODO: SQL Injection protection
      `SELECT MAX(version) FROM ${get(context, VERSIONS_TABLE_NAME)};`,
    )
    .then(fp.get('rows.0.version'));
