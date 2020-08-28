const createVersionsTable = require('../../lib/queries/create-versions-table');
const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DATABASE_VERSION, PLAN },
} = require('../../lib/constants');

module.exports = context => {
  const existingPlan = get(context, PLAN);

  if (
    get(context, DATABASE_VERSION, null) === null &&
    existingPlan.length > 0
  ) {
    set(context, PLAN, [createVersionsTable(context)].concat(existingPlan));
  }

  return context;
};
