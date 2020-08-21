const { d, expect, tquire, uuid } = deps;
const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { COMMIT, PLAN },
} = require('../../../../src/lib/constants');
const unsetTransaction = require('../../../../src/flow/create-plan/unset-transaction');

const me = __filename;

d(me, () => {
  let commit = null;
  let context = null;

  beforeEach(() => {
    commit = tquire(me);
    context = {};
  });

  describe('given an empty plan', () => {
    beforeEach(() => {
      set(context, PLAN, []);
    });

    it('should not modify the plan', () =>
      expect(commit(context))
        .to.equal(context)
        .and.to.have.nested.property(PLAN)
        .and.that.to.deep.equal([]));
  });

  describe('given a plan with content', () => {
    let aPlanEntry = null;

    beforeEach(() => {
      aPlanEntry = `a-plan-entry-${uuid()}`;

      set(context, PLAN, [aPlanEntry]);
    });

    it('should append to the plan', () => {
      const result = commit(context);
      const plan = get(context, PLAN);

      expect(result)
        .to.equal(context)
        .and.to.have.nested.property(PLAN);

      expect(plan.shift()).to.equal(aPlanEntry);
      expect(plan.shift()).to.equal(COMMIT);
      expect(plan.shift()).to.equal(unsetTransaction);
      expect(plan).to.deep.equal([]);
    });
  });
});
