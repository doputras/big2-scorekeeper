import { EditIcon, TrashIcon } from './Icons.jsx';
import { formatValue } from '../utils/format.js';

export const ScoreboardTable = ({
    roundsData,
    totalsData,
    cashData,
    playersData,
    editingIndex,
    startEditingRound,
    deleteRound,
    readOnly
}) => (
    <div className="scoreboard-wrap">
        <table className="score-table">
            <thead>
                <tr>
                    <th className="round-col">Round</th>
                    {playersData.map((p, i) => <th key={i}>{p}</th>)}
                    {!readOnly && <th aria-label="Actions"></th>}
                </tr>
            </thead>
            <tbody>
                {roundsData.length === 0 ? (
                    <tr>
                        <td colSpan={readOnly ? 5 : 6}>
                            <div className="empty-state" style={{ border: 0 }}>
                                <strong>No rounds yet</strong>
                                Enter the first score on the left.
                            </div>
                        </td>
                    </tr>
                ) : roundsData.map((round, rIndex) => (
                    <tr key={rIndex} style={editingIndex === rIndex ? { background: '#211f1b' } : undefined}>
                        <td className="round-col">#{rIndex + 1}</td>
                        {round.scores.map((score, sIndex) => (
                            <td key={sIndex} className={score < 0 ? 'negative' : score > 0 ? 'positive' : ''}>
                                {score > 0 ? '+' : ''}{score}
                            </td>
                        ))}
                        {!readOnly && (
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                                    <button className="icon-btn" onClick={() => startEditingRound(rIndex)} title="Edit round"><EditIcon /></button>
                                    <button className="icon-btn" onClick={() => deleteRound(rIndex)} title="Delete round"><TrashIcon /></button>
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
                        <td key={i} className={score < 0 ? 'negative' : score > 0 ? 'positive' : ''}>
                            {score > 0 ? '+' : ''}{score}
                        </td>
                    ))}
                    {!readOnly && <td></td>}
                </tr>
                <tr className="cash-row">
                    <td className="round-col">Cash</td>
                    {cashData.map((value, i) => (
                        <td key={i}>{value > 0 ? '+' : ''}{formatValue(value)}</td>
                    ))}
                    {!readOnly && <td></td>}
                </tr>
            </tfoot>
        </table>
    </div>
);
