const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { IS_QUERY, PLAN, TRANSACTION },
} = require('../../lib/constants');

module.exports = context => {
  const existingPlan = get(context, PLAN);

  if (existingPlan.length > 0) {
    set(
      context,
      PLAN,
      [
        'BEGIN',
        set(context => set(context, TRANSACTION, true), IS_QUERY, false),
      ].concat(existingPlan),
    );
  }

  return context;
};
