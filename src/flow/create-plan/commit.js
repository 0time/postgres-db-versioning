const { get, set, unset } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { IS_QUERY, PLAN, TRANSACTION },
} = require('../../lib/constants');

module.exports = context => {
  const existingPlan = get(context, PLAN);

  if (existingPlan.length > 0) {
    set(
      context,
      PLAN,
      existingPlan.concat([
        'COMMIT',
        set(context => unset(context, TRANSACTION), IS_QUERY, false),
      ]),
    );
  }

  return context;
};
