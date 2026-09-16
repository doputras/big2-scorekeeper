export const STORAGE_KEY = 'big2_session';

export const DEFAULT_PLAYERS = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

export const getInitialSession = () => {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.version === 1) return parsed;
        }
    } catch (e) {
        console.error('Failed to parse session storage', e);
    }

    return {
        version: 1,
        gameNumber: 1,
        players: [...DEFAULT_PLAYERS],
        setValue: 1000,
        isRankMode: false,
        rounds: [],
        sessionGames: []
    };
};

export const persistSession = (session) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: 1,
            ...session
        }));
    } catch (e) {
        console.error('Failed to persist session', e);
    }
};
