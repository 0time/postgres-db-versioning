const insertVersionsTable = require('../../../../src/lib/queries/insert-versions-table');
const {
  JSON_SELECTORS: {
    DATABASE_VERSION,
    PLAN,
    SCRATCH,
    CONFIG_VERSION,
    VERSIONS_TABLE_NAME,
  },
} = require('../../../../src/lib/constants');
const { set } = require('@0ti.me/tiny-pfp');

const { d, expect, tquire, uuid } = deps;

const me = __filename;

d(me, () => {
  const scratch = (...args) => tquire(me)(...args);

  let configVersion = null;
  let context = null;
  let insertStatement = null;
  let versionsTableName = null;

  beforeEach(() => {
    context = {};

    configVersion = `config-version-${uuid()}`;
    versionsTableName = `versions-table-name-${uuid()}`.replace(/-/g, '_');

    set(context, PLAN, []);
    set(context, CONFIG_VERSION, configVersion);
    set(context, VERSIONS_TABLE_NAME, versionsTableName);

    insertStatement = insertVersionsTable(context)({}).shift();
  });

  describe('given a null database version', () => {
    beforeEach(() => {
      set(context, DATABASE_VERSION, null);
    });

    describe('and a defined scratch', () => {
      let aScratchStep = null;
      let bScratchStep = null;

      beforeEach(() => {
        aScratchStep = `a-scratch-step-${uuid()}`;
        bScratchStep = `b-scratch-step-${uuid()}`;

        set(context, SCRATCH, [aScratchStep, bScratchStep]);
      });

      it('should add them to the plan', () =>
        expect(scratch(context))
          .to.have.nested.property(PLAN)
          .and.that.deep.equals([
            aScratchStep,
            bScratchStep,
            [insertStatement, [configVersion, 'scratch version']],
          ]));
    });

    describe('and an undefined scratch', () =>
      it('should not modify the plan', () =>
        expect(scratch(context))
          .to.have.nested.property(PLAN)
          .and.that.deep.equals([])));
  });

  describe('given a defined database version and a defined scratch', () => {
    beforeEach(() => {
      set(context, DATABASE_VERSION, 0);
      set(context, SCRATCH, [0, 1]);
    });

    it('should not attempt a scratch', () =>
      expect(scratch(context))
        .to.have.nested.property(PLAN)
        .and.that.deep.equals([]));
  });
});
