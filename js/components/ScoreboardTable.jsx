import { EditIcon } from './Icons.jsx';
import { cashClass, pointsClass, signedCash, signedPoints } from '../utils/format.js';

export const ScoreboardTable = ({
    roundsData,
    totalsData,
    cashData,
    playersData,
    editingIndex,
    startEditingRound,
    readOnly
}) => (
    <div className="scoreboard-wrap">
        <table className="score-table">
            <thead>
                <tr>
                    <th className="round-col">Round</th>
                    {playersData.map((p, i) => <th key={i} title={p}>{p}</th>)}
                    {!readOnly && <th className="actions-col" aria-label="Actions"></th>}
                </tr>
            </thead>
            <tbody>
                {roundsData.length === 0 ? (
                    <tr>
                        <td colSpan={playersData.length + (readOnly ? 1 : 2)}>
                            <div className="empty-state" style={{ border: 0 }}>
                                <strong>No rounds yet</strong>
                                Save a round to start scoring.
                            </div>
                        </td>
                    </tr>
                ) : roundsData.map((round, rIndex) => (
                    <tr key={rIndex} className={editingIndex === rIndex ? 'row-editing' : undefined}>
                        <td className="round-col">#{rIndex + 1}</td>
                        {round.scores.map((score, sIndex) => (
                            <td key={sIndex} className={pointsClass(score)}>{signedPoints(score)}</td>
                        ))}
                        {!readOnly && (
                            <td className="actions-col">
                                <div className="actions-cell">
                                    <button className="icon-btn" onClick={() => startEditingRound(rIndex)} title="Edit round" aria-label={`Edit round ${rIndex + 1}`}><EditIcon /></button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="total-row">
                    <td className="round-col">Points</td>
                    {totalsData.map((score, i) => (
                        <td key={i} className={pointsClass(score)}>{signedPoints(score)}</td>
                    ))}
                    {!readOnly && <td className="actions-col"></td>}
                </tr>
                <tr className="cash-row">
                    <td className="round-col">Cash</td>
                    {cashData.map((value, i) => (
                        <td key={i} className={cashClass(value)}>{signedCash(value)}</td>
                    ))}
                    {!readOnly && <td className="actions-col"></td>}
                </tr>
            </tfoot>
        </table>
    </div>
);
