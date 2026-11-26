# VOLTA — storefront design

A design deliverable for an everyday-tech storefront. One violet-and-white system, drawn
desktop-first, extended down to the phone.

## View it

Open **`index.html`** in this folder. It is fully self-contained (images inlined), so it works
offline and from `file://` — no server, no build step.

## What's in it

| Section | Contents |
|---|---|
| Cover | Brand line, scope, screen count |
| Foundations | 7 colour tokens, 6 type steps — all taken from the Figma file |
| Desktop · 1440 | Loading, Login, Home, Shop, Product details, Shopping bag, Checkout, Order confirmed, Account, Chat |
| Mobile · 390 | The same nine screens at phone width |
| Hand-off | What I'd add to the Figma file next |

`shots/` holds the raw screen images if you want to drop any of them into Figma or a deck.

## The design, in a paragraph

Field `#F8F8FC`, ink `#14171E`, body `#656976`, one accent `#7155E8` with two tints
(`#EAE4FC` feature, `#EDE8FD` promo on `#493987` ink) and a single hairline `#E5E3EC`.
Inter throughout: 28/700 wordmark, 40/600 product titles, 28/600 section heads, 15/400 nav,
11/500 micro caps. 64 px page margins on a 1312 px content width, radii 28 / 22 / 18 / 12,
product cards 304 × 326 in a four-up grid on 32 px gutters. Product photography is
desaturated on a near-white sweep so the violet stays the only colour in the room.

The Figma file only defines desktop, so the phone layouts, Home, Account, Chat, Login and the
loading animation are extensions of the same system rather than new inventions.

## Editing

`index.html` is a single self-contained file — no build step. To swap a screen, replace the
matching file in `shots/` and re-inline it as a base64 `data:` URI in the `src` of that frame.
