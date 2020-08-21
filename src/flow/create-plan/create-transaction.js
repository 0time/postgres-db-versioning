const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { IS_QUERY, PLAN, TRANSACTION },
} = require('../../lib/constants');

module.exports = context =>
  set(
    context,
    PLAN,
    get(context, PLAN).concat([
      'BEGIN',
      set(context => set(context, TRANSACTION, true), IS_QUERY, false),
    ]),
  );
