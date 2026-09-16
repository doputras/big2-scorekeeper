import { getWinner } from '../utils/calculations.js';
import { formatValue } from '../utils/format.js';
import { EyeIcon } from './Icons.jsx';

export const HistoryList = ({ sessionGames, onViewGame }) => (
    <>
        <div className="page-heading">
            <div>
                <div className="eyebrow">This browser session</div>
                <h1 className="page-title">Game history</h1>
                <p className="page-note">Each match keeps its own lineup, rules, and result.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Played</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{sessionGames.length}</div>
            </div>
        </div>

        {sessionGames.length === 0 ? (
            <div className="empty-state">
                <strong>No finished games</strong>
                Finish a game and it will appear here for this session.
            </div>
        ) : (
            <div className="history-grid">
                {sessionGames.slice().reverse().map(game => {
                    const winners = getWinner(game);
                    return (
                        <div className="history-card" key={game.id}>
                            <div className="history-top">
                                <div className="game-number">Game #{game.gameNumber}</div>
                                <div className="history-time">{game.finishedAt}</div>
                            </div>
                            <div className="lineup">{game.players.join(' · ')}</div>
                            <div className="history-meta">
                                <div className="meta-item"><span>Rounds</span><strong>{game.rounds.length}</strong></div>
                                <div className="meta-item"><span>Value</span><strong>Rp{formatValue(game.setValue)}</strong></div>
                                <div className="meta-item"><span>Mode</span><strong>{game.isRankMode ? 'Top 2 / Bottom 2' : 'Classic'}</strong></div>
                                <div className="meta-item"><span>Transfers</span><strong>{game.settlement.length}</strong></div>
                            </div>
                            <div className="winner-row">
                                <small>Winner</small>
                                <strong>{winners.length ? winners.join(' & ') : 'Tie game'}</strong>
                            </div>
                            <button className="btn" style={{ width: '100%' }} onClick={() => onViewGame(game)}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><EyeIcon /> View details</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
    </>
);
