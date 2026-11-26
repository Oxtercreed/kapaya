# Red screens — measurement notes

Source: Figma file `zoygvtfjWN92VUiWAsSMOL` ("Untitled"), page 1, second row.

| frame | id | name |
|---|---|---|
| 01 | `8:2` | Shop · Red |
| 02 | `8:92` | Product details · Red |
| 03 | `8:161` | Shopping bag · Red |
| 04 | `8:240` | Checkout · Red |
| 05 | `8:342` | Order confirmed · Red |

All five frames are **1440 × 1200**, laid out in a row at `y = 967`,
`x = 751 / 2231 / 3711 / 5191 / 6671`.

`red/ref/*.jpg` are 1:1 crops of those frames, taken from the Figma canvas
render. `red/img/*.jpg` are the product photographs cropped out of the same
render — the originals are Figma image fills behind signed URLs that this
sandbox cannot fetch, so these are the highest-resolution copies obtainable.

## Palette (sampled, not eyeballed)

| token | hex | used for |
|---|---|---|
| field | `#FAF9F9` | frame background |
| white | `#FFFFFF` | header, footer, cards, panels |
| ink | `#14171E` | wordmark, nav, headings, prices, dark button |
| body | `#656976` | secondary copy, footer tag |
| accent | `#C92332` | current nav item, "All products" chip, primary buttons |
| accentInk | `#96151F` | text on pink (announcement bar, promo blocks) |
| tint | `#FCE6E9` | Shop hero panel |
| tintSoft | `#FDECEE` | announcement bar, checkout delivery row, confirmed hero |
| tintRow | `#FAEDEF` | Shop service strip, bag shipping note, support block |
| search | `#F5F3F3` | search field |
| tile | `#F3F3F3` | product image plates |
| green | `#D8F2E7` | success tick chip (confirmed hero) |
| hair | `#E8E6E7` | header/footer hairlines, dividers |
| border | `#DCDCDD` | form field outlines |

## Grid

* Frame 1440 wide, page margin **64 px** each side, content **1312 px**.
* Header block 93 px (`y` 28 → 120) under a 28 px announcement bar.
* Footer 108 px (`y` 1092 → 1200).
* Shop cards: `304 × 326` at `x` 64 / 400 / 736 / 1072, `y` 658 → 984
  (32 px gutters, 12 px card padding, `280 × 180` image plate at `y` 671).
* Bag / checkout / confirmed two-column split: **824 px** left panel,
  **32 px** gutter, **456 px** right panel (`x` 920).
* Corner radii: 28 (hero), 22 (panels, cards, buttons), 16–20 (strips),
  12–14 (images, chips, inputs).

## Type

Inter throughout, **no negative letter-spacing** (verified against the render).

| role | size / weight |
|---|---|
| wordmark | 28 / 700 |
| nav | 15 / 400 (current item 600, accent) |
| announcement bar | 12 / 500 |
| hero display | 48 / 600, 58 line-height |
| hero price | 22 / 600 |
| section heading | 28 / 600 |
| page heading (`Your bag`, `Checkout`, PDP title) | 40 / 600, 48 line-height |
| order-summary heading | 24 / 600 |
| card title | 16 / 600 |
| product meta / body | 13–14 / 400 |
| micro label (table headers, form labels) | 11–11.5 / 500 |

The confirmed-screen headline is **36 px**, not 40 — it is the only place the
reference breaks the page-heading size.

## Rebuilding

```bash
node docs/mockup/build.cjs      # writes docs/mockup/index.html
```

`index.html` is the deliverable: one self-contained file with Inter inlined as
base64 woff2 and product photography inlined as base64 JPEG. No build step, no
network, no external assets. `.fonts/` holds the woff2 sources.

Fidelity check used while building: each frame was screenshotted headlessly at
1440 × 1200 and diffed against `red/ref/` — residual disagreement is now
2.4–3.9 % of pixels, concentrated in glyph antialiasing and the photographs.
