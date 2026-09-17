export const calculateTotals = (rounds) => {
    if (!rounds || rounds.length === 0) return [0, 0, 0, 0];
    return rounds.reduce((acc, round) => (
        acc.map((score, idx) => score + round.scores[idx])
    ), [0, 0, 0, 0]);
};

export const calculateCash = (totals, isRankMode, setValue) => {
    return totals.map((score, i) => {
        let cashMultiplier = 0;
        if (!isRankMode) {
            const totalPointsSum = totals.reduce((sum, val) => sum + val, 0);
            cashMultiplier = totalPointsSum - (totals.length * score);
        } else {
            const rankedPlayers = totals
                .map((val, idx) => ({ val, idx }))
                .sort((a, b) => a.val - b.val);
            const top2 = rankedPlayers.slice(0, 2);
            const bottom2 = rankedPlayers.slice(2, 4);
            const topSum = top2.reduce((sum, p) => sum + p.val, 0);
            const bottomSum = bottom2.reduce((sum, p) => sum + p.val, 0);
            const isTop2 = top2.some(p => p.idx === i);
            cashMultiplier = isTop2 ? bottomSum - (2 * score) : topSum - (2 * score);
        }
        // A negative multiplier times a zero setValue gives -0, which formats as
        // the string "-0" in a money column. Normalise it away at the source.
        const cash = cashMultiplier * setValue;
        return cash === 0 ? 0 : cash;
    });
};

// Rank mode pays the two lowest point totals out of the two highest. When 2nd
// and 3rd place are level there is no non-arbitrary way to draw that line --
// the sort is stable, so seat order would silently decide who collects and who
// pays. Surface it instead and let the table resolve it.
export const getBoundaryTie = (totals, players) => {
    const sorted = [...totals].sort((a, b) => a - b);
    if (sorted[1] !== sorted[2]) return null;
    return {
        points: sorted[1],
        players: players.filter((_, i) => totals[i] === sorted[1])
    };
};

export const calculateSettlement = (cashArray, playersArray) => {
    const debtors = [];
    const creditors = [];

    cashArray.forEach((amount, i) => {
        if (amount < 0) debtors.push({ player: playersArray[i], amount: Math.abs(amount) });
        if (amount > 0) creditors.push({ player: playersArray[i], amount });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transactions = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
        const debtor = debtors[d];
        const creditor = creditors[c];
        const amount = Math.min(debtor.amount, creditor.amount);

        if (amount > 0) {
            transactions.push({ from: debtor.player, to: creditor.player, amount });
        }

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount === 0) d++;
        if (creditor.amount === 0) c++;
    }

    return transactions;
};

export const getWinner = (game) => {
    const maxCash = Math.max(...game.cash);
    // Cash always sums to zero, so a non-positive top earner means everyone is level.
    if (maxCash <= 0) return [];
    return game.players.filter((p, i) => game.cash[i] === maxCash);
};
