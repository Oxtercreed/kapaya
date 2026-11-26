# VOLTA — red screens mockup

A design mockup of the five **red** screens from the Figma file, replicated at
1:1 against the source frames: same 1440 × 1200 boxes, same colours, same
copy, same prices, same photography.

**Open `index.html`** — that is the whole deliverable. It is a single
self-contained page: Inter is inlined as base64 woff2 and the product images
are inlined as base64 JPEG, so it renders identically with no build step, no
server and no network.

```
docs/mockup/
├── index.html          the deck — five frames, desktop size, scales down to fit
├── build.cjs           regenerates index.html  (node build.cjs)
├── NOTES-red.md        the source frames, palette, grid and type scale
├── .fonts/             Inter woff2 files that get inlined
└── red/
    ├── img/            product photography cropped from the Figma render
    └── ref/            1:1 crops of the five Figma frames, for comparison
```

## What is in it

| # | screen | frame id |
|---|---|---|
| 01 | Shop — hero, category filter, four products, service strip | `8:2` |
| 02 | Product details — gallery, colour + quantity, benefits, tabs | `8:92` |
| 03 | Shopping bag — line item, free-shipping note, order summary | `8:161` |
| 04 | Checkout — contact, address, payment, live order summary | `8:240` |
| 05 | Order confirmed — receipt, tracking timeline, delivery details | `8:342` |

Each screen is the desktop frame exactly as drawn in Figma. The page scales the
whole 1440 px canvas down when the window is narrower than it, so nothing
reflows or clips — it behaves like a design deck rather than a responsive site.

## Notes

* The frames were reproduced by measuring a 1:1 render, not by reinterpreting
  the design. Anything not in the file — extra screens, a mobile layout,
  a palette shift — was deliberately left out.
* All type is Inter, as in the file.
* The product photos are crops of the Figma render at native size; the original
  image fills sit behind signed URLs that could not be downloaded here, so
  these are the sharpest copies available.
* `red/ref/` holds the source frames so the reproduction can be diffed at any
  time.

To change anything, edit `build.cjs` and run `node build.cjs` — the frames are
laid out with absolute coordinates in source order, so the numbers map straight
onto the Figma layer positions.
