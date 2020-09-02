const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { EVENT_HANDLER, IS_QUERY, PLAN },
} = require('../lib/constants');

module.exports = context => {
  const eventHandler = get(context, EVENT_HANDLER, false);

  if (eventHandler !== false) {
    get(context, PLAN).forEach(each => {
      if (get(each, IS_QUERY, true) === true) {
        // non queries should be ignored during the plan, they just set(context, TRANSACTION, true|false);
        if (Array.isArray(each)) {
          eventHandler.emit(...each);
        } else {
          eventHandler.emit(each);
        }
      }
    });
  }

  return context;
};
