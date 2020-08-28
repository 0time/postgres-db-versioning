const defaultConfig = require('../lib/defaults');
const merge = require('lodash.merge');

module.exports = options =>
  merge({ Promise }, defaultConfig, { config: options });
