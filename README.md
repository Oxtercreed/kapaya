# KAPAYA — Objects for a slower home

A complete, clickable storefront for a fictional artisan homeware studio in Dar es Salaam,
built with React + Vite. No backend required — cart, chat, orders and account data live in
`localStorage`, so the whole flow works end to end.

## Run it

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # self-contained static build in dist/
```

### Offline / no-server version

`npm run build` produces a fully self-contained site: relative asset paths
(`base: './'`), `images/` rewritten at build time by `build/relative-images.js`,
and hash-based routing. Unzip `dist/` and double-click `index.html` — it runs
straight from the filesystem with no server and no network.

## What's inside

| Screen | Route | Highlights |
| --- | --- | --- |
| Splash + login | `/login` | Brand loading animation, sign-in / create account, Google & Apple buttons, guest entry |
| Home | `/` | Hero, trust bar, category rail, new-in & bestseller rails, editorial band, makers, journal, UGC |
| Shop | `/shop` | Draggable category slider, sidebar filters (category, price, material, maker, tags), 5 sort modes, search & URL params |
| Product | `/product/:slug` | Gallery, colour & size options that change price, accordions, reviews, maker story, related pieces, sticky mobile buy bar |
| Cart | `/cart` | Line editing, promo codes (`KARIBU10`, `STUDIO25`), free-delivery meter, 3-step checkout, order confirmation |
| Chat | `/chat` | Thread list, product card messages, quick prompts, typing indicator, keyword-aware auto replies |
| Account | `/account` | Overview, orders (filter tabs), order detail with tracker, saved pieces, addresses CRUD, payment methods, details, notifications, help |

Everything is responsive down to 360 px, with a fixed bottom tab bar, filter sheets and a
sticky add-to-bag bar on mobile.

## Design notes — the monochrome art direction

The storefront was re-art-directed in a **strictly monochrome editorial** system. There is no
accent colour anywhere: one paper (`#fbfaf7`), one ink (`#0b0b0a`), and three greys derived from
ink at low alpha. If a value needs to stand out it gets weight, scale or a hairline — never hue.

- **Type.** Bodoni Moda (Didone display, self-hosted latin subset) for headlines, Instrument Sans
  for everything that has to be read quickly. Captions are 9–10 px, uppercase, `0.16–0.2em`
  tracking. Headline tracking goes negative (`-0.03em`) at display sizes.
- **Structure.** The layout is a catalogue, not a card grid: numbered index rows for categories,
  folios on photographs (`Pl. I`, `Pl. VIII`), hairline rules instead of boxes, square corners
  everywhere (all `--r-*` tokens are `0`), and no shadows except one deep footer/overlay lift.
- **Imagery.** All product photography was desaturated and contrast-graded to a single print
  range, so the grid reads as one photoshoot. Three new plates (`mono-hero`, `mono-textile`,
  `mono-objects`, `mono-atelier`) carry the editorial sections.
- **Motion.** Only two moves: lines sliding up behind a mask on the masthead, and plates scaling
  1.02–1.04 on hover. Everything else is instant. `prefers-reduced-motion` kills both.
- **Where the CSS lives.** The original warm system is still the load-bearing base
  (`base.css`, `home.css`, `plp.css`, …). `mono.css` and `mono-pages.css` load last and
  re-skin it token-first, so the flows kept working while the look changed. Change tokens in
  `mono.css` before overriding a component.

### Design files

- `design/SPEC.md` — the one-page system: rule, tokens, type ramp, grid, per-screen structure,
  and the round-trip workflow with Figma.
- `design/tokens.dtcg.json` — W3C DTCG token file (importable into Tokens Studio / Figma variables).
- `design/tokens.css` — the same values as CSS custom properties.
- `design/FIGMA-SETUP.md` — where to create a Figma file, how to share it, and how to build it
  so the node read comes back accurate (page-per-screen, real text layers, auto layout).

### Working with a Figma file

`tools/figma-read.mjs` is a dependency-free reader for the Figma REST API. It prints the type
scale, palette, spacing values, component variants and a list of properties that will not
translate 1:1 into CSS.

```bash
echo 'FIGMA_TOKEN=figd_...' > .env        # file_content:read, gitignored
node tools/figma-read.mjs <fileKey> <nodeId>
node tools/figma-read.mjs <fileKey> <nodeId> --json > spec.json
```

The file key is the 22-character segment in a Figma URL (`figma.com/design/<fileKey>/…`) and the
node id is the `node-id` query parameter. The script needs to reach `api.figma.com`, which this
sandbox cannot; run it locally, or paste the numbers into the chat and the same spec can be
reconstructed by hand.

Note that the Figma connector available here can **read** files, export frames as PNG and post
comments, but cannot create frames or components. So Figma is the spec, review and annotation
surface, and the storefront is the artifact.
