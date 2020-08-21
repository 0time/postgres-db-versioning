const { set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { DATABASE_VERSION, PLAN, SCRATCH },
} = require('../../../../src/lib/constants');

const { d, expect, tquire, uuid } = deps;

const me = __filename;

d(me, () => {
  const scratch = (...args) => tquire(me)(...args);
  let context = null;

  beforeEach(() => {
    context = {};
    set(context, PLAN, []);
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
          .and.that.deep.equals([aScratchStep, bScratchStep]));
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
