const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { CONFIG_EVENT_HANDLER, DRY_RUN, EVENT_HANDLER },
} = require('../lib/constants');

module.exports = context => {
  const dryRun = get(context, DRY_RUN, false);
  const eventHandler = get(context, CONFIG_EVENT_HANDLER, false);

  if (eventHandler !== false) {
    set(context, EVENT_HANDLER, { emit: eventHandler });
  } else {
    if (dryRun === true) {
      throw new Error(
        'A dry run was attempted without a defined event handler',
      );
    }
  }

  return context;
};
