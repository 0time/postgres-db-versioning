const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { COMMIT, PLAN },
} = require('../../lib/constants');
const unsetTransaction = require('./unset-transaction');

module.exports = context => {
  const existingPlan = get(context, PLAN);

  if (existingPlan.length > 0) {
    set(context, PLAN, existingPlan.concat([COMMIT, unsetTransaction]));
  }

  return context;
};
