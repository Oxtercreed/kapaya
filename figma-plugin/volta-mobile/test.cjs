// Headless sanity check: run the plugin against a mock figma API.
const fs = require('fs')
const path = require('path')

const created = []
function node(type, name) {
  const n = {
    type, name, x: 0, y: 0, width: 0, height: 0, children: [],
    fills: [], clipsContent: true, cornerRadius: 0, fontName: null, characters: '',
    fontSize: 0, letterSpacing: null, lineHeight: null,
    resize(w, h) { this.width = w; this.height = h },
    resizeWithoutConstraints(w, h) { this.width = w; this.height = h },
    appendChild(c) {
      const i = page.children.indexOf(c)
      if (i >= 0) page.children.splice(i, 1)
      this.children.push(c); c.parent = this; return c
    },
    remove() { this.removed = true },
  }
  created.push(n)
  return n
}

const page = node('PAGE', 'Page 1')
// pretend the existing desktop rail is there, to test the "place below" maths
;['01 · Shop', '02 · Product details', '03 · Shopping bag'].forEach((name, i) => {
  const f = node('FRAME', name)
  f.x = 72 + i * 1480
  f.y = -393
  f.width = 1440
  f.height = 1200
  page.children.push(f)
})

let closed = false
global.figma = {
  currentPage: page,
  loadFontAsync: async () => {},
  // Figma auto-appends a created frame to the current page
  createFrame: () => { const f = node('FRAME', ''); page.children.push(f); return f },
  createText: () => { const t = node('TEXT', ''); return t },
  createImage: (bytes) => {
    if (!(bytes instanceof Uint8Array)) throw new Error('createImage wants Uint8Array')
    if (bytes.length < 10000) throw new Error('image bytes look truncated: ' + bytes.length)
    globalThis.__lastBytes = bytes
    return { hash: 'hash-' + bytes.length }
  },
  viewport: { scrollAndZoomIntoView: () => {} },
  notify: (m) => console.log('notify:', m),
  closePlugin: () => { closed = true },
}

const src = fs.readFileSync(path.join(__dirname, 'code.js'), 'utf8')
// strip the top-level `const IMG = {...}` back out so we can inspect it separately
const m = src.match(/const IMG = (\{[\s\S]*?\n\})\n\nmain\(\)/)
if (!m) throw new Error('could not find IMG payload')
const IMG = eval('(' + m[1] + ')')

// verify every payload decodes to the right bytes
const b64len = (n) => Math.floor((n * 3) / 4)
const expectations = {
  '05-login': '05-login.jpg', '06-home': '06-home.jpg', '07-shop': '07-shop.jpg',
  '08-product': '08-product.jpg', '09-bag': '09-bag.jpg', '10-checkout': '10-checkout.jpg',
  '11-order-confirmed': '11-order-confirmed.jpg', '12-account': '12-account.jpg', '13-chat': '13-chat.jpg',
}
for (const [k, file] of Object.entries(expectations)) {
  const raw = fs.readFileSync(path.join(__dirname, 'img', file))
  const got = b64len(IMG[k].length)
  const ok = Math.abs(got - raw.length) <= 3
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${k}: file=${raw.length}B decoded≈${got}B`)
  if (!ok) process.exitCode = 1
}

// run it
new Function('figma', src)(global.figma)
setTimeout(() => {
  const section = page.children.find((n) => n.name === 'Mobile · 390')
  if (!section) throw new Error('no section created')
  console.log('section:', section.x, section.y, section.width + '×' + section.height, '| children:', section.children.length)
  const frames = section.children.filter((n) => n.type === 'FRAME')
  const texts = section.children.filter((n) => n.type === 'TEXT')
  console.log('frames:', frames.length, '| labels:', texts.length)
  frames.forEach((f) => console.log('  ', f.name, `@ ${f.x},${f.y}`, f.width + '×' + f.height, f.fills[0] && f.fills[0].type))
  const overlap = frames.some((a, i) => frames.some((b, j) => i < j &&
    a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height))
  console.log(overlap ? 'FAIL frames overlap' : 'OK   no overlapping frames')
  if (overlap) process.exitCode = 1
  const right = Math.max(...frames.map((f) => f.x + f.width))
  const bottom = Math.max(...frames.map((f) => f.y + f.height + 80))
  console.log(right <= section.width ? 'OK   frames inside section width' : `FAIL overflow ${right} > ${section.width}`)
  console.log(bottom <= section.height ? 'OK   frames inside section height' : `FAIL overflow ${bottom} > ${section.height}`)
  console.log(closed ? 'OK   closed' : 'FAIL did not close')
  if (texts.length !== 3 + frames.length * 2) { console.log('FAIL label count', texts.length); process.exitCode = 1 }
}, 100)
