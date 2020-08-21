const between = require('../../lib/between');
const { get, set } = require('@0ti.me/tiny-pfp');
const insertVersionsTable = require('../../lib/queries/insert-versions-table');
const {
  JSON_SELECTORS: {
    DATABASE_VERSION,
    MIGRATIONS,
    PLAN,
    REQUESTED_VERSION,
    SCRATCHED_VERSION,
  },
} = require('../../lib/constants');
const sortMigrations = require('../../lib/sort-migrations');

module.exports = context => {
  const migrations = get(context, MIGRATIONS).sort(sortMigrations);

  if (migrations.length > 0) {
    const databaseVersion = get(context, DATABASE_VERSION);
    const requestedVersion = get(
      context,
      REQUESTED_VERSION,
      migrations[migrations.length - 1].version,
    );
    const scratchedVersion = get(context, SCRATCHED_VERSION, false);

    const filterFn = between(
      scratchedVersion !== false ? scratchedVersion : databaseVersion,
      requestedVersion,
      {
        inclusiveHigh: true,
        valueSelector: 'version',
      },
    );

    const thePlan = migrations
      .filter(filterFn)
      .reduce(
        (acc, each) =>
          acc.concat([each.sql, insertVersionsTable(context)(each)]),
        get(context, PLAN),
      );

    set(context, PLAN, thePlan);
  }

  return context;
};
