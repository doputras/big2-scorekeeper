export const calculateTotals = (rounds) => {
    if (!rounds || rounds.length === 0) return [0, 0, 0, 0];
    return rounds.reduce((acc, round) => (
        acc.map((score, idx) => score + round.scores[idx])
    ), [0, 0, 0, 0]);
};

const SEATS = [0, 1, 2, 3];
const TOP_PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

// A player collects the point gap from every opponent they are scored against.
const gapTo = (totals, i, opponents) => opponents.reduce((sum, j) => sum + totals[j] - totals[i], 0);

// Averaged splits can land on a half or a third of a point. Round to whole
// rupiah and give the dropped units to the largest remainders so the table
// still sums to zero. ponytail: an uneven split's odd Rp1 goes to the lowest seat.
const toWholeCash = (raw) => {
    const cash = raw.map(Math.floor);
    const leftover = -cash.reduce((a, b) => a + b, 0);
    raw.map((v, i) => ({ i, rem: v - cash[i] }))
        .sort((a, b) => b.rem - a.rem)
        .slice(0, leftover)
        .forEach(({ i }) => cash[i]++);
    // Math.floor(-0) is -0, which formats as "-0" in a money column.
    return cash.map(v => v === 0 ? 0 : v);
};

// Classic scores everyone against everyone. Top 2 / Bottom 2 scores the two
// lowest totals against the two highest only. Every top 2 where nobody outscores
// anybody below the line is a legal split: without a tie on the 2nd/3rd line
// there is exactly one, with a tie the tied players take turns on each side.
// Averaging over the splits pays tied players the same, instead of letting the
// stable sort's seat order pick who collects and who pays.
export const calculateCash = (totals, isRankMode, setValue) => {
    const splits = isRankMode
        ? TOP_PAIRS.filter(top => SEATS.every(j => top.includes(j) || top.every(i => totals[i] <= totals[j])))
        : [SEATS];
    const opponentsOf = (i, top) => (
        !isRankMode ? SEATS : top.includes(i) ? SEATS.filter(j => !top.includes(j)) : top
    );
    // Multiply before dividing so an exact result stays an exact integer.
    return toWholeCash(SEATS.map(i => (
        splits.reduce((sum, top) => sum + gapTo(totals, i, opponentsOf(i, top)), 0) * setValue / splits.length
    )));
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
