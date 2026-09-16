import { formatValue } from '../utils/format.js';

export const SettlementList = ({ settlement }) => (
    <div className="settlement">
        <div className="section-label">Final settlement</div>
        {settlement.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>No payment needed. Everyone is even.</div>
        ) : settlement.map((tx, i) => (
            <div className="settlement-row" key={i}>
                <div className="settlement-from">{tx.from}</div>
                <div className="settlement-arrow">→</div>
                <div className="settlement-to">{tx.to}</div>
                <div className="settlement-amount">Rp{formatValue(tx.amount)}</div>
            </div>
        ))}
    </div>
);
