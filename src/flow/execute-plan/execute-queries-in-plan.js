const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DRY_RUN, IS_QUERY, PLAN, POOL },
} = require('../../lib/constants');

module.exports = context => {
  const promise = context.Promise.resolve();
  const plan = get(context, PLAN);

  if (get(context, DRY_RUN, false) !== true && plan.length > 0) {
    const pool = get(context, POOL);

    return plan.reduce(
      (acc, each) =>
        acc.then(() =>
          get(each, IS_QUERY, true) === false
            ? // non queries should be executed with context as an arg
              each(context)
            : Array.isArray(each)
            ? pool.query(...each)
            : pool.query(each),
        ),
      promise,
    );
  }

  return promise.then(() => context);
};
