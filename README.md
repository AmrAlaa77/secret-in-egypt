# The Secret in Egypt

Static, single-page facilitator + participant zoom-out picture challenge. Same mechanic as "Mysterious Pictures Challenge", independent picture set, independent repo/site/QR tokens.

No backend, no database.

## Files
- `index.html` — the whole app (facilitator UI + participant router based on `?v=TOKEN`)
- `qrcode.js` — vendored MIT "qrcode-generator" library (Kazuhiko Arase), generates QR codes fully client-side, no network calls
- `images/*.jpg` — the 31 pictures, filenames are the opaque tokens (same tokens used in participant URLs)
- `mapping.json` — human-readable record of token → sequence position → image file (reference/restoration only; the live app has this baked into `index.html`)
- `tokens.json` — the raw ordered token list (position 1..31)
- `build_index.js` — regenerates `index.html` from `tokens.json`. Re-run with `node build_index.js` after any change.

## How it works
- Facilitator opens the root URL with no query string: `https://AmrAlaa77.github.io/secret-in-egypt/`
- Participant scans a QR code that opens `https://AmrAlaa77.github.io/secret-in-egypt/?v=<token>` — the token is a permanent, opaque, random 8-character id. The page detects `?v=` and renders **only** that one image full-screen on black, nothing else.
- The token → picture mapping is fixed forever in `index.html`. Shuffling only changes which QR *card* appears in which visual slot (and its A/B/C/D label) — never which token points to which picture.
- Selecting "N pictures" always uses positions 1..N, never a random subset. Max is 31 (this picture set's total).

## Redeploying / regenerating
If the GitHub Pages URL ever changes, edit `BASE_URL` in `build_index.js` and run:
```
node build_index.js
```
Do NOT change `tokens.json` unless you intend to invalidate all previously printed/shared QR codes.

## Hosting
Deployed as a static site via GitHub Pages from the repository root. No server, database, or paid service required.
