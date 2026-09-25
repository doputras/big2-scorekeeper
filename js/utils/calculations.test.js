import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateTotals,
    calculateCash,
    calculateSettlement,
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
    for (const totals of [[5, -3, 0, -2], [0, 0, 0, 0], [12, 12, -8, -16], [-7, 3, 3, 1], [10, 20, 20, 31], [20, 20, 20, 30]]) {
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

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

test('rank mode without a tie pays the two lowest from the two highest', () => {
    // B(-3) and D(-2) are top 2, C(0) and A(5) bottom 2; each side vs the other.
    assert.deepEqual(calculateCash([5, -3, 0, -2], true, 1000), [-15000, 11000, -5000, 9000]);
});

// Regression: 2nd and 3rd level on points used to be split by seat order, one
// collecting and the other paying the same amount.
test('players tied across the top 2 / bottom 2 line get the same cash', () => {
    assert.deepEqual(calculateCash([10, 20, 20, 30], true, 1000), [30000, 0, 0, -30000]);
    // Seat order must not matter: same totals, tied players in other seats.
    assert.deepEqual(calculateCash([20, 30, 10, 20], true, 1000), [0, -30000, 30000, 0]);

    // Uneven gap on each side: the tied pair share it, and it still sums to zero.
    const halves = calculateCash([10, 20, 20, 31], true, 1000);
    assert.deepEqual(halves, [31000, 500, 500, -32000]);

    // Three-way ties spanning the line land on thirds of a point.
    for (const totals of [[10, 20, 20, 20], [20, 20, 20, 30]]) {
        const cash = calculateCash(totals, true, 1000);
        assert.equal(sum(cash), 0, `${totals}`);
        assert.ok(cash.every(Number.isInteger), `${totals} pays whole rupiah`);
        const tied = cash.filter((_, i) => totals[i] === 20);
        assert.ok(Math.max(...tied) - Math.min(...tied) <= 1, `${totals} tied players within Rp1`);
    }
});

test('rank cash follows the player, whatever seat they sit in', () => {
    const totals = [7, 7, -4, 12];
    const base = calculateCash(totals, true, 1000);
    for (const order of [[1, 0, 2, 3], [3, 2, 1, 0], [2, 3, 0, 1]]) {
        const cash = calculateCash(order.map(i => totals[i]), true, 1000);
        assert.deepEqual(cash, order.map(i => base[i]), `${order}`);
    }
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
