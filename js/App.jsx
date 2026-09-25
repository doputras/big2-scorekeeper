import { useState, useEffect, useMemo } from 'react';
import { calculateTotals, calculateCash, calculateSettlement } from './utils/calculations.js';
import { clampSetValue, DEFAULT_PLAYERS, getInitialSession, persistSession } from './utils/session.js';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { CurrentGame } from './components/CurrentGame.jsx';
import { GameResult } from './components/GameResult.jsx';
import { HistoryList } from './components/HistoryList.jsx';
import { HistoryDetail } from './components/HistoryDetail.jsx';

export const App = () => {
    const init = useMemo(() => getInitialSession(), []);
    const [activeView, setActiveView] = useState('current');
    const [viewingGame, setViewingGame] = useState(null);
    const [finishedGame, setFinishedGame] = useState(null);

    const [sessionGames, setSessionGames] = useState(init.sessionGames || []);
    const [gameNumber, setGameNumber] = useState(init.gameNumber || 1);
    const [players, setPlayers] = useState(init.players || [...DEFAULT_PLAYERS]);
    const [setValue, setSetValue] = useState(init.setValue ?? 1000);
    const [isRankMode, setIsRankMode] = useState(!!init.isRankMode);
    const [rounds, setRounds] = useState(init.rounds || []);
    const [inputs, setInputs] = useState(['', '', '', '']);
    const [editingIndex, setEditingIndex] = useState(null);

    const [errorMsg, setErrorMsg] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, message: '', confirmText: 'Confirm', style: 'red' });
    const [settingsModal, setSettingsModal] = useState({ isOpen: false, tempMode: false, tempValue: 1000 });

    useEffect(() => {
        persistSession({ gameNumber, players, setValue, isRankMode, rounds, sessionGames });
    }, [gameNumber, players, setValue, isRankMode, rounds, sessionGames]);

    useEffect(() => {
        if (!errorMsg) return;
        const timer = setTimeout(() => setErrorMsg(''), 3500);
        return () => clearTimeout(timer);
    }, [errorMsg]);

    const currentTotals = useMemo(() => calculateTotals(rounds), [rounds]);
    const currentCash = useMemo(() => calculateCash(currentTotals, isRankMode, setValue), [currentTotals, isRankMode, setValue]);
    const currentSettlement = useMemo(() => calculateSettlement(currentCash, players), [currentCash, players]);

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setInputs(['', '', '', '']);
    };

    const handleSaveOrUpdateRound = () => {
        const parsed = inputs.map(v => v === '' ? 0 : Number(v));
        if (parsed.some(v => !Number.isInteger(v))) {
            setErrorMsg('Enter whole numbers for all four players.');
            return;
        }

        if (editingIndex !== null) {
            const next = [...rounds];
            next[editingIndex] = { scores: parsed };
            setRounds(next);
            setEditingIndex(null);
        } else {
            setRounds([...rounds, { scores: parsed }]);
        }
        setInputs(['', '', '', '']);
    };

    const startEditingRound = (index) => {
        setEditingIndex(index);
        setInputs(rounds[index].scores.map(v => v === 0 ? '' : String(v)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const undoLastRound = () => {
        if (!rounds.length) return;
        setConfirmDialog({
            isOpen: true, style: 'yellow',
            message: 'Undo the latest round? This removes that round from the current game.',
            confirmText: 'Undo Round',
            action: () => {
                setRounds(rounds.slice(0, -1));
                setConfirmDialog({ isOpen: false, action: null, message: '' });
            }
        });
    };

    const clearCurrentRounds = () => {
        setConfirmDialog({
            isOpen: true, style: 'red',
            message: 'Clear every round in the current game? Player names and game settings will stay.',
            confirmText: 'Clear Rounds',
            action: () => {
                setRounds([]);
                setInputs(['', '', '', '']);
                setEditingIndex(null);
                setConfirmDialog({ isOpen: false, action: null, message: '' });
            }
        });
    };

    const finishCurrentGame = () => {
        if (!rounds.length) {
            setErrorMsg('Cannot finish a game with no rounds.');
            return;
        }
        if (editingIndex !== null) {
            setErrorMsg('Save or cancel the round edit before finishing.');
            return;
        }

        setConfirmDialog({
            isOpen: true, style: 'gold',
            message: 'Finish this game and save the result to history?',
            confirmText: 'Finish Game',
            action: () => {
                const completedGame = {
                    id: crypto.randomUUID(),
                    gameNumber,
                    players: [...players],
                    setValue,
                    isRankMode,
                    rounds: rounds.map(r => ({ scores: [...r.scores] })),
                    totals: [...currentTotals],
                    cash: [...currentCash],
                    settlement: [...currentSettlement],
                    finishedAt: Date.now()
                };

                setSessionGames(prev => [...prev, completedGame]);
                setFinishedGame(completedGame);
                // Counted here, not in startNextGame: leaving the result screen through
                // View history used to skip it and reuse the number on the next game.
                setGameNumber(prev => prev + 1);
                setRounds([]);
                setInputs(['', '', '', '']);
                setEditingIndex(null);
                setActiveView('game_result');
                setConfirmDialog({ isOpen: false, action: null, message: '' });
            }
        });
    };

    const startNextGame = () => {
        setRounds([]);
        setInputs(['', '', '', '']);
        setEditingIndex(null);
        setFinishedGame(null);
        setActiveView('current');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // The persist effect rewrites storage right after this, so resetting state to
    // the defaults is what actually clears the saved games.
    const clearSession = () => {
        setConfirmDialog({
            isOpen: true, style: 'red',
            message: 'Clear the current game and every game saved on this device?',
            confirmText: 'Clear All',
            action: () => {
                setGameNumber(1);
                setPlayers([...DEFAULT_PLAYERS]);
                setSetValue(1000);
                setIsRankMode(false);
                setRounds([]);
                setSessionGames([]);
                setViewingGame(null);
                setFinishedGame(null);
                setActiveView('current');
                setInputs(['', '', '', '']);
                setEditingIndex(null);
                setConfirmDialog({ isOpen: false, action: null, message: '' });
            }
        });
    };

    const applyGameSettings = () => {
        setIsRankMode(settingsModal.tempMode);
        setSetValue(clampSetValue(settingsModal.tempValue));
        setSettingsModal({ isOpen: false, tempMode: false, tempValue: 0 });
    };

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="container topbar-inner">
                    <div className="brand">
                        <div className="brand-mark">2+</div>
                        <div>
                            <div className="brand-title">Big 2 Tracker</div>
                            <div className="brand-subtitle">A simple scorekeeper for live games</div>
                        </div>
                    </div>

                    <div className="topbar-actions">
                        {activeView !== 'game_result' && (
                            <nav className="nav-tabs" aria-label="Views">
                                <button
                                    className={`nav-tab ${activeView === 'current' ? 'active' : ''}`}
                                    onClick={() => { setActiveView('current'); setViewingGame(null); }}
                                >
                                    Current
                                </button>
                                <button
                                    className={`nav-tab ${activeView === 'history_list' || activeView === 'history_detail' ? 'active' : ''}`}
                                    onClick={() => { setActiveView('history_list'); setViewingGame(null); }}
                                >
                                    History {sessionGames.length ? `(${sessionGames.length})` : ''}
                                </button>
                            </nav>
                        )}
                        <button className="btn btn-quiet" onClick={clearSession} title="Clear all saved games">Clear</button>
                    </div>
                </div>
            </header>

            {/* The tab bar is hidden on the result screen, so stop reserving its height. */}
            <main className={`container page ${activeView === 'game_result' ? 'no-tabs' : ''}`}>
                {activeView === 'current' && (
                    <CurrentGame
                        gameNumber={gameNumber}
                        players={players}
                        setPlayers={setPlayers}
                        setValue={setValue}
                        setSetValue={setSetValue}
                        isRankMode={isRankMode}
                        setIsRankMode={setIsRankMode}
                        rounds={rounds}
                        inputs={inputs}
                        setInputs={setInputs}
                        editingIndex={editingIndex}
                        currentTotals={currentTotals}
                        currentCash={currentCash}
                        currentSettlement={currentSettlement}
                        onSaveOrUpdateRound={handleSaveOrUpdateRound}
                        onCancelEdit={handleCancelEdit}
                        startEditingRound={startEditingRound}
                        onUndoLastRound={undoLastRound}
                        onClearCurrentRounds={clearCurrentRounds}
                        onFinishCurrentGame={finishCurrentGame}
                        onOpenSettingsModal={() => setSettingsModal({ isOpen: true, tempMode: isRankMode, tempValue: setValue })}
                    />
                )}
                {activeView === 'game_result' && (
                    <GameResult
                        finishedGame={finishedGame}
                        onStartNextGame={startNextGame}
                        onViewHistory={() => { setFinishedGame(null); setActiveView('history_list'); }}
                    />
                )}
                {activeView === 'history_list' && (
                    <HistoryList
                        sessionGames={sessionGames}
                        onViewGame={(game) => { setViewingGame(game); setActiveView('history_detail'); }}
                    />
                )}
                {activeView === 'history_detail' && (
                    <HistoryDetail
                        viewingGame={viewingGame}
                        onBack={() => { setViewingGame(null); setActiveView('history_list'); }}
                    />
                )}
            </main>

            {errorMsg && <div className="toast" role="alert">{errorMsg}</div>}

            <SettingsModal
                settingsModal={settingsModal}
                setSettingsModal={setSettingsModal}
                onApply={applyGameSettings}
            />

            <ConfirmDialog
                confirmDialog={confirmDialog}
                onCancel={() => setConfirmDialog({ isOpen: false, action: null, message: '' })}
            />
        </div>
    );
};
