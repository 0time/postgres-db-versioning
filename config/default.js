module.exports = {
  connectionConfig: {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'postgres',
  },
  dryRun: false,
  loggerFunctionMap: {
    error: 'error',
    info: 'info',
  },
  logger: console,
  migrations: [],
};
