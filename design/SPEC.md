# KAPAYA — monochrome editorial

A one-page design spec for rebuilding this storefront in Figma, and for reading a Figma
file back into code. Every number here is the value actually shipping in `src/styles/mono.css`.

---

## 1. The rule

**Two colours. No accent.** One paper (`#FBFAF7`) and one ink (`#0B0B0A`), plus three greys
made from ink at low alpha. If something needs emphasis it gets weight, scale, a hairline, or
empty space — never a hue.

**Square.** Every corner radius is `0`. Inputs are underlines, not boxes. Panels are rules, not cards.

**Hairlines and folios.** Structure comes from 1px rules and small uppercase captions
(`PL. I`, `NO. 07`, `01`), the way a printed catalogue is set.

**Photography is the only image.** One grade: desaturated, lifted blacks, compressed highlights,
so nine product shots and one studio shot read as a single commissioned shoot.

---

## 2. Tokens

Open `design/tokens.dtcg.json` (DTCG format) and `design/tokens.css` (same values, CSS vars).
Both are committed. Use the JSON with Tokens Studio for Figma or Figma's own variable import.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#FBFAF7` | page ground |
| `paper-3` | `#F1F0EB` | plate ground, hover fill |
| `ink` | `#0B0B0A` | text, solid buttons, footer band |
| `ink-soft` | `#5B5B52` | secondary copy, captions |
| `ink-faint` | `#97978D` | folios, meta, disabled |
| `line` | `rgba(11,11,10,.13)` | hairline |
| `line-strong` | `rgba(11,11,10,.45)` | underlines, control borders |

### Type

Bodoni Moda (display) and Instrument Sans (everything else). One size ramp, uppercase captions.

| Role | Font | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Masthead | Bodoni | 106 px (clamp 52→122) | 400 | 0.86 | −0.045em |
| h1 | Bodoni | 62 px (clamp 34→62) | 400 | 0.98 | −0.03em |
| h2 | Bodoni | 44 px (clamp 27→44) | 400 | 1.02 | −0.028em |
| Product name | Bodoni | 18.5 px | 400 | 1.1 | −0.01em |
| Body | Instrument Sans | 15 px | 400 | 1.6 | −0.004em |
| Lede | Instrument Sans | 16.5 px | 400 | 1.66 | 0 |
| Caption / eyebrow | Instrument Sans | 10 px | 600 | 1.4 | 0.2em, UPPER |
| Folio | Instrument Sans | 9 px | 600 | 1.4 | 0.16em, UPPER |
| Money | Instrument Sans | 10.5 px | 500 | 1.2 | 0.08em, UPPER |
| Button | Instrument Sans | 10.5 px | 600 | 1 | 0.18em, UPPER |

Never italicise Bodoni for emphasis beyond the one-line `<em>` in a display heading. Never set
Bodoni below 17 px — the hairlines fall apart.

### Space

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 104`. Gutter 56 px desktop / 18 px under 860 px.
Max width 1560 px. Section rhythm: 54–104 px block padding, tightening to 34–56 px on phones.

### Grid

| Breakpoint | Product plates | Notes |
| --- | --- | --- |
| ≥ 1081 px | 4 across | filters sidebar 240 px, sticky summary 380 px |
| 861–1080 px | 3 across | filters collapse to a sheet |
| 640–860 px | 2 across | tab bar replaces desktop nav |
| < 640 px | 2 across | 12 px gutters, 4:5 plates |

---

## 3. Screens

Every screen is 1440 × auto (desktop) and 390 × auto (phone). Build these frames:

1. **Splash** — full-bleed ink. Wordmark centred, 160 px Bodoni, `0.02em` tracking. Four
   corner captions: studio line, city, a counting folio, tagline. 2 px progress rule at the foot.
2. **Login** — 50/50 split. Left: ink panel with the hero plate at 34% opacity, a three-line
   Didone pull-quote, top and bottom hairlines framing the panel. Right: form on paper, 420 px
   max width, hairline inputs, black pill-free button, social row as two outlined cells.
3. **Home** — masthead (type left / plate right, caption under the plate), running strip of five
   services, numbered category index, two plate rails, atelier spread, black makers band,
   journal trio, flush 5-up plate row, services grid, newsletter line.
4. **Shop** — display heading with a folio column on the right, category tabs as a ruled table of
   contents, hairline toolbar, filter sidebar, 4-up plate grid, "load more" rule.
5. **Product** — plate left with thumbnails, info right: caption, Bodoni title, stars, price,
   blurb, maker row, colour swatches, size rows with prices, add-to-bag, service accordions,
   reviews, "more from the studio" rail, sticky mobile buy bar.
6. **Cart** — line items on rules, order summary as a bordered panel with a black header rule,
   free-delivery meter as a 2 px rule, promo field, totals, checkout.
7. **Chat** — three columns framed by one ink border: thread list, correspondence, studio card.
   Bubbles are square, outgoing is solid ink.
8. **Account** — sidebar of ruled links (active = solid ink), stats in outlined cells, order
   tracker with square nodes, saved pieces, addresses, cards, details, help.

---

## 4. Round trip

Figma here is a **read** surface, not a write one. The connector can read the node tree, export a
frame as PNG and post comments, but cannot create frames or components. So:

- **You → Figma.** Build or adjust frames there. Paste the frame link.
- **Me → spec.** `tools/figma-read.mjs` turns a frame into type scale, palette, spacing,
  component variants and a "will not translate 1:1" list (percentage line-heights, layer opacity,
  effects, letter-spacing in percent, image fills).
- **Me → code.** I implement against the spec and screenshot at 390 / 834 / 1440.
- **Comments.** I can pin critique to a specific frame in your file so the notes live next to the
  layer they are about.

```bash
echo 'FIGMA_TOKEN=figd_...' > .env          # needs file_content:read
node tools/figma-read.mjs <fileKey> <nodeId>            # human-readable spec
node tools/figma-read.mjs <fileKey> <nodeId> --json     # machine-readable
```

`fileKey` is the 22-character segment in `figma.com/design/<fileKey>/…`; `nodeId` is the
`node-id` query parameter (e.g. `1-23`). The script needs `api.figma.com`, which this sandbox
cannot reach — run it locally, or paste the numbers and I will reconstruct the spec by hand.
