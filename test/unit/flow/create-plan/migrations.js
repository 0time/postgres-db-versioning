const { set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    DATABASE_VERSION,
    MIGRATIONS,
    PLAN,
    REQUESTED_VERSION,
    SCRATCHED_VERSION,
    VERSIONS_TABLE_NAME,
  },
} = require('../../../../src/lib/constants');
const insertVersionsTable = require('../../../../src/lib/queries/insert-versions-table');

const { d, expect, tquire, uuid } = deps;

const me = __filename;

d(me, () => {
  const migrations = (...args) => tquire(me)(...args);

  let A = null;
  let B = null;
  let C = null;
  let D = null;
  let E = null;
  let context = null;
  let insertStatement = null;
  let ms = null;
  let versionsTableName = null;

  const m = version => ({
    description: `description-version-${version}`,
    sql: `sql-version-${version}`,
    version,
  });

  const fromArray = array =>
    array.reduce(
      (acc, ea) =>
        acc.concat([ea.sql, [insertStatement, [ea.version, ea.description]]]),
      [],
    );

  beforeEach(() => {
    context = {};

    A = m(0);
    B = m(1);
    C = m(2);
    D = m(3);
    E = m(4);

    ms = [A, B, C, D, E];

    versionsTableName = `versions-table-name-${uuid()}`.replace(/-/g, '_');

    set(context, MIGRATIONS, ms);
    set(context, PLAN, []);
    set(context, VERSIONS_TABLE_NAME, versionsTableName);

    insertStatement = insertVersionsTable(context)({}).shift();
  });

  describe('given a null database version', () => {
    beforeEach(() => {
      set(context, DATABASE_VERSION, null);
    });

    describe('and a requested version', () => {
      beforeEach(() => {
        set(context, REQUESTED_VERSION, 3);
      });

      describe('and a scratched version', () => {
        beforeEach(() => {
          set(context, SCRATCHED_VERSION, 0);
        });

        it('should queue up the migrations after the scratched version, but before the requested version', () =>
          expect(migrations(context))
            .to.have.nested.property(PLAN)
            .and.that.to.deep.equal(fromArray([B, C, D])));
      });

      describe('and no scratched version', () => {
        it('should queue up the migrations before the requested version', () =>
          expect(migrations(context))
            .to.have.nested.property(PLAN)
            .and.that.to.deep.equal(fromArray([A, B, C, D])));
      });
    });

    describe('and no requested version', () => {
      describe('and a scratched version', () => {
        beforeEach(() => {
          set(context, SCRATCHED_VERSION, 1);
        });

        it('should queue up the migrations after the scratched version', () =>
          expect(migrations(context))
            .to.have.nested.property(PLAN)
            .and.that.to.deep.equal(fromArray([C, D, E])));
      });

      describe('and no scratched version', () => {
        it('should queue up all of the migrations', () =>
          expect(migrations(context))
            .to.have.nested.property(PLAN)
            .and.that.to.deep.equal(fromArray([A, B, C, D, E])));
      });
    });
  });

  describe('given a non-null database version', () => {
    beforeEach(() => {
      set(context, DATABASE_VERSION, 1);
    });

    describe('and a requested version', () => {
      beforeEach(() => {
        set(context, REQUESTED_VERSION, 3);
      });

      it('should queue up the migrations after the database version and before the requested version', () =>
        expect(migrations(context))
          .to.have.nested.property(PLAN)
          .and.that.to.deep.equal(fromArray([C, D])));
    });

    describe('and no requested version', () => {
      it('should queue up the migrations after the database version', () =>
        expect(migrations(context))
          .to.have.nested.property(PLAN)
          .and.that.to.deep.equal(fromArray([C, D, E])));
    });
  });
});
