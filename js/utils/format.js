export const formatValue = (num) => new Intl.NumberFormat('en-US').format(num);

// Points and cash read opposite ways: +points is a bad round, +cash is money in.
// Keep cash on its own classes so it never inherits the points colours.
export const cashClass = (value) => value > 0 ? 'cash-in' : value < 0 ? 'cash-out' : '';
