# tools: probes for the storefront

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
| `node diff.cjs` | MAE of those shots against `ref/*.png`. All five references were deliberately re-baselined after the iPhone-only and Kapaya-brand changes, and `01-shop.png` was re-baselined again for the left-only hero, so a clean run prints **0.0000 % on all five**. `--figma` scores the original raw Figma JPEG crops and reports the intentional design difference: 6.1999 / 5.7722 / 3.5064 / 2.3351 / 3.1021 % |
| `node mobile.cjs` | 390×844 @2x walk through every route; asserts the dedicated landing footer, compact two-row anchor nav, single-column editorial stacks, uncropped in-flow phones, scaled hero watermark, left-only hero and compact two-column buttonless cards; prints `OVERFLOW` if anything is wider than the viewport |
| `node deep.cjs` | brand identity, left-only hero, no em dash, luxury landing structure (full-bleed sections, intact desktop moment layout, frosted nav, smooth anchors, hero depth, trust icons, footer) and nine interaction assertions: landing/footer/CTA, sort, favourite persistence, live search, nav filter, checkout validation, pay → confirmed, back to shop |

All five `ref/*.png` files are deliberate regression baselines of the current
iPhone-only, Kapaya-branded, left-only-hero design. All five were re-baselined
for the logo, header, footer, promotional and support-copy changes, and
`01-shop.png` was re-baselined again on purpose after the hero cleanup. The
original Figma crops in `docs/mockup/red/ref/*.jpg` remain for `--figma`
divergence checks. If a default number moves above 0.0000 %, either the code
changed or the environment did.

`lib.cjs` holds the shared launcher (binary path, `--no-sandbox`,
`LD_LIBRARY_PATH` for the nss shim, `file://` URL, shot directory). Set
`CHROMIUM_PATH` to use a Chromium you already have.

`fetch-chromium.sh` unpacks the same Chromium generation that produced the
baseline scores. Point `CHROMIUM_PATH` at a local binary only when you know its
rendering matches; a different Chrome release can move the MAE numbers.

Not tracked: `.chromium/` (browser and runtime libraries) and `node_modules/`.

`fetch-fonts.sh` is a fallback only `docs/mockup/.fonts/` is committed, so the
build reproduces byte-for-byte. The npm copy of Inter renders ~0.4 % differently
from the files in the repo; do not substitute it.
