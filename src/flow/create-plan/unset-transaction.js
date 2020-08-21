const { set, unset } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { IS_QUERY, TRANSACTION },
} = require('../../lib/constants');

const unsetTransaction = context => unset(context, TRANSACTION);

set(unsetTransaction, IS_QUERY, false);

module.exports = unsetTransaction;
