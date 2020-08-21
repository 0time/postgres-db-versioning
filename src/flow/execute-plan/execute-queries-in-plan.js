const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DRY_RUN, IS_QUERY, PLAN, POOL },
} = require('../../lib/constants');

module.exports = context => {
  const promise = context.Promise.resolve();

  if (get(context, DRY_RUN, false) !== true) {
    const pool = get(context, POOL);

    return get(context, PLAN).reduce(
      (acc, each) =>
        acc.then(() =>
          get(each, IS_QUERY, true) === false
            ? // non queries should be executed with context as an arg
              each(context)
            : pool.query(each),
        ),
      promise,
    );
  }

  return promise.then(() => context);
};
