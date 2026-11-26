# Preparing a Figma file this agent can read

The connector has **read** access (file tree, exported PNGs, comments). It has **no** access to
team/folder listing, and it cannot create or edit anything. So the file has to be reachable by
link, and built in a way that survives being read as data.

---

## 1. Where to create it

| Option | Works? | Why |
| --- | --- | --- |
| **Personal Drafts** (`figma.com/files` → Drafts) | ✔ best | One click to share; no team admin needed |
| A team file in a project you own | ✔ | Also fine if you can change sharing settings |
| A **branch** of a design file | ✘ | Branch files return 404 for most read calls |
| **FigJam** board | ✘ | Different object model; the file tools expect a design file |
| Slides deck | ✘ | Same reason |

Create it as a normal **Design file** (`Create new → Design`). Name it something unambiguous,
e.g. `KAPAYA — Storefront v2`, because the file name is the first thing I see.

## 2. Share it so the link actually resolves

1. Open the file → **Share** (top right).
2. Set **Anyone with the link → can view**.
3. Click **Copy link**.

If your workspace forbids link sharing, publish it instead:
`File → Publish to Community → Publish`, copy that community URL, and send me
**that URL plus a screenshot of each top frame**. Published files are readable without
per-file sharing.

## 3. Structure the file so the read is clean

Use **one page per screen, plus one tokens page**. My reader walks the tree, so page names
become the outline you get back.

```
Page 00 · Tokens            ← colour styles, text styles, spacing, the type ramp
Page 01 · Foundations       ← 4-col / 3-col / 2-col grid frames, hairlines, button states
Page 02 · Splash
Page 03 · Login
Page 04 · Home
Page 05 · Shop
Page 06 · Product
Page 07 · Cart
Page 08 · Chat
Page 09 · Account
Page 10 · Components        ← nav, product card, plate, filter row, toast, sheet
```

Frame sizes — use exactly these, they match the breakpoints the code ships:

| Frame | Size |
| --- | --- |
| `HOME / desktop` | 1440 × auto |
| `HOME / phone` | 390 × auto |
| `SHOP / desktop` | 1440 × 2400 |
| `PDP / desktop` | 1440 × 2200 |
| Sheet / modal | 440 × auto, 520 × auto |

Name frames `SCREEN / variant` (`HOME / desktop`). Name layers the way they should read in a
spec (`card / product`, `plate / image`, `row / price`), and delete leftovers — every layer name
comes back in the dump.

## 4. What makes the read accurate

- **Real text layers.** Converted-to-outline type comes back as a vector with no font, size or
  tracking — I can only guess. Keep every heading as living text.
- **Text styles + colour styles, or variables.** If the file uses styles, I get the ramp in one
  pass instead of inferring it from 200 text nodes.
- **Auto layout** for anything that is a row, stack or grid. That gives me padding, gaps and
  alignment semantics instead of absolute coordinates.
- **Pixel line-heights** (`Line height → px`), not `Auto` or `%`.
- **Letter-spacing in px or em**, not `%`.
- **One component per region**, with variants named `state=default, hover, filled`.
- **Opacity in the fill**, not on the layer. Layer opacity reads as a warning and gets skipped.
- **No effects.** The mono system has no shadows; a shadow in the file is a mismatch I have to
  flag rather than translate.

## 5. What breaks or gets flagged

| In the file | What happens |
| --- | --- |
| `% line-height`, `% letter-spacing` | flagged as "will not translate 1:1" |
| Layer opacity < 100% | flagged; CSS needs alpha baked into the colour |
| Drop shadows / blurs | flagged; the system has no shadows |
| Image fills | I get "export it, don't describe it" — send the plate as a PNG too |
| Instances with no exposed properties | variants cannot map to props |
| Frames inside **Sections** | sections are skipped on some calls; keep frames at page root |
| Hidden layers | skipped — but name them anyway so we both know they were considered |

## 6. Handing it over

Send the frame link copied from the canvas (right-click a frame → **Copy link to selection**).
It looks like:

```
https://www.figma.com/design/<fileKey>/KAPAYA?node-id=12-345
```

That gives me `fileKey` and `nodeId`. A link without `node-id` gives me the whole file, which is
fine for a first pass but slow.

If the connection cannot read your workspace (permission error), the fallback is a **PNG export
per frame** (`Export → PNG @2x`) attached in chat. I can read images directly, and I will
reconstruct the tokens by eye — less precise than the node read, but never blocked.

## 7. What comes back

1. A **spec dump**: type scale, palette with usage counts, spacing, component variants, warnings.
2. **Pinned comments** in your file on the frames with issues (if the write scope allows).
3. Code: the frames implemented in `src/`, then screenshots at 390 / 834 / 1440 next to your
   frames so the differences are visible, not described.

The tokens to build against are already in `design/tokens.dtcg.json` and `design/tokens.css`,
so a new file can start from the shipping values rather than from scratch.
