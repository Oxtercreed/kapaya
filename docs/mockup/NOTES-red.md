# Red screens: measurement notes

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
render the originals are Figma image fills behind signed URLs that this
sandbox cannot fetch, so these are the highest-resolution copies obtainable.

The red-screen palette below is the historical Figma measurement. The current
Kapaya identity uses burnt orange `#B84B18`, ink `#14171E` and cream `#F4F3EF`;
see `HANDOFF.md`.

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

The confirmed-screen headline is **36 px**, not 40 it is the only place the
reference breaks the page-heading size.

## Rebuilding

```bash
node docs/mockup/build.cjs      # writes docs/mockup/index.html
```

`index.html` is the deliverable: one self-contained file with Inter inlined as
base64 woff2, transparent product photography inlined as base64 WebP, and the
screens as real markup plus a small client-side router. No build step at
runtime, no network, no external assets. `.fonts/` holds the woff2 sources;
`assets/` holds the iPhone cut-outs.

The five frames above were the measured starting point. The app now adds a
footerless landing page, hash routing, an edge-bleeding hero, an iPhone-only
catalogue, My orders, order detail, the help center, empty/search states and a
phone layout, all built from the same tokens so the store reads as one product.

## Fidelity

Historically, the five screens were driven headlessly (real clicks: add to bag,
promo, pay), screenshotted at 1440 × 1200 and diffed against `red/ref/`:

| screen | MAE vs reference |
|---|---|
| Shop | 2.6 % |
| Product details | 2.5 % |
| Shopping bag | 3.3 % |
| Checkout | 2.1 % |
| Order confirmed | 2.9 % |

Residual disagreement is glyph antialiasing and the photographs. The catalogue
is deliberately the frame's four products: an earlier build added four more
invented ones, which pushed the shop into a second row and moved the Shop frame
from 2.6 % to 3.4 %.

## Deliberate divergence

The first load is a footerless editorial landing page. The shared Shop/landing
hero uses transparent iPhone cut-outs directly on `#FCE6E9`, bleeding past the
panel's clipped edge instead of sitting in a 270 × 240 rounded tile. The
catalogue is now **four iPhones only** iPhone 16 Pro, iPhone 15, iPhone 14 Pro
and iPhone 13 with clean consistent WebP cut-outs and categories Pro,
Standard and Classic. The frames' catalogue copy (including "LESS NOISE. MORE
YOU.", "Your everyday, upgraded." and "Find your next everyday essential") is
explicitly no longer binding.

On phones (`≤640`) the catalogue cards are deliberately smaller: a two-column
grid of image + name + price only, with badges, ratings, hearts and "View
product" links hidden. The desktop card remains the measured 304 × 326 plate.

The shop hero is now left-only: the right-hand "THE COLLECTION", price and note
block has been removed from every hero variant, while the transparent iPhone
cut-outs still bleed off the panel. On the landing route the header is reduced
to the Kapaya logo and a right-aligned `Start shopping` CTA; shop and other
routes keep the full measured header. All U+2014 em dashes are gone from the
generated copy, title, metadata and build logs.

This is not a fidelity target. After the landing/hero, logo-only header,
left-only hero, no-U+2014, iPhone-only and Kapaya-brand changes, raw Figma JPEG
MAE is **6.1999 / 5.7722 /
3.5064 / 2.3351 / 3.1021 %**. All five `tools/ref/*.png` regression references
were replaced with the intentional new renders after the brand change, and
`01-shop.png` was deliberately re-baselined again for the hero cleanup, so
default `node diff.cjs` prints 0.0000 % on every screen. The Shop-only
re-baseline after the landing/hero step was 4.7872 % against the lossless crop
(4.8861 % against the raw JPEG); the catalogue change moved the other four
references too.

## Known approximations

- Historical: the frame's card plates were crops containing their own badge and
  heart button. New iPhone cut-outs have no baked badge or heart, so the current
  cards draw both controls directly on the plate field.
- `.three` (city / postal / country) is derived from the frame, not measured
  field-by-field.
- Rendering Inter from the same woff2 files as Figma, so word shapes match but
  letter-spacing is tuned by eye (~0.5 % of width).
