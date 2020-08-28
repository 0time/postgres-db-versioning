const { get } = require('@0ti.me/tiny-pfp');

// A filter callback function implementation
module.exports = (low, high, opts = {}) => input => {
  const inclusiveLow = get(opts, 'inclusiveLow', false);
  const inclusiveHigh = get(opts, 'inclusiveHigh', false);
  const valueSelector = get(opts, 'valueSelector', false);

  const value = valueSelector ? get(input, valueSelector) : input;

  if (low !== null && (inclusiveLow ? value < low : value <= low)) {
    return false;
  }

  if (high !== null && (inclusiveHigh ? value > high : value >= high)) {
    return false;
  }

  return true;
};
