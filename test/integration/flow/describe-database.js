const generateMockQuery = require('../../lib/generate-mock-query');
const getVersion = require('../../../src/lib/queries/get-version');
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
  let mockQuery = null;
  let versionsTableName = null;

  const describeDatabase = (...args) => {
    set(context, POOL, mockQuery);

    return tquire(me)(...args);
  };

  beforeEach(() => {
    versionsTableName = `versions-table-name-${uuid()}`.replace(/-/g, '_');

    context = {};
    config = _.cloneDeep(testConfig);

    set(context, 'config', config);
    set(context, VERSIONS_TABLE_NAME, versionsTableName);
  });

  describe('given that the versions table does not exist', () => {
    beforeEach(() => {
      mockQuery = generateMockQuery().bindQueryAndResponse(
        getVersion(context),
        () =>
          Promise.reject(
            new Error(`relation "${versionsTableName}" does not exist`),
          ),
      );
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
