# VOLTA — storefront mockup

**Open `index.html`** — that is the whole deliverable. It is one self-contained
page: Inter is inlined as base64 woff2, clean iPhone photography is inlined as
base64 WebP, and the client-side router renders every screen without a build
step, server or network request.

The first screen is a majestic, footerless **landing page**. The shop lives
behind its CTA at `#/shop`; product, bag, checkout and confirmed routes use the
same hash router. The shared hero places transparent cut-outs directly on the
`#FCE6E9` panel and lets them bleed past its clipped edge — no image tile of
their own.

```
docs/mockup/
├── index.html          the self-contained deliverable
├── build.cjs           regenerates index.html  (node build.cjs)
├── assets/             clean transparent iPhone cut-outs inlined by build.cjs
├── NOTES-red.md        source measurements, tokens and divergence notes
├── .fonts/             Inter woff2 files that get inlined
└── red/
    ├── img/            historical Figma product crops, no longer inlined
    └── ref/            original five Figma frame crops, for divergence diffs
```

## Routes

| route | screen |
|---|---|
| first load / `#/home` | editorial landing page, no footer |
| `#/shop` | four-iPhone catalogue, filters, search, sort and service strip |
| `#/product/<id>` | gallery, colour + quantity, benefits, specs and reviews |
| `#/bag` | line quantities, remove/save, free-shipping threshold, recommendations |
| `#/checkout` | contact, address, payment, promo and live order summary |
| `#/confirmed` | receipt, tracking timeline, delivery and payment details |
| `#/account`, `#/orders`, `#/help` | order history, order detail and help center |

State lives in `localStorage` (`volta.state`), so bag, saved items, form values
and orders survive a reload. The catalogue is four iPhone generations — 16 Pro,
15, 14 Pro and 13 — with Pro, Standard and Classic categories. On phones the
cards collapse to a compact two-column image + name + price invitation with no
card buttons; desktop keeps the measured card.

## Design origin

The five **red** Figma screens were the measured starting point: palette, type
scale, 64 / 1312 grid, 304 × 326 cards, and the 824 + 32 + 456 split. The
landing page, edge-bleeding hero and iPhone-only catalogue are deliberate
divergences from those frames; see `NOTES-red.md` and `HANDOFF.md`. The tools
folder keeps both a zero-drift regression baseline and `--figma` divergence
scores against the original crops.

To change anything, edit `build.cjs` and run `node build.cjs`, then verify with
the headless probes in `tools/`.
