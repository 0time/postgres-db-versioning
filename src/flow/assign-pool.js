const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { CONFIG_CONNECTION, CONFIG_POOL, POOL },
} = require('../lib/constants');
const { Pool } = require('pg');

module.exports = context =>
  set(
    context,
    POOL,
    get(context, CONFIG_POOL, false) ||
      new Pool(get(context, CONFIG_CONNECTION)),
  );
