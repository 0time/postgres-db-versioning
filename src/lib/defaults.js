module.exports = {
  config: {
    connectionConfig: {
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      database: 'postgres',
    },
    dryRun: false,
    migrations: [],
    tableNameForVersions: 'DatabaseVersion',
  },
};
