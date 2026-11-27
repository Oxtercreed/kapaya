# Kapaya brand and catalogue assets

These files are the source assets inlined or exported by the mockup build.

## Brand

- `kapaya-logo-4k.png` — polished transparent **3840×2160** master, suitable for
  print, decks and high-density displays.
- `kapaya-logo-4k-cream.png` — the same 4K master flattened onto brand cream for
  previews and presentations.
- `kapaya-logo.svg` — standalone full-colour lockup with Inter 700 embedded.
- `kapaya-mark.svg` — square split-ring `K` monogram used as the favicon source.
- `../brand.cjs` — resolution-independent vector geometry shared with the site.
- `../build-logo.cjs` — regenerates the standalone SVG files and 4K PNG master.

The storefront embeds the geometry directly as inline SVG in `index.html`, so
the on-screen logo is sharper than a raster and makes no network request.

## iPhone cut-outs

Four optimized transparent WebP files supply the catalogue and hero:

- `iphone-16-pro-front.webp` — 287×668
- `iphone-15-blue-back.webp` — 279×653
- `iphone-14-pro-purple.webp` — 288×659
- `iphone-13-midnight.webp` — 285×681

They contain no plate, card, tile or baked-in background: the hero places them
directly on its own panel and lets them overhang the clipped edge. The catalogue
plates place the same cut-outs on the neutral tile. All four are inlined into
`index.html` as base64 data URLs, keeping the deliverable self-contained.
