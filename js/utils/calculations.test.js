import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateTotals,
    calculateCash,
    calculateSettlement,
    getBoundaryTie,
    getWinner
} from './calculations.js';
import { clampSetValue } from './session.js';

const PLAYERS = ['A', 'B', 'C', 'D'];

// What a player nets across every transfer, from their side of the table.
const netFromTransfers = (transactions, player) => transactions.reduce((sum, t) => (
    sum + (t.to === player ? t.amount : 0) - (t.from === player ? t.amount : 0)
), 0);

test('totals sum each player down the rounds', () => {
    const rounds = [{ scores: [3, -9, 4, 2] }, { scores: [-5, 1, 2, 2] }];
    assert.deepEqual(calculateTotals(rounds), [-2, -8, 6, 4]);
    assert.deepEqual(calculateTotals([]), [0, 0, 0, 0]);
});

// The invariant the whole app rests on: money only moves between players, so
// every payout must cancel out. If this breaks, cash appears from nowhere.
test('cash sums to zero in both modes', () => {
    for (const totals of [[5, -3, 0, -2], [0, 0, 0, 0], [12, 12, -8, -16], [-7, 3, 3, 1]]) {
        for (const isRankMode of [false, true]) {
            const cash = calculateCash(totals, isRankMode, 1000);
            assert.equal(cash.reduce((a, b) => a + b, 0), 0, `${totals} rank=${isRankMode}`);
        }
    }
});

test('settlement transfers reproduce every player cash position', () => {
    const cash = calculateCash([5, -3, 0, -2], false, 1000);
    const transactions = calculateSettlement(cash, PLAYERS);

    PLAYERS.forEach((player, i) => {
        assert.equal(netFromTransfers(transactions, player), cash[i], `${player} settles to their cash`);
    });
    assert.ok(transactions.every(t => t.amount > 0), 'no zero-amount transfers');
});

test('settlement is empty when nobody owes anything', () => {
    assert.deepEqual(calculateSettlement([0, 0, 0, 0], PLAYERS), []);
});

// Regression: equal point totals used to pay out differently depending on seat
// order, because the top2/bottom2 sort is stable.
test('boundary tie is detected instead of split by seat order', () => {
    const tie = getBoundaryTie([10, 20, 20, 30], PLAYERS);
    assert.deepEqual(tie, { points: 20, players: ['B', 'C'] });

    assert.deepEqual(getBoundaryTie([0, 0, 0, 0], PLAYERS).players, PLAYERS);
    assert.equal(getBoundaryTie([10, 20, 30, 40], PLAYERS), null);
    // Ties away from the 2nd/3rd line never make the split ambiguous.
    assert.equal(getBoundaryTie([10, 10, 30, 40], PLAYERS), null);
    assert.equal(getBoundaryTie([10, 20, 40, 40], PLAYERS), null);
});

// Regression: a negative value per point paid the worst player and produced -0.
test('setValue rejects negatives, decimals and junk', () => {
    assert.equal(clampSetValue(1000), 1000);
    assert.equal(clampSetValue('2500'), 2500);
    assert.equal(clampSetValue(-5), 0);
    assert.equal(clampSetValue('-5'), 0);
    assert.equal(clampSetValue(10.9), 10);
    assert.equal(clampSetValue(''), 0);
    assert.equal(clampSetValue('abc'), 0);
    assert.equal(clampSetValue(Infinity), 0);

    const cash = calculateCash([5, -3, 0, -2], false, clampSetValue(-1000));
    assert.ok(cash.every(v => Object.is(v, 0)), 'a rejected value pays nobody, and never -0');
});

test('winner is the top earner, or nobody when the table is level', () => {
    assert.deepEqual(getWinner({ players: PLAYERS, cash: [3000, -1000, -1000, -1000] }), ['A']);
    assert.deepEqual(getWinner({ players: PLAYERS, cash: [2000, 2000, -2000, -2000] }), ['A', 'B']);
    assert.deepEqual(getWinner({ players: PLAYERS, cash: [0, 0, 0, 0] }), []);
});
