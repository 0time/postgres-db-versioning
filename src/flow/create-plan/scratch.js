const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    CONFIG_VERSION,
    DATABASE_VERSION,
    PLAN,
    SCRATCH,
    SCRATCHED_VERSION,
  },
} = require('../../lib/constants');

module.exports = context => {
  const configuredVersion = get(context, CONFIG_VERSION);
  const databaseVersion = get(context, DATABASE_VERSION);
  const scratch = get(context, SCRATCH);

  if (!!scratch && databaseVersion === null) {
    set(context, PLAN, get(context, PLAN).concat(scratch));
    set(context, SCRATCHED_VERSION, configuredVersion);
  }

  return context;
};
