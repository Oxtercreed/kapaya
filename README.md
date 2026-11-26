# VOLTA

An interactive mockup of VOLTA — an everyday-tech storefront: *good tech, better everyday*.

One self-contained HTML file. No build step to run it, no dependencies, no network:
open it and the whole store works.

| Path | What it is |
|---|---|
| [`docs/mockup/index.html`](docs/mockup/index.html) | The storefront — every screen, live, with media and Inter inlined |
| [`docs/mockup/build.cjs`](docs/mockup/build.cjs) | The generator that writes that file (`node docs/mockup/build.cjs`) |
| [`docs/mockup/NOTES-red.md`](docs/mockup/NOTES-red.md) | The measurements it was built from: frame ids, palette, grid, type scale |
| [`docs/mockup/red/ref/`](docs/mockup/red/ref) | 1:1 crops of the five source frames, for comparison |
| [`figma-plugin/`](figma-plugin/README.md) | A Figma development plugin that adds nine phone screens to a file as arranged frames |
| [`tools/`](tools/README.md) | Headless-Chromium probes: shoot the five screens, score them, walk the phone layout |
| [`HANDOFF.md`](HANDOFF.md) | Everything a new session needs: state, rules, and the work in flight |

The Figma source file is
[zoygvtfjWN92VUiWAsSMOL](https://www.figma.com/file/zoygvtfjWN92VUiWAsSMOL/Untitled).

## What it is

A clickable store, built to the design of the **red** frames in that file
(`8:2` Shop, `8:92` Product, `8:161` Bag, `8:240` Checkout, `8:342` Confirmed).
Those five screens are reproduced as measured — same boxes, colours, copy,
prices and photography — and the rest is built from the same parts so the
whole thing can actually be used:

| Screen | What works |
|---|---|
| Shop | category filter, live search with an empty state, sort menu, save items |
| Product | colour choice, quantity stepper, add to bag, specs and reviews tabs |
| Bag | line quantities, remove, save for later, free-shipping threshold, recommendations |
| Checkout | editable contact/shipping/payment fields, validation, promo code `VOLTA10` (10% off), live totals |
| Confirmed | order number, tracking timeline, delivery address, payment summary |
| My orders | order history, order detail, download-receipt action |
| Help center | shipping, warranty, payment answers |

State lives in `localStorage` (`volta.state`), so the bag, saved items and orders
survive a reload — and a checkout adds a real order you can open from **My orders**.

Layout is responsive: 1440 px desktop to a 390 px phone, with the same tokens
throughout. On phones the header folds to a wordmark, an account icon, a search
row, a scrolling nav and a bag pill.

## The system, in a paragraph

Field `#FAF9F9`, ink `#14171E`, body `#656976`, one accent `#C92332` with three
tints (`#FCE6E9` hero, `#FDECEE` announcement and confirmation, `#FAEDEF` strips)
on `#96151F` ink, product plates `#F3F3F3`, success chip `#D8F2E7`, hairlines
`#E8E6E7`. Inter throughout, no negative tracking: 28/700 wordmark, 48/600 hero,
40/600 page titles, 28/600 section heads, 24/600 summary heads, 15/400 nav,
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
node frames.cjs && node diff.cjs   # 2.52 / 2.52 / 3.25 / 2.14 / 2.88 %
node mobile.cjs                    # 390 px walk, no overflow
node deep.cjs                      # seven interaction assertions
```

The catalogue is the four products the reference frames show — Aurora Buds Pro,
Vertex H9, Pulse Watch S2, Glide Pro Mouse — so the shop grid is a single row of
four and every count in the UI reads `4 products`, matching the frames. Each of
the four has its own detail copy (benefit set, specifications, reviews) rather
than one earbud script reused across a lamp and a mouse.
