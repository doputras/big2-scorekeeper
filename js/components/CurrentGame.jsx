import { CheckIcon, ResetIcon, UndoIcon } from './Icons.jsx';
import { ScoreboardTable } from './ScoreboardTable.jsx';
import { formatValue } from '../utils/format.js';

export const CurrentGame = ({
    gameNumber,
    players,
    setPlayers,
    setValue,
    setSetValue,
    isRankMode,
    setIsRankMode,
    rounds,
    inputs,
    setInputs,
    editingIndex,
    currentTotals,
    currentCash,
    currentSettlement,
    onSaveOrUpdateRound,
    onCancelEdit,
    startEditingRound,
    onUndoLastRound,
    onClearCurrentRounds,
    onFinishCurrentGame,
    onOpenSettingsModal
}) => (
    <>
        <div className="page-heading">
            <div>
                <div className="eyebrow">Live game</div>
                <h1 className="page-title">Game #{gameNumber}</h1>
                <p className="page-note">{players.join(' · ')}</p>
            </div>
            <div className="heading-stat">
                <div className="eyebrow">Rounds</div>
                <div className="heading-stat-value">{rounds.length}</div>
            </div>
        </div>

        <div className="game-grid">
            <div className="panel entry-panel">
                <div className="panel-header">
                    <div>
                        <div className="panel-title">{editingIndex !== null ? `Edit round #${editingIndex + 1}` : 'Enter round'}</div>
                        <div className="panel-subtitle">Negative = points gained</div>
                    </div>
                    {editingIndex !== null && (
                        <button className="btn btn-quiet" onClick={onCancelEdit}>Cancel</button>
                    )}
                </div>

                <div className="settings-strip">
                    <div className="settings-heading">Game settings</div>

                    {rounds.length === 0 ? (
                        <>
                            <div className="field">
                                <div className="field-label">Scoring mode</div>
                                <div className="segmented">
                                    <button className={!isRankMode ? 'active' : ''} onClick={() => setIsRankMode(false)}>Classic</button>
                                    <button className={isRankMode ? 'active' : ''} onClick={() => setIsRankMode(true)}>Top 2 / Bottom 2</button>
                                </div>
                            </div>
                            <div className="field">
                                <div className="field-label">Value per point</div>
                                <input className="number-input" type="number" min="0" inputMode="numeric" value={setValue} onChange={e => setSetValue(Number(e.target.value))} />
                            </div>
                        </>
                    ) : (
                        <div className="settings-current">
                            <div>
                                <div className="settings-current-mode">{isRankMode ? 'Top 2 / Bottom 2' : 'Classic'}</div>
                                <div className="settings-current-note">Rp{formatValue(setValue)} per point</div>
                            </div>
                            <button className="btn" onClick={onOpenSettingsModal}>Edit settings</button>
                        </div>
                    )}
                </div>

                <div className="players">
                    {players.map((player, idx) => (
                        <div className="player-block" key={idx}>
                            <input
                                className="player-name"
                                value={player}
                                onChange={e => setPlayers(prev => prev.map((p, i) => i === idx ? e.target.value : p))}
                                disabled={editingIndex !== null}
                                placeholder={`Player ${idx + 1}`}
                            />
                            <div className="score-entry">
                                <div className="field-label">Points</div>
                                <input
                                    className="number-input"
                                    type="number"
                                    value={inputs[idx]}
                                    onChange={e => setInputs(prev => prev.map((v, i) => i === idx ? e.target.value : v))}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="actions">
                    <button className="btn btn-primary" onClick={onSaveOrUpdateRound}>
                        {editingIndex !== null ? 'Update round' : 'Save round'}
                    </button>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <div className="panel-title">Scoreboard</div>
                        <div className="panel-subtitle">{isRankMode ? 'Top 2 vs Bottom 2' : 'Classic'} · Rp{formatValue(setValue)} / point</div>
                    </div>
                    <div className="panel-header-actions">
                        <button className="btn btn-icon" onClick={onUndoLastRound} disabled={!rounds.length || editingIndex !== null}><UndoIcon /> Undo</button>
                        <button className="btn btn-icon" onClick={onClearCurrentRounds} disabled={!rounds.length}><ResetIcon /> Clear</button>
                    </div>
                </div>

                <ScoreboardTable
                    roundsData={rounds}
                    totalsData={currentTotals}
                    cashData={currentCash}
                    playersData={players}
                    editingIndex={editingIndex}
                    startEditingRound={startEditingRound}
                    readOnly={false}
                />

                <div className="score-footer">
                    <span>Cash shown is the net result for the current game.</span>
                    <span>{rounds.length ? `${currentSettlement.length} settlement transfer${currentSettlement.length === 1 ? '' : 's'}` : 'No settlement yet'}</span>
                </div>

                <div className="panel-foot">
                    <button className="finish-btn" onClick={onFinishCurrentGame}>
                        <CheckIcon /> Finish game
                    </button>
                </div>
            </div>
        </div>
    </>
);
