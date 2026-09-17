import { getWinner } from '../utils/calculations.js';
import { cashClass, formatTime, signedCash } from '../utils/format.js';
import { SettlementList } from './SettlementList.jsx';

export const GameResult = ({ finishedGame, onStartNextGame, onViewHistory }) => {
    if (!finishedGame) return null;

    const winners = getWinner(finishedGame);

    return (
        <div className="result panel">
            <div className="result-head">
                <div className="result-game">Game #{finishedGame.gameNumber}</div>
                <div className="result-title">Finished</div>
                <div className="result-sub">
                    {finishedGame.players.join(' · ')} · {formatTime(finishedGame.finishedAt)}
                </div>
            </div>

            <div className="result-winner">
                <div className="result-winner-label">Winner</div>
                <div className="result-winner-name">{winners.length ? winners.join(' & ') : 'Tie game'}</div>
            </div>

            <div className="result-scores">
                {finishedGame.players.map((p, i) => (
                    <div className="result-player" key={i}>
                        <div className="result-player-name">{p}</div>
                        <div className={`result-money ${cashClass(finishedGame.cash[i])}`}>
                            {signedCash(finishedGame.cash[i])}
                        </div>
                        <div className="result-points">{finishedGame.totals[i]} pts</div>
                    </div>
                ))}
            </div>

            <SettlementList settlement={finishedGame.settlement} />

            <div className="result-actions">
                <button className="btn btn-primary" onClick={onStartNextGame}>Start next game</button>
                <button className="btn" onClick={onViewHistory}>View history</button>
            </div>
        </div>
    );
};
