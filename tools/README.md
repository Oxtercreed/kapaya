# tools — probes for the storefront

Headless-Chromium checks that keep `docs/mockup/index.html` honest. They are the
only way changes were ever validated in this project; run them after every edit
to `build.cjs`.

```bash
bash fetch-chromium.sh         # once per clone: .chromium/chromium + runtime libs (git-ignored)
npm install                    # puppeteer-core + the nss shim
```

The fetch script downloads the npm-hosted Chromium 109 package that matches
the pinned Puppeteer renderer and the checked-in baseline. It uses only
`registry.npmjs.org`, then unpacks the browser, newer NSS libraries and the
SwiftShader runtime into git-ignored derived folders.

| script | what it does |
|---|---|
| `node frames.cjs` | loads the app, clicks through all five screens, writes `/tmp/red/fr-0N-*.png` at 1440×1200, prints `errors: none` |
| `node diff.cjs` | MAE of those shots against `ref/*.png`. After the intentional Shop re-baseline a clean run prints **0.0000 / 2.5178 / 3.2505 / 2.1390 / 2.8836 %**. `--figma` scores the raw JPEG crops in `docs/mockup/red/ref` instead (~0.1 pt higher: JPEG noise) |
| `node mobile.cjs` | 390×844 @2x walk through every route; prints `OVERFLOW` if anything is wider than the viewport |
| `node deep.cjs` | nine interaction assertions — landing/footer/CTA, sort, favourite persistence, live search, nav filter, checkout validation, pay → confirmed, back to shop |

`ref/02-05.png` are lossless fidelity targets from the red frames.
`ref/01-shop.png` was **deliberately re-baselined** to the new hero after the
landing-page divergence, so its default regression score is 0.0000 %. The raw
Figma crop in `docs/mockup/red/ref/01-shop.jpg` still reports the intentional
design difference (~4.89 % with `--figma`). If an unchanged number moves, either
the code changed or the environment did.

`lib.cjs` holds the shared launcher (binary path, `--no-sandbox`,
`LD_LIBRARY_PATH` for the nss shim, `file://` URL, shot directory). Set
`CHROMIUM_PATH` to use a Chromium you already have.

`fetch-chromium.sh` unpacks the same Chromium generation that produced the
baseline scores. Point `CHROMIUM_PATH` at a local binary only when you know its
rendering matches; a different Chrome release can move the MAE numbers.

Not tracked: `.chromium/` (browser and runtime libraries) and `node_modules/`.

`fetch-fonts.sh` is a fallback only — `docs/mockup/.fonts/` is committed, so the
build reproduces byte-for-byte. The npm copy of Inter renders ~0.4 % differently
from the files in the repo; do not substitute it.
