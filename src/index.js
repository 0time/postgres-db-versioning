const {
  fp: { flow },
} = require('@0ti.me/tiny-pfp');

const assignEventEmitter = require('./flow/assign-event-emitter');
const assignOptions = require('./flow/assign-options');
const assignPool = require('./flow/assign-pool');
const describeDatabase = require('./flow/describe-database');
const createPlan = require('./flow/create-plan');
const executePlan = require('./flow/execute-plan');
const logPlan = require('./flow/log-plan');

module.exports = flow([
  assignOptions,
  assignPool,
  assignEventEmitter,
  describeDatabase,
  createPlan,
  executePlan,
  logPlan,
]);
