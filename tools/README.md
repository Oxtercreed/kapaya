# tools — probes for the storefront

Headless-Chromium checks that keep `docs/mockup/index.html` honest. They are the
only way changes were ever validated in this project; run them after every edit
to `build.cjs`.

```bash
bash fetch-chromium.sh         # once per clone: .chromium/chromium (150 MB, git-ignored)
npm install                    # puppeteer-core + the nss shim
```

| script | what it does |
|---|---|
| `node frames.cjs` | loads the app, clicks through all five screens, writes `/tmp/red/fr-0N-*.png` at 1440×1200, prints `errors: none` |
| `node diff.cjs` | MAE of those shots against `ref/*.png`. A clean run prints **2.5169 / 2.5178 / 3.2505 / 2.1390 / 2.8836 %**. `--figma` scores the raw JPEG crops in `docs/mockup/red/ref` instead (~0.1 pt higher: JPEG noise) |
| `node mobile.cjs` | 390×844 @2x walk through every route; prints `OVERFLOW` if anything is wider than the viewport |
| `node deep.cjs` | seven interaction assertions — sort, favourite persistence, live search, nav filter, checkout validation, pay → confirmed, back to shop |

`ref/*.png` are lossless captures of the render behind the numbers in
`docs/mockup/NOTES-red.md`. They are a **regression** baseline: if a number
moves, either the code changed or the environment did. They are not a design
target — the design target is `docs/mockup/red/ref/*.jpg`.

`lib.cjs` holds the shared launcher (binary path, `--no-sandbox`,
`LD_LIBRARY_PATH` for the nss shim, `file://` URL, shot directory). Set
`CHROMIUM_PATH` to use a Chromium you already have.

`fetch-chromium.sh` prints the Chrome-for-Testing URL rather than downloading
it, because the sandbox only reaches a small allowlist; run the two commands it
prints, or point `CHROMIUM_PATH` at an existing binary.

Not tracked: `.chromium/` (150 MB binary) and `node_modules/`.

`fetch-fonts.sh` is a fallback only — `docs/mockup/.fonts/` is committed, so the
build reproduces byte-for-byte. The npm copy of Inter renders ~0.4 % differently
from the files in the repo; do not substitute it.
