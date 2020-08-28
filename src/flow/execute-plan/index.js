const executeQueriesInPlan = require('./execute-queries-in-plan');
const {
  fp: { flow },
} = require('@0ti.me/tiny-pfp');
const rollback = require('./rollback');

module.exports = context =>
  flow([
    // elevate to promise intentionally and explicitly
    () => context.Promise.resolve(context),
    executeQueriesInPlan,
  ])(context).catch(err =>
    flow([
      rollback,
      executeQueriesInPlan,
      () => {
        throw err;
      },
    ])(context),
  );
