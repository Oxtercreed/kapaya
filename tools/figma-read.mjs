/*
 * figma-read.mjs — turn a Figma frame into a build-ready spec.
 *
 *   FIGMA_TOKEN=... node tools/figma-read.mjs <fileKey> <nodeId> [--json]
 *
 * No dependencies (plain fetch). Requires a personal access token with
 * file_content:read, scoped to files you own or can view.
 *
 * What it prints:
 *   - the type scale it infers (size, weight, line-height, tracking per role)
 *   - the colour palette it infers (fills, hex, usage count)
 *   - auto-layout spacing / padding values, most common first
 *   - component names + variant properties in the frame
 *   - any text node using a non-integer letterSpacing that will round badly in CSS
 *   - a warning list for anything the browser will render differently (line-height
 *     percentage vs px, blended fills, effects, image fills, nested blur)
 *
 * Why this exists: the connector exposes read + comment, not node creation, so the
 * loop is Figma -> spec -> code -> screenshots, not code -> Figma.
 */

// Load a token from .env if the shell did not provide one (keeps it out of history).
import { readFileSync } from 'node:fs'
try {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  for (const row of env.split('\n')) {
    const m = row.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  /* no .env, fine */
}

const FILE_KEY = process.argv[2]
const NODE_ID = process.argv[3]
const AS_JSON = process.argv.includes('--json')
const TOKEN = process.env.FIGMA_TOKEN

if (!FILE_KEY || !NODE_ID) {
  console.error('usage: FIGMA_TOKEN=... node tools/figma-read.mjs <fileKey> <nodeId|1-23> [--json]')
  process.exit(1)
}
if (!TOKEN) {
  console.error('missing FIGMA_TOKEN (Figma → Settings → Personal access tokens → file_content:read)')
  process.exit(1)
}

const id = NODE_ID.replace('-', ':')
const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(id)}&geometry=paths`

const hex = (c) => {
  if (!c) return null
  const to = (v) => Math.round((v ?? 0) * 255).toString(16).padStart(2, '0')
  return `#${to(c.r)}${to(c.g)}${to(c.b)}${c.a != null && c.a < 1 ? to(c.a) : ''}`
}

const round = (n, d = 2) => (typeof n === 'number' ? Number(n.toFixed(d)) : n)

async function main() {
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } })
  if (!res.ok) {
    console.error(`Figma API ${res.status}: ${(await res.text()).slice(0, 400)}`)
    process.exit(2)
  }
  const data = await res.json()
  const entry = Object.values(data.nodes || {})[0]
  if (!entry?.document) {
    console.error('no document in response — check the file key and node id')
    process.exit(3)
  }

  const root = entry.document
  const type = new Map()
  const colors = new Map()
  const gaps = new Map()
  const components = new Map()
  const warnings = new Set()
  const textNodes = []

  const bump = (map, key, n = 1) => {
    if (key == null) return
    map.set(key, (map.get(key) ?? 0) + n)
  }

  const walk = (node, depth = 0) => {
    if (node.fills?.length) {
      for (const f of node.fills) {
        if (f.visible === false) continue
        if (f.type === 'SOLID') bump(colors, hex(f.color))
        else if (f.type?.includes('GRADIENT')) bump(colors, `${f.type}:${f.gradientStops?.map((s) => hex(s.color)).join('→')}`)
        else if (f.type === 'IMAGE') warnings.add(`image fill on "${node.name}" — export it, don't describe it`)
      }
      if (node.fills.some((f) => f.opacity != null && f.opacity < 1)) {
        warnings.add(`layer fill opacity on "${node.name}" — CSS needs the alpha baked into the colour, not a wrapper opacity`)
      }
    }
    if (node.strokes?.length && node.strokeWeight) {
      bump(gaps, `stroke ${round(node.strokeWeight)}px`)
    }
    if (node.effects?.some((e) => e.visible !== false)) {
      warnings.add(`effect (shadow/blur) on "${node.name}" — the mono system has no shadows; drop it or rewrite it as a hairline`)
    }
    if (node.itemSpacing) bump(gaps, `gap ${round(node.itemSpacing)}px`)
    if (node.paddingLeft || node.paddingTop) {
      const p = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft].map((v) => round(v || 0))
      if (p.some(Boolean)) bump(gaps, `padding ${p.join(' ')}`)
    }
    if (node.cornerRadius) bump(gaps, `radius ${round(node.cornerRadius)}px`)

    if (node.type === 'TEXT' && node.style) {
      const s = node.style
      const key = `${s.fontFamily} ${s.fontWeight} ${round(s.fontSize, 1)}/${round(s.lineHeightPx, 1)} ls ${round(s.letterSpacing, 3)}`
      bump(type, key)
      textNodes.push({ name: node.name, style: s, chars: node.characters?.slice(0, 60) })
      if (s.lineHeightUnit === 'PERCENT' || s.lineHeightUnit === 'AUTO') {
        warnings.add(`line-height not in px (${s.lineHeightUnit}) on "${node.name}" — pin it to px so the browser matches`)
      }
      if (typeof s.letterSpacing === 'number' && Number.isInteger(s.letterSpacing) === false && s.letterSpacingUnit === 'PIXELS') {
        // fractional px tracking is fine, but sub-pixel *percent* tracking is not
      }
      if (s.letterSpacingUnit === 'PERCENT') {
        warnings.add(`letter-spacing in percent on "${node.name}" — convert to em so it survives nested sizes`)
      }
      if (s.textCase === 'UPPER' || s.textCase === 'SMALL_CAPS') bump(type, `case:${s.textCase}`)
    }

    if (node.type === 'INSTANCE' || node.type === 'COMPONENT') {
      const name = node.name.replace(/^[^/]*\//, '')
      bump(components, name)
      for (const [k, v] of Object.entries(node.componentProperties ?? {})) {
        bump(components, `${name} · ${k}=${v.value}`)
      }
    }
    if (node.type === 'INSTANCE' && !node.componentProperties) {
      warnings.add(`instance "${node.name}" has no exposed properties — variants will not map to props`)
    }

    for (const child of node.children ?? []) walk(child, depth + 1)
  }

  walk(root)

  const sortDesc = (m) => [...m.entries()].sort((a, b) => b[1] - a[1])

  const report = {
    frame: { name: root.name, width: root.absoluteBoundingBox?.width, height: root.absoluteBoundingBox?.height },
    typeScale: sortDesc(type).map(([k, n]) => ({ value: k, uses: n })),
    palette: sortDesc(colors).map(([k, n]) => ({ value: k, uses: n })),
    spacing: sortDesc(gaps).map(([k, n]) => ({ value: k, uses: n })),
    components: sortDesc(components).map(([k, n]) => ({ value: k, uses: n })),
    warnings: [...warnings],
    text: textNodes.slice(0, 60).map((t) => ({
      layer: t.name,
      font: t.style.fontFamily,
      weight: t.style.fontWeight,
      size: round(t.style.fontSize, 1),
      lineHeightPx: round(t.style.lineHeightPx, 1),
      tracking: round(t.style.letterSpacing, 3),
      text: t.chars,
    })),
  }

  if (AS_JSON) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  const line = (s = '') => console.log(s)
  line(`FRAME  ${report.frame.name}  ${report.frame.width}×${report.frame.height}`)
  line()
  line('TYPE SCALE (most used first)')
  for (const t of report.typeScale.slice(0, 18)) line(`  ${String(t.uses).padStart(3)}×  ${t.value}`)
  line()
  line('PALETTE')
  for (const c of report.palette.slice(0, 16)) line(`  ${String(c.uses).padStart(3)}×  ${c.value}`)
  line()
  line('SPACING / RULES')
  for (const g of report.spacing.slice(0, 18)) line(`  ${String(g.uses).padStart(3)}×  ${g.value}`)
  line()
  line('COMPONENTS')
  for (const c of report.components.slice(0, 20)) line(`  ${String(c.uses).padStart(3)}×  ${c.value}`)
  if (report.warnings.length) {
    line()
    line('WILL NOT TRANSLATE 1:1')
    for (const w of report.warnings) line(`  ! ${w}`)
  }
}

const explain = (e) => {
  if (String(e?.message || e).includes('fetch failed')) {
    return 'network: this sandbox cannot reach api.figma.com. Run the script on your own machine, or paste the frame stats here and I will work from them.'
  }
  return String(e?.message || e)
}

main().catch((e) => {
  console.error(explain(e))
  process.exit(1)
})
