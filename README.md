# Kapaya

An interactive, iPhone-only Kapaya storefront mockup: *good tech, better everyday*.

One self-contained HTML file. No build step to run it, no dependencies, no network:
open it and the whole store works.

| Path | What it is |
|---|---|
| [`docs/mockup/index.html`](docs/mockup/index.html) | The storefront: every screen, live, with media and Inter inlined |
| [`docs/mockup/build.cjs`](docs/mockup/build.cjs) | The generator that writes that file (`node docs/mockup/build.cjs`) |
| [`docs/mockup/NOTES-red.md`](docs/mockup/NOTES-red.md) | The measurements it was built from: frame ids, palette, grid, type scale |
| [`docs/mockup/assets/`](docs/mockup/assets/README.md) | Clean transparent iPhone cut-outs, Kapaya 4K/vector brand assets |
| [`docs/mockup/red/ref/`](docs/mockup/red/ref) | 1:1 crops of the five source frames, for comparison |
| [`figma-plugin/`](figma-plugin/README.md) | A Figma development plugin that adds nine phone screens to a file as arranged frames |
| [`tools/`](tools/README.md) | Headless-Chromium probes: shoot the five screens, score them, walk the phone layout |
| [`HANDOFF.md`](HANDOFF.md) | Everything a new session needs: state, rules, and the work in flight |

The Figma source file is
[zoygvtfjWN92VUiWAsSMOL](https://www.figma.com/file/zoygvtfjWN92VUiWAsSMOL/Untitled).

## What it is

A clickable store that began as a measured reproduction of the **red** frames
(`8:2` Shop, `8:92` Product, `8:161` Bag, `8:240` Checkout, `8:342` Confirmed),
then deliberately diverged. The first load is now a majestic footerless landing
page, the shop sits behind its CTA at `#/shop`, the hero uses edge-bleeding
cut-outs instead of a white tile, and the catalogue is four iPhone generations.
The measured desktop card geometry and the bag/checkout/confirmed grid still
come from the frames:

| Screen | What works |
|---|---|
| Home | footerless editorial landing page, full-bleed product moments, shop CTA |
| Shop | category filter, live search with an empty state, sort menu, save items |
| Product | colour choice, quantity stepper, add to bag, specs and reviews tabs |
| Bag | line quantities, remove, save for later, free-shipping threshold, recommendations |
| Checkout | editable contact/shipping/payment fields, validation, promo code `KAPAYA10` (10% off), live totals |
| Confirmed | order number, tracking timeline, delivery address, payment summary |
| My orders | order history, order detail, download-receipt action |
| Help center | shipping, warranty, payment answers |

State lives in `localStorage` (`kapaya.state`), so the bag, saved items and orders
survive a reload, and a checkout adds a real order you can open from **My orders**.

Layout is responsive: 1440 px desktop to a 390 px phone, with the same tokens
throughout. On phones the header folds to the Kapaya logo, an account icon, a
search row, a scrolling nav and a bag pill; product cards become compact two-column
invitations with only image, name and price, and no card buttons. The measured
desktop card remains unchanged.

## The system, in a paragraph

Field `#FAF9F9`, ink `#14171E`, body `#656976`, one accent `#C92332` with three
tints (`#FCE6E9` hero, `#FDECEE` announcement and confirmation, `#FAEDEF` strips)
on `#96151F` ink, product plates `#F3F3F3`, success chip `#D8F2E7`, hairlines
`#E8E6E7`. Inter throughout, no negative tracking: inline Kapaya vector logo,
48/600 hero, 40/600 page titles, 28/600 section heads, 24/600 summary heads, 15/400 nav,
11/500 micro caps. 64 px margins on a 1312 px content width, radii 28 / 22 / 18 /
16 / 12, product cards 304 × 326 on 32 px gutters, and an 824 + 32 + 456
two-column split for bag, checkout and confirmation.

## Rebuilding

```bash
node docs/mockup/build.cjs
```

Writes `docs/mockup/index.html`. Nothing else to install.

## Verifying

```bash
bash tools/fetch-chromium.sh       # once per clone (Chromium, git-ignored)
cd tools && npm install
node frames.cjs && node diff.cjs   # 0.00 / 0.00 / 0.00 / 0.00 / 0.00 %
node mobile.cjs                    # landing + 390 px walk, no overflow
node deep.cjs                      # nine interaction assertions
```

The catalogue is now **four iPhones only**: iPhone 16 Pro ($1099), iPhone 15
($799), iPhone 14 Pro ($899) and iPhone 13 ($599). Categories are Pro, Standard
and Classic; every product has its own clean cut-out, detail copy, specification
set and reviews. The red frames' original earbuds/headphones/watch/mouse
catalogue and its copy are deliberately no longer binding. This is a design
divergence, documented in `NOTES-red.md` and `HANDOFF.md`.

The landing page opens first with no footer, a logo-only header with a
`Start shopping` button on the right, and a hero that keeps only its left-side
eyebrow, headline, description and CTA. The shop and other store
routes use hash links. All five `tools/ref/*.png` regression references were
re-baselined on purpose after the brand change; `tools/ref/01-shop.png` was
re-baselined again after the hero cleanup. Use `node diff.cjs --figma` to see
the intentional difference from the original Figma frames:
6.1999 / 5.7722 / 3.5064 / 2.3351 / 3.1021 %.
