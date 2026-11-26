# VOLTA

Design work for VOLTA — an everyday-tech storefront: *good tech, better everyday*.

This repository is **design only**. There is no app, no build step and no
dependencies; every file here opens on its own.

| Path | What it is |
|---|---|
| [`docs/mockup/index.html`](docs/mockup/index.html) | The mockup — the five red screens from the Figma file, replicated 1:1, media inlined so it works offline from `file://` |
| [`docs/mockup/NOTES-red.md`](docs/mockup/NOTES-red.md) | The measurements the mockup was built from: frame ids, palette, grid, type scale |
| [`docs/mockup/red/ref/`](docs/mockup/red/ref) | 1:1 crops of the five source frames, for comparison |
| [`figma-plugin/`](figma-plugin/README.md) | A Figma development plugin that adds nine phone screens to a file as arranged frames |
| [`figma-plugin/volta-mobile.zip`](figma-plugin/volta-mobile.zip) | The importable plugin |

The Figma source file is
[zoygvtfjWN92VUiWAsSMOL](https://www.figma.com/file/zoygvtfjWN92VUiWAsSMOL/Untitled).

## What the mockup is

Five desktop screens at 1440 × 1200, matching the **red** frames in the Figma
file (`8:2`, `8:92`, `8:161`, `8:240`, `8:342`):

1. Shop — hero, category filter, four products, service strip
2. Product details — gallery, colour and quantity, benefits, tabs
3. Shopping bag — line item, free-shipping note, order summary
4. Checkout — contact, shipping address, payment, live order summary
5. Order confirmed — receipt, tracking timeline, delivery details

They are a reproduction, not a reinterpretation: same boxes, colours, copy,
prices and photography as the source frames. No extra screens, no mobile
layout, no palette shift.

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
