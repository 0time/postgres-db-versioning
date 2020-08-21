const { set, unset } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { IS_QUERY, PLAN, ROLLBACK, TRANSACTION },
} = require('../../lib/constants');

module.exports = context =>
  set(context, PLAN, [
    ROLLBACK,
    set(context => unset(context, TRANSACTION), IS_QUERY, false),
  ]);
