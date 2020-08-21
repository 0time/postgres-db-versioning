const {
  get,
  lib: {
    index: { promiseProps },
  },
  set,
} = require('@0ti.me/tiny-pfp');
const getVersion = require('../lib/db/get-version');
const {
  JSON_SELECTORS: { DATABASE_DESCRIPTION, VERSIONS_TABLE_NAME },
} = require('../lib/constants');

module.exports = context =>
  promiseProps({
    version: getVersion(context).catch(err => {
      if (
        err.message ===
        `relation "${get(
          context,
          VERSIONS_TABLE_NAME,
        ).toLowerCase()}" does not exist`
      ) {
        return null;
      } else {
        throw err;
      }
    }),
  }).then(result => set(context, DATABASE_DESCRIPTION, result));
