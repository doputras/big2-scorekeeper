# big2-scorekeeper

A scorekeeper for live Big 2 games: per-round point entry for four players, running
cash totals, and a settlement list saying who pays whom. Games are saved in the
browser on the device that played them.

## Scoring modes

- **Classic** — every player settles against every other player on point difference.
- **Top 2 / Bottom 2** — the two lowest point totals are paid by the two highest.
  If 2nd and 3rd place are level, the tied players are treated as sitting on both
  sides of the line equally, so they always receive the same amount.

Points are entered per round, negative meaning points gained. Value per point is a
whole number; the app rejects negatives, which would invert every settlement.

## Storage

State lives in `localStorage` under `big2_session`, so it survives a tab close and a
browser restart. It does **not** sync between devices and is not a backup — the
**Clear** button is the only way to wipe it. iOS Safari may evict it after ~7 days
without a visit unless the page is added to the home screen.

## Develop

```bash
npm install
npm run dev      # vite dev server
npm test         # node --test, covers the cash and settlement maths
npm run build    # production build into dist/
npm run preview  # serve the built output
```

## Deploy

Pushing to `main` runs the tests and publishes `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`. The Vite `base` is `/big2-scorekeeper/`, so it must
match the repository name.
