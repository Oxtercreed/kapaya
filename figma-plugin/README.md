# Kapaya · mobile screens → Figma

Adds the nine phone screens to your Figma file as **real frames**, arranged the way the desktop
rail is arranged: a section header, then a row of screens with the frame name and a one-line
note under each one.

## Why a plugin

The Figma connection in this session is read-only (metadata, nodes, comments, exports) there is
no endpoint that creates or edits nodes, so nothing can be pushed into the file directly. This
plugin is the supported way to add content from outside: Figma runs it inside the file with full
write access, and it needs no network.

## Add it to the file (~30 seconds)

1. Download **[kapaya-mobile.zip](kapaya-mobile.zip)** and unzip it anywhere.
2. In Figma, open your Kapaya file → menu **☰ → Plugins → Development → Import plugin from manifest…**
3. Pick `manifest.json` from the unzipped folder.
4. Run **Plugins → Development → Kapaya · mobile screens**.

The section appears below the desktop frames, selected and zoomed into. Running it again replaces
the previous section rather than duplicating it, so it is safe to re-run after changes.

## What it creates

A transparent section frame named **`Mobile · 390`**:

| | |
|---|---|
| Screens | 05 Login · 06 Home · 07 Shop · 08 Product details · 09 Shopping bag · 10 Checkout · 11 Order confirmed · 12 Account · 13 Chat |
| Frame size | 390 × 844 (real CSS pixels), 28 px corner radius, `#F8F8FC` field |
| Arrangement | 5 per row, wraps to a second row 72 px outer margin, 88 px between frames, 132 px between rows |
| Under each frame | `05 · Login` in Inter SemiBold 17, plus a 13 px note |
| Section header | `MOBILE · 390` kicker, 44 px title, 15 px description |
| Placed | 360 px below the lowest desktop frame, left-aligned with the rail |
| Assets | Nine 2× screenshots (780 px wide) inlined as base64 nothing to upload, no network |

Screens are flat images, so treat them as high-fidelity mockups: you can move, scale and export
them, but their internals are not editable layers. If you want any of them rebuilt as live Figma
layers (auto-layout, text, components), say which screen and I'll do that one properly.

## Rebuilding

```bash
# 1. capture fresh 2x screenshots into img/ (see the harness), then:
cd figma-plugin/kapaya-mobile
node build.cjs     # inlines img/*.b64 into code.js
node test.cjs      # mock-Figma run: checks layout, overlap, bounds, image integrity
cd .. && zip -rq kapaya-mobile.zip manifest.json code.js   # from figma-plugin/
```

`src/code.js` is the readable source; `code.js` is generated (it carries the inlined images).

## Files

| Path | What it is |
|---|---|
| `kapaya-mobile.zip` | The importable plugin this is the download you need |
| `kapaya-mobile/manifest.json` | Plugin manifest (`api 1.0.0`, no network access) |
| `kapaya-mobile/code.js` | Built plugin, images inlined |
| `kapaya-mobile/src/code.js` | Source |
| `kapaya-mobile/build.cjs` | Inlines `img/*.b64` into the build |
| `kapaya-mobile/test.cjs` | Headless check against a mock Figma API |
| `kapaya-mobile/img/` | 2× screenshots + base64 copies |
