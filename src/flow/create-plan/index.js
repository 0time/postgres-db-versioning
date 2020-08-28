const commit = require('./commit');
const createTransaction = require('./create-transaction');
const {
  fp: { flow, set },
} = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { PLAN },
} = require('../../lib/constants');
const migrations = require('./migrations');
const scratch = require('./scratch');
const versionsTable = require('./versions-table');

module.exports = flow([
  set(PLAN, []),
  scratch,
  migrations,
  versionsTable,
  createTransaction,
  commit,
]);
