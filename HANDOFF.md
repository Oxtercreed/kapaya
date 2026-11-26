# HANDOFF — VOLTA storefront mockup

Everything a fresh session needs: what the project is, what has been built, the
rules that broke us, and what to do next (including the request that was in
flight when this session ended).

Read this top to bottom once, then work from the repo — the repo is the source
of truth, this file is the map.

---

## 1. What this project is

A clickable **VOLTA** storefront mockup — *good tech, better everyday* — shipped
as **one self-contained HTML file** with no build step at runtime, no network
and no external assets. All CSS, JS, Inter (base64 woff2) and all photography
(base64 JPEG) live inside `docs/mockup/index.html`.

| Path | What it is |
|---|---|
| `docs/mockup/index.html` | **The deliverable.** ~300 KB, generated — never hand-edit |
| `docs/mockup/build.cjs` | The generator: `PRODUCTS`, `PICS`, `CSS`, the eight `view` functions, `RUNTIME`, `SHELL` |
| `docs/mockup/NOTES-red.md` | The measurements the design came from: frame ids, palette, grid, type scale, fidelity table |
| `docs/mockup/red/ref/*.jpg` | 1:1 crops of the five Figma frames (source of truth for the design) |
| `docs/mockup/red/img/*.jpg` | The product photography cropped out of the Figma render (what the app inlines) |
| `docs/mockup/red/next/` | **New** design references, not yet implemented (see §7) |
| `tools/` | The headless-Chromium probes: `frames.cjs`, `mobile.cjs`, `deep.cjs`, `diff.cjs` |
| `tools/ref/*.png` | Lossless PNG of the render that scored the baseline. `node tools/diff.cjs` must print these numbers back |
| `figma-plugin/` | A Figma dev plugin (nine phone screens as arranged frames). Untouched, unrelated to the storefront build |
| `README.md` | The public-facing project page |

Figma source: `zoygvtfjWN92VUiWAsSMOL`, page 1, second row. Screens: Shop
`8:2`, Product `8:92`, Bag `8:161`, Checkout `8:240`, Confirmed `8:342` —
all 1440×1200, at y = 967, x = 751 / 2231 / 3711 / 5191 / 6671.

## 2. Rebuild + verify (do this every time you touch anything)

```bash
node docs/mockup/build.cjs        # writes docs/mockup/index.html
bash tools/fetch-chromium.sh      # once per clone: npm-hosted Chromium 109 + runtime libs
cd tools && npm install           # once per clone
```

`docs/mockup/.fonts/*.woff2` (100 KB) **is tracked** — a fresh clone rebuilds
`index.html` byte-for-byte. Do not swap in a different Inter release: the npm
`@fontsource/inter` copy renders ~0.4 % differently and moves every number.
`tools/fetch-fonts.sh` only exists as a last resort.

```bash
cd tools
node frames.cjs                   # shoots the five screens -> /tmp/red/fr-0N-*.png, prints "errors: none"
node diff.cjs                     # MUST print 0.0000 / 0.0000 / 0.0000 / 0.0000 / 0.0000 %
node mobile.cjs                   # 390×844 @2x: no OVERFLOW lines, "errors: none"
node deep.cjs                     # 9 assertions (see §5)
```

`diff.cjs --figma` scores against the original raw Figma JPEG crops. After the
iPhone-only divergence it reports **6.2864 / 5.7210 / 3.4435 / 2.2825 /
3.0409 %**; JPEG luminance noise adds roughly 0.1 pt. **Use the default mode**
for regression: all five `tools/ref/*.png` files were re-baselined on purpose to
the intentional new design, so a clean run is all zeros. The Figma-era numbers
in §4 are historical.

`tools/fetch-chromium.sh` now fetches the npm-hosted Chromium 109 build that
reproduces the baseline on the sandbox's npm-only allowlist; it also unpacks
the matching NSS/SwiftShader runtime. Any other Chrome/Chromium can be used via
`CHROMIUM_PATH=/path/to/chrome node frames.cjs`, but a different renderer may
move the MAE numbers. Puppeteer is only ever launched with `--no-sandbox`,
`--disable-dev-shm-usage`, `--font-render-hinting=none`, and an
`LD_LIBRARY_PATH` containing the Chromium and `@achingbrain/nss` libraries.

## 3. The design system (already exact — do not re-derive)

**Palette:** field `#FAF9F9` · white · ink `#14171E` · body `#656976` · hairline
`#E8E6E7` · border `#DCDCDD` · accent `#C92332` · accentInk `#96151F` · hero
tint `#FCE6E9` · bar/delivery/confirmed hero/ship-note `#FDECEE` · strip/support
`#FAEDEF` · search `#F5F3F3` · tile `#F3F3F3` · mint `#D8F2E7` · green
`#2F7A52` · muted `#7A7E88`.

**Grid:** 28 px announcement band + 93 px header (hairline at y121) · 64 px page
margins · 1312 px content · footer 108 px · shop cards 304×326 on 32 px gutters
4-up · bag/checkout/confirmed split **824 + 32 + 456** · radii 28 hero / 22
panels / 18 cards / 12 inputs. Breakpoints ≤1120 (3-up) · ≤960 (hero stacks,
splits 1-col) · ≤640 (2-row header, chips wrap).

**Type:** Inter throughout, **no positive tracking**, wordmark 28/700, hero
48/600 over 58, page titles 40/600 over 48 (confirmed headline 36/600), section
heads 28/600, summary heads 24/600, nav 15/400, micro labels 11–11.5/500.

**Products (4, and only 4 iPhones):** iPhone 16 Pro $1099 ★4.9·128
"Latest generation" (Pro) · iPhone 15 $799 ★4.8·96 "Clean blue finish"
(Standard) · iPhone 14 Pro $899 ★4.8·182 "Pro camera" (Pro) · iPhone 13
$599 ★4.9·120 "Best value" (Classic). Clean transparent WebP cut-outs are
inlined from `docs/mockup/assets/`; no Figma plate crops are used in the store.
Address Kepler Street 14 / 3011 AA Rotterdam / Netherlands,
`alex.morgan@example.com`, support `support@volta.example`. Promo `VOLTA10`
= 10 %.

**State:** `localStorage['volta.state'] = {cart, favs, orders, form}`;
prefilled card `•••• •••• •••• 4242`, exp `08 / 29`, cvc `•••`. Seed order
`VX-47102` (OCT 14 2026, Delivered, iPhone 15, $799); a new checkout makes
`VX-(88217+n)`, `NOV 26, 2026`.

**Frame copy still used:** "Good tech. Better everyday." / "Free shipping on
orders $100+" / "A little more to love" / "Thanks, Alex. You're all set." /
"Good support comes with every order." The frames' catalogue copy — including
"LESS NOISE. MORE YOU.", "Your everyday, upgraded." and "Find your next
everyday essential" — is **no longer binding**; the landing and iPhone-only
copy deliberately replaces it. See §7a.

## 4. Fidelity, where it stands

Historical Figma-era baseline, before the deliberate divergence:

| screen | MAE | residual |
|---|---|---|
| Shop | 2.5169 % | card plates (see below) + glyph AA |
| Product | 2.5178 % | glyph AA |
| Bag | 3.2505 % | photography, right-column rhythm |
| Checkout | 2.1390 % | ~3 px label/input offset in the payment row |
| Confirmed | 2.8836 % | tracking-grid glyphs |

Session start was 3.40 / 2.56 / 4.43 / 2.83 / 2.85 %. The big historical move
was **deleting four invented products** (a lamp, sleep buds, a laptop stand, a
tracker) — the frame says "4 products" in one row, and eight pushed the grid to
a second row and moved Shop from 2.6 % to 3.4 %.

After the landing/hero and iPhone-catalogue divergence, all five
`tools/ref/*.png` images were deliberately re-baselined to the new renders.
`node diff.cjs` now prints 0.0000 % on every screen; `node diff.cjs --figma`
prints 6.2864 / 5.7210 / 3.4435 / 2.2825 / 3.0409 %. Those larger numbers are
the intended design difference, not a regression.

**Known approximations** (documented in `NOTES-red.md`, do not "fix" blindly):

- The frame's four card plates are crops that still contain **their own badge
  and heart button**. Badges are kept; the baked heart is veiled with a
  feathered disc of plate colour (`.plate-bg.is-crop::after`) so the working
  control can sit there. Frame 01 draws hearts on cards 3 (filled) and 4
  (outline) only; ours draws a white disc on all four — a handful of pixels.
- The frame's typeface is Inter-ish but not Inter; glyph widths land within a
  pixel or two and never exactly.
- `.three` (city/postal/country) is derived, not measured field-by-field.

## 5. Behaviour that must keep working (`node tools/deep.cjs`)

landing opens first with the footer hidden and a working shop CTA · sort menu
opens → cheapest first is "iPhone 13" · favourite survives a reload · search
`16` yields 1 card and keeps focus · Pro nav reads "2 iPhones" · clearing the
email then paying shows "Check the highlighted fields" · fixing it and paying
reaches the confirmed screen · the confirmed CTA returns to the shop ·
`errors: none` throughout. `mobile.cjs` must print no `OVERFLOW` lines.

## 6. Decided against — do not retry

- **Keep the catalogue iPhone-only.** Do not re-add the frame's earbuds,
  headphones, watch, mouse or any invented products. The four-product grid
  remains, but the products are four iPhone generations.
- **Do not diff against `app-0N-*.png`** — wrong cart state. Use `frames.cjs`.
- **Port 5173 is a dead vite server.** The app is served from
  `docs/mockup/` (see §8).
- Clearing a form input with `e.value=''` **does not** trigger validation —
  click, Ctrl+A, Backspace.
- `KEEP` in `build.cjs` is a **whitelist**: a new product field must be added
  there or the views silently fall back to defaults.
- Scoping summary-card overrides to `.co-side` (padding 24/28/26, sum-line /
  rule / tax / button margins down) regressed Checkout from 2.14 % to 2.60 %.
  The global summary rhythm is right.
- `.card-name{margin-top:2px}` makes Shop worse — the card-text offset is
  plate-crop geometry, not margin. `.pay-fields` margin-top 12 makes the
  payment row worse; 3 is correct. `.done-grid` margin-top 14 overshoots by
  2 px; 12 is correct. `.ship-h` at 19 px is too wide; 18 px / 23 line-height
  with `-.004em` is the match.
- Don't reuse `card1.jpg` as a PDP hero or a recommended tile — `card*.jpg`
  bake in the badge and heart; only the `.plate-bg.is-crop::after` veil works.
- Grid children need `min-width:0`. Header order must stay `.mark` +
  `.hdr-tools` + `.hdr-row`.
- `fn.toString()` views need `named()`; the click delegate uses
  `t.hasAttribute(...)`; single-column `txt:` pixel probes are unreliable
  (1 px warm-grey edges are AA) — probe strips/rows with a `n[y]>2` run counter.
- In-app iframes have no network: **everything must stay inlined base64**.
- Python patches: always `assert old in s` before writing.

## 7. Historical brief — implemented

The following request was in flight when the fidelity work ended. It has now
been implemented on this branch; reproduced verbatim for context:

> now i would like the following changes, first, i want us to use only iphones
> images different version but we will only be selling iphones and use super
> clean images, and also the picture that i attached is i like this hero
> section. i like the way the photo in the hero section doesnt have its won
> background but it stays on the hero section card's background, so also do
> this on our hero section. and also if you look at the card itself is that it
> takes so much space in the mobile screen so i think a way to make the card
> smaller is by reducing the amount of information presented on the card and
> also remove the buttons on the card, make that card feel like an invitation
> for the customer to shop, and also create a super beautiful, majestic and
> amazing landing page that will be the first to open and remove the footer
> that makes the home page as a landing page and lets gooo

Attached: a two-band reference strip (`docs/mockup/red/next/hero-band-reference.png`,
840×455) — a **PRADA "COMING SOON"** band on a pale-green field with a dark-red
ink splash bleeding off the band's left edge and no separate photo box, and a
**"Show up ready for the first day back & beyond"** band on flat pink with a
model cut out of her own background standing on the band, button-underlined
link bottom-left. The point: **the hero artwork has no card of its own — it
sits on the hero panel's own background and bleeds off its edge.**

How to read that as work on this repo:

1. **Catalogue → iPhones only.** Replace the four products with iPhone models
   (different generations/versions), each with clean, consistent cut-out
   photography on the plate field colour. `KEEP` (§6) must carry any new
   product field. Counts in the UI follow automatically (`4 products` if four
   models). The frames' copy in §3 stops being binding for the catalogue —
   say so in `NOTES-red.md` and `README.md` rather than silently drifting.
2. **Hero: artwork on the panel, not in a tile.** Today `.hero-r` is a
   270×240 rounded `<img>` card at x940 (`herotile.jpg`). It must become a
   cut-out that sits directly on `#FCE6E9`, no radius, no white box, no
   background — ideally bleeding past the panel's right edge
   (`.hero{overflow:hidden}` is already there, so overhanging the panel is the
   trick). Keep the 1312×318 panel, the 64 px margins and the eyebrow /
   h1 / paragraph / dark-button stack intact.
3. **Smaller product cards on mobile, and no buttons on them.** Drop the
   "View product →" link and thin the card down to *image + name + price* on
   phones (the card becomes an invitation, not a spec sheet). Keep the desktop
   card as measured — the frames are binding there. Do it in the `≤640` block,
   and check `mobile.cjs` for OVERFLOW afterwards.
4. **A landing page that opens first, and no footer on it.** A new `home`
   route rendered at `store.route = 'home'` on first load; majestic and
   editorial, in the existing tokens (§3) — the hero band from item 2 is the
   obvious centrepiece, then two or three full-bleed product moments, a value
   strip, and a closing invitation into the shop. **No footer on that route**
   (the footer is currently emitted in `SHELL`, outside `#app` — so it has to
   become conditional on the route in `paint()`, or move inside the views).
   The shop lives on at `#/shop`, reachable from the landing page's CTAs.

Sequencing that keeps the baseline honest: do 4 and 2 together (they share the
hero), then 1, then 3. After each step run `node frames.cjs && node diff.cjs`
and expect the **Shop number to move** — the design is being changed on purpose
now, so if a number regresses, re-baseline `tools/ref/01-shop.png` deliberately
(and note it) instead of hunting a phantom regression. The other four screens
should stay at their numbers unless their products changed.

## 7a. Divergence log

Implemented in this branch:

1. **Landing + hero.** `store.route = 'home'` on first load, hash routes
   (`#/shop`, `#/product/<id>`, etc.), a conditional footer hidden on home, and
   an editorial landing page with three full-bleed product moments, a value
   strip and a closing shop CTA. The shared hero now uses transparent WebP
   cut-outs directly on `#FCE6E9` and overhangs the clipped panel edge; the old
   270 × 240 rounded `herotile.jpg` box is gone.
2. **First deliberate Shop re-baseline.** Shop moved from 2.5169 % to 4.7872 %
   against the lossless Figma target (4.8861 % against the raw JPEG) after the
   landing/hero change. `tools/ref/01-shop.png` was replaced with that render
   on purpose.
3. **iPhone-only catalogue.** The four products, categories, navigation,
   search, detail copy, bag recommendations, seeded order, cart fixtures and
   photography are now four iPhone generations: 16 Pro, 15, 14 Pro and 13.
   Clean transparent WebP cut-outs are shown with `object-fit:contain` on the
   existing measured plates. The frames' catalogue copy is explicitly no longer
   binding.
4. **Final deliberate re-baseline.** Because the catalogue appears across all
   five measured screens, all `tools/ref/*.png` files were replaced with the
   new renders. Default `node diff.cjs` prints 0.0000 % on all five; raw Figma
   divergence is 6.2864 / 5.7210 / 3.4435 / 2.2825 / 3.0409 %.
5. **Probes.** `frames.cjs` opens `#/shop`; `mobile.cjs` and `deep.cjs` assert
   the landing opens first, the footer is hidden, and the CTA reaches the shop.
   Deep assertions now use iPhone names, search `16`, and the Pro category.

## 8. Preview

The app is a static file, so the live preview is just a server over
`docs/mockup`:

```bash
cd docs/mockup && python3 -m http.server 8080 --bind 0.0.0.0
```

That surfaces as `https://8080-{sandboxId}.e2b.app/`. Bind to `0.0.0.0`, never
`127.0.0.1`, or the proxied preview cannot reach it. A stale server may already
be running on 8080 from the previous session — check before starting another.

## 9. Git

This session's branch is **`arena/f802f442-kapaya`**, branched from `08bce96`
on `arena/232a3895-kapaya`. Work only on the current branch, push only to it.
`main` is the initial commit and is not to be merged into; older branch
references above are historical.

Recent history: `4b23632` product rating-label width · `948f563` checkout field
rhythm · `1829653` confirmed grid · `9da8039` fidelity notes · `ee6ccac` bag
alignment · `778b648` four-product catalogue · `311a291` · `721aef8` ·
`93e640c` · `c677f5c` · `d503cfb` · `f78ab45` · `0f5f7e7` · `dd7e712`.

`tools/.chromium/`, `tools/node_modules/` and
`figma-plugin/volta-mobile/img/*.b64` are git-ignored derived assets.
`docs/mockup/.fonts/` is tracked on purpose: it is what makes the build
reproducible to the byte.
