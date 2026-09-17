const STORAGE_KEY = 'big2_session';

// Bumped from 1 when finishedAt became a timestamp instead of a display string.
const SESSION_VERSION = 2;

export const DEFAULT_PLAYERS = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

// The single gate every write to setValue passes through. min="0" on a number
// input is a validity hint, not an input filter -- a negative value per point
// inverts every settlement, so it is rejected here rather than at each field.
export const clampSetValue = (value) => {
    const n = Math.floor(Number(value));
    return Number.isFinite(n) && n > 0 ? n : 0;
};

const defaults = () => ({
    version: SESSION_VERSION,
    gameNumber: 1,
    players: [...DEFAULT_PLAYERS],
    setValue: 1000,
    isRankMode: false,
    rounds: [],
    sessionGames: []
});

const isScoreList = (v) => Array.isArray(v) && v.length === 4 && v.every(Number.isFinite);
const isRoundList = (v) => Array.isArray(v) && v.every(r => r && isScoreList(r.scores));

// A white screen with unreadable data stuck in storage is this app's worst
// failure, and it now survives a browser restart. Anything that does not match
// what the views index into is dropped for a fresh session.
const isValidSession = (s) => Boolean(
    s && s.version === SESSION_VERSION &&
    Number.isFinite(s.gameNumber) &&
    Array.isArray(s.players) && s.players.length === 4 &&
    Number.isFinite(s.setValue) &&
    isRoundList(s.rounds) &&
    Array.isArray(s.sessionGames) && s.sessionGames.every(g =>
        g && isScoreList(g.totals) && isScoreList(g.cash) &&
        Array.isArray(g.players) && g.players.length === 4 &&
        isRoundList(g.rounds) && Array.isArray(g.settlement) &&
        // the React key, and the timestamp that would otherwise print "Invalid Date"
        typeof g.id === 'string' && Number.isFinite(g.finishedAt))
);

export const getInitialSession = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (isValidSession(parsed)) return parsed;
    } catch (e) {
        console.error('Failed to read saved games', e);
    }

    return defaults();
};

export const persistSession = (session) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: SESSION_VERSION,
            ...session
        }));
    } catch (e) {
        console.error('Failed to save games', e);
    }
};

export const clearStoredSession = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear saved games', e);
    }
};
