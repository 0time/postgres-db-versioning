const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    CONFIG_LOGGER,
    ERROR_FN_LOGGER_CONFIG,
    INFO_FN_LOGGER_CONFIG,
  },
} = require('../../src/lib/constants');

const {
  sinon: { stub },
} = deps;

module.exports = context => {
  const logger = {};

  set(logger, get(context, ERROR_FN_LOGGER_CONFIG, 'error'), stub());
  set(logger, get(context, INFO_FN_LOGGER_CONFIG, 'info'), stub());

  set(context, CONFIG_LOGGER, logger);

  return context;
};
