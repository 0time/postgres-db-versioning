const generateMockQuery = require('../../lib/generate-mock-query');
const {
  JSON_SELECTORS: { DATABASE_DESCRIPTION, POOL, VERSIONS_TABLE_NAME },
} = require('../../../src/lib/constants');
const { set } = require('@0ti.me/tiny-pfp');
const testConfig = require('config');

const { _, d, expect, tquire, uuid } = deps;

const me = __filename;

d(me, () => {
  let config = null;
  let context = null;
  let describeDatabase = null;
  let mockQuery = null;
  let versionsTableName = null;

  beforeEach(() => {
    versionsTableName = `versions-table-name-${uuid()}`.replace(/-/g, '_');
  });

  const initialize = () => {
    describeDatabase = tquire(me);

    config = _.cloneDeep(testConfig);

    context = { config };

    set(context, POOL, mockQuery);
    set(context, VERSIONS_TABLE_NAME, versionsTableName);
  };

  describe('given that the versions table does not exist', () => {
    beforeEach(() => {
      mockQuery = generateMockQuery().bindQueryAndResponse(
        `SELECT MAX(version) FROM ${versionsTableName};`,
        () =>
          Promise.reject(
            new Error(`relation "${versionsTableName}" does not exist`),
          ),
      );

      initialize();
    });

    it('should indicate the table does not exist', () =>
      expect(describeDatabase(context)).to.eventually.be.fulfilled.then(
        result =>
          expect(result)
            .to.have.nested.property(DATABASE_DESCRIPTION)
            .that.has.property('version', null),
      ));
  });
});
