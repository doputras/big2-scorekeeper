export const formatValue = (num) => new Intl.NumberFormat('en-US').format(num);

export const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Points and cash read opposite ways: +points is a bad round, +cash is money in.
// Keep cash on its own classes so it never inherits the points colours.
export const cashClass = (value) => value > 0 ? 'cash-in' : value < 0 ? 'cash-out' : '';
export const pointsClass = (value) => value < 0 ? 'negative' : value > 0 ? 'positive' : '';

export const signedPoints = (value) => `${value > 0 ? '+' : ''}${value}`;
export const signedCash = (value) => `${value > 0 ? '+' : ''}${formatValue(value)}`;
