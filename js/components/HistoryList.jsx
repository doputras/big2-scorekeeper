import { getWinner } from '../utils/calculations.js';
import { formatTime, formatValue } from '../utils/format.js';
import { EyeIcon } from './Icons.jsx';

export const HistoryList = ({ sessionGames, onViewGame }) => (
    <>
        <div className="page-heading">
            <div>
                <div className="eyebrow">Saved on this device</div>
                <h1 className="page-title">Game history</h1>
                <p className="page-note">Each match keeps its own lineup, rules, and result.</p>
            </div>
            <div className="heading-stat">
                <div className="eyebrow">Played</div>
                <div className="heading-stat-value">{sessionGames.length}</div>
            </div>
        </div>

        {sessionGames.length === 0 ? (
            <div className="empty-state">
                <strong>No finished games</strong>
                Finish a game and it will be saved here.
            </div>
        ) : (
            <div className="history-grid">
                {sessionGames.slice().reverse().map(game => {
                    const winners = getWinner(game);
                    return (
                        <div className="history-card" key={game.id}>
                            <div className="history-top">
                                <div className="game-number">Game #{game.gameNumber}</div>
                                <div className="history-time">{formatTime(game.finishedAt)}</div>
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
                            <button className="btn btn-icon" onClick={() => onViewGame(game)}>
                                <EyeIcon /> View details
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
    </>
);
