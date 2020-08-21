const { fp, get } = require('@0ti.me/tiny-pfp');
const getVersion = require('../queries/get-version');
const {
  JSON_SELECTORS: { POOL },
} = require('../constants');

module.exports = context =>
  get(context, POOL)
    .query(getVersion(context))
    .then(fp.get('rows.0.version'));
