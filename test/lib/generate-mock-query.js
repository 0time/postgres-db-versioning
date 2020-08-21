const {
  lib: {
    index: { isString },
  },
} = require('@0ti.me/tiny-pfp');
const {
  _,
  sinon: { spy },
} = deps;

module.exports = function() {
  let responses = [];

  this.bindQueryAndResponse = (query, response) => {
    responses.push({ query, response });

    return this;
  };

  this.query = spy(query => {
    const result = responses.reduce((acc, each) => {
      if (acc) return acc;

      if (isString(each.query)) {
        if (query === each.query) {
          return each.response;
        }
      } else if (each.query.test) {
        if (each.query.test(query)) {
          return each.response;
        }
      } else {
        throw new Error('invalid query expectation');
      }

      return acc;
    }, false);

    if (!result) {
      return Promise.reject(`unexpected query ${query}`);
    } else {
      return Promise.resolve().then(() =>
        _.isFunction(result) ? result() : result,
      );
    }
  });

  return this;
};
