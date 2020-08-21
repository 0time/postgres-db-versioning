const { get, set, unset } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { IS_QUERY, PLAN, TRANSACTION },
} = require('../../lib/constants');

module.exports = context =>
  set(
    context,
    PLAN,
    get(context, PLAN).concat([
      'COMMIT',
      set(context => unset(context, TRANSACTION), IS_QUERY, false),
    ]),
  );
