# HANDOFF — World Cup 2026 Bracket + Office Pool

Read this first to continue maintaining the project in a new session. Everything
is committed to git and deployed; nothing is lost between chats.

## What it is
A single-page World Cup 2026 knockout bracket tracker **plus an office prediction
pool** (full-bracket picks, live pot + leaderboard). Built for Octavio's office.

## Links
- **Live site (share this one):** https://joyful-marshmallow-d7ea73.netlify.app/
  - This is on **Netlify** (git-connected, auto-deploys on every push to `main`).
  - The pool backend (live pot/leaderboard) **only works on this Netlify URL.**
- GitHub Pages mirror: https://octaviocolmenares.github.io/worldcup-2026-bracket/
  - Static only — the `/.netlify/functions/*` backend 404s there, so the pool
    leaderboard is empty on Pages. Don't share this one for the pool.
- **Repo:** https://github.com/octaviocolmenares/worldcup-2026-bracket
- **Local path:** `…/98_Personal/WorldCup-Bracket/` (this folder; it's a git repo).

## Files
- `index.html` — the ENTIRE app (HTML + CSS + JS). 99% of edits happen here.
- `netlify/functions/submit.mjs` — POST: upserts one entry (by email) into Netlify Blobs.
- `netlify/functions/entries.mjs` — GET: returns all entries as JSON (filters `__test__` names).
- `package.json` — declares `@netlify/blobs` so Netlify installs it for the functions.
- `netlify.toml` — publish `.`, functions dir `netlify/functions`.
- `UPDATING.md` — how to record results / fill teams.
- `entries.json` — legacy fallback (the live data lives in the backend now, not here).

## How to deploy
Commit + push to `main`; Netlify auto-builds. **The repo has no git identity**, so commit with:
```
git -c user.email="octavio_colmenares@mckinsey.com" -c user.name="octaviocolmenares" commit -m "..."
```
⚠️ **Deploy gotcha:** the function build (npm install) has occasionally **jammed** —
the last good deploy stays live and new pushes don't publish (watch: live page's
`age:` header keeps climbing, your change never appears). It usually clears on a
retry. Nuclear option that always works: `git rm` the functions + `package.json` +
`netlify.toml` and push (deploys instantly as pure static), then `git revert` that
commit to bring the backend back. (Happened once ~1 hr; resolved by the strip+revert.)

## Data model (all in index.html `<script>`)
- `MATCHES` — all 32 knockout matches (ids 73–104) with teams, dates, venues.
- `RESULTS = { <id>: { hs, as, win:'home'|'away', pens? } }` — **the only thing that
  changes as games are played.** Winners propagate automatically. Currently set:
  - `73`: Canada 1–0 South Africa (away)  ·  `76`: Brazil 2–1 Japan (home)
- `BYE_IDS = new Set([73])` — South Africa/Canada is a **bye** (not picked/scored;
  its winner advances automatically and is a pickable option in the R16).
- `POOL` — `entryFee: 10`, `split: [.6,.3,.1]`, `bonus:{potm:10,scorer:10}`,
  `awards:{potm:'',scorer:''}` (← set these to the real winners at tournament end to
  score the bonus picks).
- `LOCK_ISO = '2026-06-29T12:45:00-04:00'`, `LOCK_LABEL` — picks lock time.
- Pool modes: each entry has `mode: 'money'|'fun'`. Two prize pools — **Money bracket**
  (paid only, pot 60/30/10) and **Overall** (everyone, separate prize). Leaderboard
  has an Overall/Money toggle; rows are tap-to-expand to show a player's full bracket.

## How to update results (the routine task)
1. Confirm the score from ≥2 sources (FIFA, ESPN, BBC, Wikipedia).
2. Add a line to `RESULTS` in index.html, e.g. `74: { hs: 2, as: 1, win: 'home' },`.
3. Commit + push (identity flags above). Netlify redeploys; leaderboard re-scores.
- A scheduled task **`wc2026-bracket-daily-update`** runs ~8 AM to do this automatically.

## How to read / edit entries (live backend)
- Read all: `GET https://joyful-marshmallow-d7ea73.netlify.app/.netlify/functions/entries`
- Edit/fix one (upsert by email): `POST …/.netlify/functions/submit` with JSON
  `{name,email,picks,potm,scorer,mode}`. Fetch the entry first, change the one field,
  POST it back whole (e.g. how Alejandra Guzman's scorer was fixed to "Lionel Messi").
- Storage: Netlify Blobs, store `"pool"`, key `"entries"` (one JSON array doc).
  Note: it's read-modify-write, so simultaneous sign-ups can rarely collide — retry edits.

## Current state (as of last session)
- Group stage done; full R32 set. Played: **Canada 1–0 SA**, **Brazil 2–1 Japan**.
- Pool live with **~24 real entries**; picks **locked** (12:45 PM ET, Jun 29).
- Pot/leaderboard update live from the backend.

## Outstanding / TODO
- Add remaining R32 results as they finish (Germany–Paraguay, Netherlands–Morocco on
  Jun 29; then Tue+). Daily agent handles, or do it on request.
- **Bonus-award matching is exact** (`normName`): "Messi" ≠ "Lionel Messi". Before
  scoring the bonus picks, make matching lenient (substring/contains) since people
  typed the same player many ways.
- Octavio still to add his Zelle # and Chile bank details to the Spanish invite email.

## Local preview (optional)
Use the Claude preview tools; sync `index.html` into the scratchpad preview dir to test
before pushing. The preview can't hit the live functions (they 404 locally) — inject
`ENTRIES` and call `renderLeaderboard()` directly to test the leaderboard.
