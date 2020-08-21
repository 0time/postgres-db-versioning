const { NODE_ENV } = process.env;
const nycConfig = require('@0ti.me/test-deps/configuration-templates/nyc.config');

module.exports = Object.assign(
  {},
  nycConfig,
  // TODO: Fix this so we are testing coverage
  nycConfig.getCoverageLevels(NODE_ENV === 'unit' ? 27 : 68),
);
