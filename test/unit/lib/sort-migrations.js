const { d, expect, tquire } = deps;

const me = __filename;

d(me, () => {
  const sortMigrations = tquire(me);

  const v = version => ({ version });

  it('should sort them correctly', () =>
    expect([v(4), v(2), v(3)].sort(sortMigrations)).to.deep.equal([
      v(2),
      v(3),
      v(4),
    ]));

  it('should throw an error if two are the same', () =>
    expect(() => [v(2), v(2)].sort(sortMigrations)).to.throw());
});
