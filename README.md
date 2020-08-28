# PostgresDB Versioning

Relational databases must be versioned if their data and tables are to be migrated properly over time. This project seeks to produce an NPM module which does the heavy lifting using configuration and version data supplied by whatever depends on this module.

## Configuration

    {
      "connectionConfig": {
        "user": "postgres",
        "password": "postgres",
        "host": "localhost",
        "database": "postgres",
        "port": 54231
      },
      "dryRun": false
      "loggerFunctionMap": {
        "error": "fatal",
        "info": "notice"
      },
      "logger": {
        fatal: text => console.error(text),
        notice: text => console.info(text)
      },
      "migrations": [
        {"version": 1, "description": "create the table a_table", "sql": "CREATE TABLE a_table (id INT);"},
        {"version": 2, "description": "add the table another_table", "sql": "CREATE TABLE another_table (id INT);"}
      ],
      "pool": {
        query: sqlString => console.error(sqlString)
      },
      "requestedVersion": 2,
      "scratch": [
        "CREATE TABLE table_name"
      ],
      "tableNameForVersions": "DatabaseVersion",
      "version": 1
    }

### Connection Config

If this module should manage the connection, then pass in a config object with this API: https://node-postgres.com/api/client/.

### Dry Run

With this feature enabled, the steps which would be performed will be sent to the logger without producing any effect to the DB.

### Logger Function Map

If your logger doesn't implement `"error"` or `"info"`, then you can remap them with this. This utility will only use `"error"` and `"info"` unless you configure it with this feature.

### Logger

The logger should implement functions for `"error"` and `"info"` unless you remapped them with `"options"."loggerFunctionMap"`, in which case those remapped functions should be implemented.

If not provided, it will default to `"globals"."console"`.

### Migrations

Migrations should be an array of objects containing a version number, an optional description of the changes, and the sql that should be executed.

### Pool

If included, this will be used blindly to send queries to the DB. It will be assumed that it implements this API: https://node-postgres.com/api/pool/. This option takes priority over `"connectionConfig"`, so don't provide `"pool"` if you want to use `"connectionConfig"`.

### Requested Version

If provided, it will stop trying to migrate at the requested version. This will disable use of scratch if the `"version"` is greater than the `"options"."requestedVersion"`.

If not provided, the max of `"options"."version"` and of the highest `"version"` in `"options"."migrations"` will be used.

### Scratch

If provided, the `scratch` array will be used to populate the database if the `"tableNameForVersions"` table is not yet present. Migrations with a `"version"` greater than `"options"."version"` will be also executed by making the assumption that the `"options"."version"` version has been achieved.

If not provided, the migrations array will be used.

### Table Name for Versions

This allows you change the name used to track versions of the DB.

### Version

This should be the same as the version which is created by `"scratch"`.
