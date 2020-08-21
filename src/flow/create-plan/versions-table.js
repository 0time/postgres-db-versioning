const createVersionsTable = require('../../lib/queries/create-versions-table');
const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DATABASE_VERSION, PLAN },
} = require('../../lib/constants');

module.exports = context => {
  if (get(context, DATABASE_VERSION, null) === null) {
    get(context, PLAN).push(createVersionsTable(context));
  }

  return context;
};
