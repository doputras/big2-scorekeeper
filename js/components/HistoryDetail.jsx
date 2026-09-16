import { BackIcon } from './Icons.jsx';
import { ScoreboardTable } from './ScoreboardTable.jsx';
import { SettlementList } from './SettlementList.jsx';
import { formatValue } from '../utils/format.js';

export const HistoryDetail = ({ viewingGame, onBack }) => {
    if (!viewingGame) return null;

    return (
        <div className="history-detail">
            <button className="back-link" onClick={onBack}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><BackIcon /> Back</span>
            </button>

            <div className="panel">
                <div className="panel-header">
                    <div>
                        <div className="eyebrow" style={{ marginBottom: 5 }}>Archived match</div>
                        <div className="panel-title" style={{ fontSize: 20 }}>Game #{viewingGame.gameNumber}</div>
                        <div className="panel-subtitle">{viewingGame.players.join(' · ')} · finished {viewingGame.finishedAt}</div>
                    </div>
                    <div className="detail-settings">
                        <div className="detail-chip">
                            <span>Mode</span>
                            <strong>{viewingGame.isRankMode ? 'Top 2 / Bottom 2' : 'Classic'}</strong>
                        </div>
                        <div className="detail-chip">
                            <span>Value / point</span>
                            <strong>Rp{formatValue(viewingGame.setValue)}</strong>
                        </div>
                    </div>
                </div>

                <ScoreboardTable
                    roundsData={viewingGame.rounds}
                    totalsData={viewingGame.totals}
                    cashData={viewingGame.cash}
                    playersData={viewingGame.players}
                    readOnly={true}
                />

                <SettlementList settlement={viewingGame.settlement} />
            </div>
        </div>
    );
};
