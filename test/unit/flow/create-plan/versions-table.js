const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DATABASE_VERSION, PLAN, VERSIONS_TABLE_NAME },
} = require('../../../../src/lib/constants');

const { d, expect, tquire, uuid } = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let createPlan = null;
  let versionsTableName = null;

  beforeEach(() => {
    createPlan = tquire(me);

    versionsTableName = `versions-table-name-${uuid()}`.replace(/-/g, '_');

    context = {};

    set(context, PLAN, []);
    set(context, VERSIONS_TABLE_NAME, versionsTableName);
  });

  describe('given the database has not been initialized', () => {
    beforeEach(() => {
      set(context, `${DATABASE_VERSION}`, null);
    });

    it('should start with creating the versions table', () => {
      createPlan(context);

      expect(get(context, PLAN).pop()).to.match(
        new RegExp(`CREATE TABLE ${versionsTableName}`),
      );
    });
  });

  describe('given the database has been initialized', () => {
    beforeEach(() => {
      set(context, `${DATABASE_VERSION}`, 0);
    });

    it('should not recommend creating the versions table', () => {
      createPlan(context);

      get(context, PLAN).forEach(each =>
        expect(each).to.not.match(
          new RegExp(`CREATE TABLE ${versionsTableName}`),
        ),
      );
    });
  });
});
