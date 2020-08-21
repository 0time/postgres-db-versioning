const create = require('../lib/logger/create');
const {
  JSON_SELECTORS: { LOGGER },
} = require('../lib/constants');
const { set } = require('@0ti.me/tiny-pfp');

module.exports = context => set(context, LOGGER, create(context));
