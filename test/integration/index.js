const createVersionsTable = require('../../src/lib/queries/create-versions-table');
const generateMockQuery = require('../lib/generate-mock-query');
const getVersion = require('../../src/lib/queries/get-version');
const initializeMockLogger = require('../lib/initialize-mock-logger');
const insertVersionsTable = require('../../src/lib/queries/insert-versions-table');
const {
  JSON_SELECTORS: {
    CONFIG_LOGGER,
    CONFIG_POOL,
    DRY_RUN,
    ERROR_FN_LOGGER_CONFIG,
    INFO_FN_LOGGER_CONFIG,
    MIGRATIONS,
    VERSIONS_TABLE_NAME,
  },
} = require('../../src/lib/constants');
const { get, set } = require('@0ti.me/tiny-pfp');
const testConfig = require('config');

const { _, d, expect, tquire, uuid } = deps;

const me = __filename;

const BEGIN = 'BEGIN';
const COMMIT = 'COMMIT';
const ROLLBACK = 'ROLLBACK';

d(me, () => {
  let A = null;
  let B = null;
  let C = null;
  let D = null;
  let E = null;
  let context = null;
  let createVersionsTableStatement = null;
  let getVersionQuery = null;
  let insertStatement = null;
  let migrations = null;
  let mockLogger = null;
  let mockQuery = null;
  let versionsTableName = null;

  const m = version => ({
    description: `description-${version}-${uuid()}`,
    sql: `sql-version-${version}-${uuid()}`,
    version,
  });

  const fromArray = array =>
    array.reduce(
      (acc, ea) =>
        acc.concat([[ea.sql], [insertStatement, [ea.version, ea.description]]]),
      [],
    );

  const index = () => {
    initializeMockLogger(context);

    A = m(0);
    B = m(1);
    C = m(2);
    D = m(3);
    E = m(4);

    migrations = [A, B, C, D, E];

    set(context, CONFIG_POOL, mockQuery);
    set(context, MIGRATIONS, migrations);

    mockLogger = get(context, CONFIG_LOGGER);

    insertStatement = insertVersionsTable(context)({}).shift();

    return tquire(me)(context.config);
  };

  beforeEach(() => {
    context = {};

    set(context, 'Promise', Promise);
    set(context, 'config', _.cloneDeep(testConfig));

    mockQuery = generateMockQuery(context);

    versionsTableName = `versions-table-name-${uuid()}`.replace(/-/g, '_');
    set(context, VERSIONS_TABLE_NAME, versionsTableName);

    createVersionsTableStatement = createVersionsTable(context);
    getVersionQuery = getVersion(context);
  });

  describe('given an uninitialized DB', () => {
    beforeEach(() => {
      mockQuery
        .bindQueryAndResponse(getVersionQuery, () =>
          Promise.reject(
            new Error(`relation "${versionsTableName}" does not exist`),
          ),
        )
        .bindQueryAndResponse(BEGIN, () => Promise.resolve())
        .bindQueryAndResponse(
          createVersionsTableStatement,
          () => Promise.resolve,
        )
        .bindQueryAndResponse(
          new RegExp(`^INSERT INTO ${versionsTableName}.*`),
          () => Promise.resolve(),
        )
        .bindQueryAndResponse(new RegExp('^sql-version-.*'), () =>
          Promise.resolve(),
        )
        .bindQueryAndResponse(COMMIT, () => Promise.resolve());
    });

    describe('and dry run is set', () => {
      beforeEach(() => {
        set(context, DRY_RUN, true);
      });

      it('should dry run', () =>
        expect(index(context)).to.eventually.be.fulfilled.then(() => {
          expect(
            mockLogger[get(context, ERROR_FN_LOGGER_CONFIG)].args,
            'error-fn-calls',
          ).to.deep.equal([]);

          expect(
            mockLogger[get(context, INFO_FN_LOGGER_CONFIG)].args,
            'info-fn-calls',
          ).to.deep.equal(
            [[BEGIN], [createVersionsTableStatement]]
              .concat(fromArray([A, B, C, D, E]))
              .concat([[COMMIT]]),
          );
        }));
    });

    describe('and dry run is not set', () => {
      it('should execute queries', () =>
        expect(index(context)).to.eventually.be.fulfilled.then(() => {
          expect(mockQuery.query.args).to.deep.equal(
            [[getVersionQuery], [BEGIN], [createVersionsTableStatement]]
              .concat(fromArray([A, B, C, D, E]))
              .concat([[COMMIT]]),
          );
        }));

      describe('and a database version exists', () => {
        beforeEach(() => {
          mockQuery = generateMockQuery(context)
            .bindQueryAndResponse(getVersionQuery, () =>
              Promise.resolve({ rows: [{ version: 0 }] }),
            )
            .bindQueryAndResponse(BEGIN, () => Promise.resolve())
            .bindQueryAndResponse(
              createVersionsTableStatement,
              () => Promise.resolve,
            )
            .bindQueryAndResponse(
              new RegExp(`^INSERT INTO ${versionsTableName}.*`),
              () => Promise.resolve(),
            )
            .bindQueryAndResponse(new RegExp('^sql-version-.*'), () =>
              Promise.resolve(),
            );
        });

        describe('and no problems', () => {
          beforeEach(() => {
            mockQuery = mockQuery.bindQueryAndResponse(COMMIT, () =>
              Promise.resolve(),
            );
          });

          it('should execute expected queries', () =>
            expect(index(context)).to.eventually.be.fulfilled.then(() => {
              expect(mockQuery.query.args).to.deep.equal(
                [[getVersionQuery], [BEGIN]]
                  .concat(fromArray([B, C, D, E]))
                  .concat([[COMMIT]]),
              );
            }));
        });

        describe('and a problem', () => {
          beforeEach(() => {
            mockQuery = mockQuery
              .bindQueryAndResponse(COMMIT, () =>
                Promise.reject(new Error('commit failed')),
              )
              .bindQueryAndResponse(ROLLBACK, () => Promise.resolve());
          });

          it('should execute expected queries and rollback', () =>
            expect(index(context)).to.eventually.be.rejected.then(() =>
              expect(mockQuery.query.args).to.deep.equal(
                [[getVersionQuery], [BEGIN]]
                  .concat(fromArray([B, C, D, E]))
                  .concat([[COMMIT], [ROLLBACK]]),
              ),
            ));
        });
      });
    });
  });
});
