const assignPool = require('./src/flow/assign-pool');
const config = require('config');

const context = { config };

assignPool(context);

context.pool
  .query(process.argv.slice(2)[0])
  // eslint-disable-next-line no-console
  .then(console.error)
  .then(() => process.exit(0));
