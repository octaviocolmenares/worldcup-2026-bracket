# How to update the bracket

All match data lives in **`index.html`**. There are only two kinds of edit, both near
the top of the `<script>` block. Make the edit, commit, and push — the live site
redeploys automatically.

> ⚠️ Accuracy matters (colleagues rely on this). Confirm every result against at least
> two reliable sources (FIFA.com, ESPN, BBC Sport, Wikipedia) before committing.

---

## 1. Record a knockout result  ← the normal daily edit

Find the `const RESULTS = { … }` block and add **one line per finished match**:

```js
const RESULTS = {
  73: { hs: 2, as: 1, win: 'home' },              // home team won 2–1
  81: { hs: 1, as: 1, win: 'home', pens: '4-2' }, // 1–1, home won 4–2 on penalties
};
```

- `hs` = home goals, `as` = away goals (as shown top→bottom in the card).
- `win` = `'home'` or `'away'` — **required**; it decides who advances.
- `pens` = optional shootout score `'home-away'` for a match decided on penalties.

That's it. The winner automatically propagates into the next round, scores appear in
both the bracket and the schedule, the loser is dimmed, and the champion banner fills
in once the Final (match 104) has a result. **Do not** edit the later-round matchups by
hand — they resolve themselves from `RESULTS`.

Match IDs: Round of 32 = 73–88, Round of 16 = 89–96, Quarterfinals = 97–100,
Semifinals = 101–102, Third place = 103, Final = 104. (Each card shows its `Match NN`.)

---

## 2. Fill in a Round-of-32 team  ← mostly a one-time edit when the group stage ends

Some Round-of-32 slots start as placeholders, e.g.
`away: tbd('3rd · Group C/D/F')` or `home: tbd('Winner · Group I')`.
When the group stage finishes and the official bracket is set, replace the placeholder
with the real team:

```js
// before
{ id:77, round:'R32', …, home: tbd('Winner · Group I'), away: tbd('3rd · Group D/F/G') },
// after (example)
{ id:77, round:'R32', …, home: team('Spain','ES'), away: team('Norway','NO') },
```

`team(name, iso)` — `iso` is the 2-letter country code (lowercase or uppercase fine);
it draws the flag. For long names add a third short label, e.g.
`team('Bosnia and Herzegovina','BA','Bosnia & Herz.')`.

Common ISO-2 codes: Argentina AR, Australia AU, Austria AT, Belgium BE, Brazil BR,
Canada CA, Colombia CO, Croatia HR, Denmark DK, Ecuador EC, Egypt EG, England GB-ENG
(use `GB` if the flag fails), France FR, Germany DE, Ghana GH, Iran IR, Italy IT,
Ivory Coast CI, Japan JP, Mexico MX, Morocco MA, Netherlands NL, Nigeria NG, Norway NO,
Panama PA, Paraguay PY, Peru PE, Portugal PT, Qatar QA, Saudi Arabia SA, Senegal SN,
South Africa ZA, South Korea KR, Spain ES, Switzerland CH, Tunisia TN, Uruguay UY,
USA US, Wales GB-WLS (or GB). For England/Wales/Scotland flag emoji use the subdivision
codes `gb-eng`, `gb-wls`, `gb-sct` if supported, otherwise `gb`.

---

## 3. Commit & deploy

```bash
git add index.html
git commit -m "Results: <short summary, e.g. R16 Mon Jul 6>"
git push origin main
```

GitHub Pages redeploys within ~1 minute. If the repo is connected to Netlify, that link
updates too. (A plain Netlify **Drop** link is a frozen snapshot and must be re-uploaded
manually — prefer the GitHub-connected Netlify site or the Pages link for auto-updates.)

The "current stage" stepper and "next match" banner are driven by today's date in the
browser, so they advance on their own — no edit needed for those.
