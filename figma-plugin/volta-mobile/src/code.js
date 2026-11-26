// VOLTA · mobile screens → Figma
// Builds a "Mobile" section of nine 390×844 phone frames, laid out like the desktop rail:
// a header + top row of screens, the frame name below each one, wrapped in rows.
//
// Run: Figma → Plugins → Development → Import plugin from manifest…  (manifest.json)
//      then select nothing and run it. Safe to run twice — it rebuilds its own section.

const SCREENS = [
  { num: '05', name: 'Login', file: '05-login', note: 'Sign in, socials, guest path' },
  { num: '06', name: 'Home', file: '06-home', note: 'Hero, categories, products' },
  { num: '07', name: 'Shop', file: '07-shop', note: 'Filters, two-up grid' },
  { num: '08', name: 'Product details', file: '08-product', note: 'Gallery, options, buy bar' },
  { num: '09', name: 'Shopping bag', file: '09-bag', note: 'Lines, promo, summary' },
  { num: '10', name: 'Checkout', file: '10-checkout', note: 'Steps, address, payment' },
  { num: '11', name: 'Order confirmed', file: '11-order-confirmed', note: 'Tracking rail, recap' },
  { num: '12', name: 'Account', file: '12-account', note: 'Orders, addresses, details' },
  { num: '13', name: 'Chat', file: '13-chat', note: 'Talk to the studio' },
]

// geometry — mirrors the desktop rail (72px gutters, 120px between frames)
const PHONE_W = 390
const PHONE_H = 844
const PER_ROW = 5
const GUTTER = 72          // outer margin
const GAP_X = 88           // between frames
const GAP_Y = 132          // between rows (name label lives in here)
const HEADER_H = 132       // section heading block
const RADIUS = 28
const LABEL_H = 88         // name + note under each frame

// palette taken from the file
const FIELD = { r: 0.973, g: 0.973, b: 0.988 }
const INK = { r: 0.078, g: 0.090, b: 0.118 }
const VIOLET = { r: 0.443, g: 0.333, b: 0.910 }
const BODY = { r: 0.396, g: 0.412, b: 0.463 }
const SANS = { family: 'Inter', style: 'Regular' }
const SANS_MED = { family: 'Inter', style: 'Medium' }
const SANS_SEMI = { family: 'Inter', style: 'Semi Bold' }
const SANS_BOLD = { family: 'Inter', style: 'Bold' }

function solid(color) {
  return { type: 'SOLID', color }
}

function addText(parent, chars, opts) {
  const t = figma.createText()
  t.fontName = opts.font || SANS
  t.characters = chars
  t.fontSize = opts.size || 14
  t.fills = [solid(opts.color || INK)]
  if (opts.letterSpacing !== undefined) {
    t.letterSpacing = { value: opts.letterSpacing, unit: 'PERCENT' }
  }
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PERCENT' }
  parent.appendChild(t)
  if (opts.x !== undefined) t.x = opts.x
  if (opts.y !== undefined) t.y = opts.y
  return t
}

async function main() {
  await Promise.all([
    figma.loadFontAsync(SANS),
    figma.loadFontAsync(SANS_MED),
    figma.loadFontAsync(SANS_SEMI),
    figma.loadFontAsync(SANS_BOLD),
  ])

  const page = figma.currentPage

  // ---- keep the file tidy: replace our own section if it already exists
  const existing = page.children.find((n) => n.name === 'Mobile · 390')
  if (existing) existing.remove()

  // ---- where does the desktop rail end? put the mobile section beneath it
  const rail = page.children.filter((n) => /^\d\d · /.test(n.name))
  let sectionY = 0
  if (rail.length) {
    const bottoms = rail.map((n) => n.y + n.height)
    sectionY = Math.max(...bottoms) + 360
  }

  // ---- section frame, transparent, hugs its content
  const section = figma.createFrame()
  section.name = 'Mobile · 390'
  section.fills = []
  section.clipsContent = false
  section.x = rail.length ? Math.min(...rail.map((n) => n.x)) : 0
  section.y = sectionY

  const cols = Math.min(PER_ROW, SCREENS.length)
  const rows = Math.ceil(SCREENS.length / cols)
  const innerW = cols * PHONE_W + (cols - 1) * GAP_X
  // the name + note under the last row sit inside the bottom gutter
  section.resizeWithoutConstraints(
    innerW + GUTTER * 2,
    HEADER_H + rows * (PHONE_H + GAP_Y) - GAP_Y + GUTTER + LABEL_H,
  )

  // ---- header block
  const kicker = addText(section, 'MOBILE · 390', {
    font: SANS_MED, size: 12, color: VIOLET, letterSpacing: 14,
    x: GUTTER, y: 0,
  })
  kicker.letterSpacing = { value: 14, unit: 'PERCENT' }

  addText(section, 'The same brand, thumb-first', {
    font: SANS_SEMI, size: 44, color: INK, letterSpacing: -3,
    x: GUTTER, y: 30,
  })

  const sub = addText(
    section,
    'The Figma file defines desktop only — these nine frames extend the same system down to a 390 px phone.',
    { font: SANS, size: 15, color: BODY, x: GUTTER, y: 92 },
  )
  sub.resize(620, sub.height)

  // ---- frames
  const loaded = {}
  for (let i = 0; i < SCREENS.length; i++) {
    const s = SCREENS[i]
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = GUTTER + col * (PHONE_W + GAP_X)
    const y = HEADER_H + row * (PHONE_H + GAP_Y)

    const frame = figma.createFrame()
    frame.name = `${s.num} · ${s.name}`
    frame.resize(PHONE_W, PHONE_H)
    frame.x = x
    frame.y = y
    frame.fills = [solid(FIELD)]
    frame.clipsContent = true
    frame.cornerRadius = RADIUS
    section.appendChild(frame)

    // the screenshot, inlined as base64 so the plugin needs no network
    const html = figma.createImage(decodeBase64(loaded[s.file] || (loaded[s.file] = IMG[s.file])))
    frame.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: html.hash }]

    // label under the frame, like the desktop rail
    addText(section, `${s.num} · ${s.name}`, {
      font: SANS_SEMI, size: 17, color: INK, letterSpacing: -1,
      x, y: y + PHONE_H + 26,
    })
    addText(section, s.note, {
      font: SANS, size: 13, color: BODY,
      x, y: y + PHONE_H + 54,
    })
  }

  figma.viewport.scrollAndZoomIntoView([section])
  figma.notify(`VOLTA — ${SCREENS.length} mobile frames added`)
  figma.closePlugin()
}

function decodeBase64(b64) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const lookup = {}
  for (let i = 0; i < CHARS.length; i++) lookup[CHARS[i]] = i
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '')
  const len = clean.length
  const bytes = new Uint8Array(Math.floor((len * 3) / 4))
  let p = 0
  for (let i = 0; i < len; i += 4) {
    const [a, b, c, d] = [lookup[clean[i]], lookup[clean[i + 1]], lookup[clean[i + 2]], lookup[clean[i + 3]]]
    bytes[p++] = (a << 2) | (b >> 4)
    if (c !== undefined) bytes[p++] = ((b & 15) << 4) | (c >> 2)
    if (d !== undefined) bytes[p++] = ((c & 3) << 6) | d
  }
  return bytes
}

const IMG = __IMAGES__

main().catch((err) => {
  figma.notify('VOLTA plugin failed: ' + err.message, { error: true })
  console.error(err)
  figma.closePlugin()
})
