const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    CONFIG_LOGGER,
    ERROR_FN_LOGGER_CONFIG,
    INFO_FN_LOGGER_CONFIG,
  },
} = require('../constants');

module.exports = context => {
  const logger = get(context, CONFIG_LOGGER);
  const errorFnName = get(context, ERROR_FN_LOGGER_CONFIG);
  const infoFnName = get(context, INFO_FN_LOGGER_CONFIG);

  return {
    error: (...logStuff) => logger[errorFnName](...logStuff),
    info: (...logStuff) => logger[infoFnName](...logStuff),
  };
};
