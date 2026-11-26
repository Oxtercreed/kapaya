# VOLTA

Design work for VOLTA — an everyday-tech storefront: good tech, better everyday.

This repository is **design only**. There is no app, no build step and no dependencies; every
file here opens on its own.

| Path | What it is |
|---|---|
| [`docs/mockup/index.html`](docs/mockup/index.html) | The design deck — ten desktop screens and nine phone screens, media inlined so it works offline from `file://` |
| [`docs/mockup/shots/`](docs/mockup/shots) | The raw screen images, for dropping into Figma or a deck |
| [`docs/mockup/README.md`](docs/mockup/README.md) | Notes on the deck: what's in it, the colour and type system behind it |
| [`figma-plugin/`](figma-plugin/README.md) | A Figma development plugin that adds the nine phone screens to a file as arranged frames |
| [`figma-plugin/volta-mobile.zip`](figma-plugin/volta-mobile.zip) | The importable plugin |

The Figma source file is
[zoygvtfjWN92VUiWAsSMOL](https://www.figma.com/file/zoygvtfjWN92VUiWAsSMOL/Untitled).

## The system, in a paragraph

Field `#F8F8FC`, ink `#14171E`, body `#656976`, one accent `#7155E8` with two tints
(`#EAE4FC` feature, `#EDE8FD` promo on `#493987` ink) and a single hairline `#E5E3EC`.
Inter throughout: 28/700 wordmark, 40/600 product titles, 28/600 section heads, 15/400 nav,
11/500 micro caps. 64 px margins on a 1312 px content width, radii 28 / 22 / 18 / 12, product
cards 304 × 326 in a four-up grid on 32 px gutters.

The Figma file defines desktop only; Home, Account, Chat, Login, the loading animation and all
phone layouts extend the same system rather than inventing a new one.
