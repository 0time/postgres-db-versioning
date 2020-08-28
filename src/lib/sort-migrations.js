const sortMigrations = (a, b) => {
  if (a.version > b.version) {
    return 1;
  } else if (b.version > a.version) {
    return -1;
  } else {
    throw new Error('cannot sort, two versions are the same');
  }
};

module.exports = sortMigrations;
