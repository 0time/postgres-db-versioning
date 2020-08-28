const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DRY_RUN, IS_QUERY, LOGGER, PLAN },
} = require('../lib/constants');

module.exports = context => {
  if (get(context, DRY_RUN, false) === true) {
    get(context, PLAN).forEach(each => {
      if (get(each, IS_QUERY, true) === true) {
        // non queries should be ignored during the plan, they just set(context, TRANSACTION, true|false);
        if (Array.isArray(each)) {
          get(context, LOGGER).info(...each);
        } else {
          get(context, LOGGER).info(each);
        }
      }
    });
  }

  return context;
};
