// Search helpers — token matching with a small synonym map so that plain-language
// queries ("vase", "blanket", "lamp") find the right pieces.

const SYNONYMS = {
  vase: ['vessel', 'vases', 'jug'],
  vessel: ['vase', 'jug'],
  jug: ['vase', 'vessel', 'pitcher'],
  blanket: ['throw', 'textile', 'linen', 'wool'],
  throw: ['blanket', 'textile', 'linen'],
  pillow: ['cushion', 'textile'],
  cushion: ['pillow', 'textile'],
  lamp: ['pendant', 'light', 'lighting', 'rattan'],
  light: ['lamp', 'pendant', 'lighting'],
  lighting: ['lamp', 'pendant', 'light'],
  cup: ['mug', 'tableware', 'ceramic'],
  mug: ['cup', 'tableware'],
  plate: ['bowl', 'tableware', 'ceramic'],
  bowl: ['plate', 'tableware', 'ceramic'],
  chair: ['seat', 'furniture', 'stool', 'lounge'],
  seat: ['chair', 'stool', 'furniture'],
  stool: ['chair', 'seat', 'furniture', 'side table'],
  table: ['tableware', 'furniture', 'runner'],
  rug: ['carpet', 'wool', 'textile', 'floor'],
  carpet: ['rug', 'wool'],
  candle: ['zanzu', 'scented'],
  tray: ['ashlar', 'travertine'],
  linen: ['textile', 'throw', 'napkin', 'runner'],
  wooden: ['oak', 'mvule', 'timber', 'wood'],
  wood: ['oak', 'mvule', 'timber'],
  cheap: ['under', 'budget'],
  gift: ['candle', 'vessel', 'mug', 'tray'],
}

const STOP = new Set(['the', 'a', 'an', 'for', 'with', 'and', 'of', 'in', 'to', 'my', 'our'])

export function haystack(product) {
  return [
    product.name,
    product.studio,
    product.maker,
    product.category,
    product.blurb,
    product.materials,
    product.origin,
    ...(product.tags ?? []),
    ...(product.colors ?? []).map((c) => c.name),
  ]
    .join(' ')
    .toLowerCase()
}

export function buildIndex(products) {
  return products.map((p) => ({ product: p, hay: haystack(p) }))
}

/** Returns true when every meaningful token of `query` matches the product. */
export function matchesQuery(hay, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  // price query like "under 150000" / "under 150,000"
  const priceMatch = q.match(/under\s*([\d,]+)/)
  if (priceMatch) return true // handled by caller where price is known

  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean).filter((t) => !STOP.has(t))
  if (!tokens.length) return true

  return tokens.every((t) => {
    if (new RegExp(`\\b${t}`).test(hay)) return true
    const syn = SYNONYMS[t]
    if (syn && syn.some((s) => new RegExp(`\\b${s}`).test(hay))) return true
    // partial match for longer words (e.g. "stonewar", "pendan")
    if (t.length >= 5 && hay.includes(t.slice(0, Math.max(5, t.length - 2)))) return true
    return false
  })
}

export function searchProducts(index, query, limit = 6) {
  const q = query.trim()
  if (!q) return []
  const priceMatch = q.match(/under\s*([\d,]+)/)
  if (priceMatch) {
    const max = Number(priceMatch[1].replace(/,/g, ''))
    return index.filter((e) => e.product.price <= max).slice(0, limit).map((e) => e.product)
  }
  const scored = index
    .filter((e) => matchesQuery(e.hay, q))
    .map((e) => {
      const name = e.product.name.toLowerCase()
      let score = 0
      if (name.startsWith(q.toLowerCase())) score += 5
      if (name.includes(q.toLowerCase())) score += 3
      if (e.product.studio.toLowerCase().includes(q.toLowerCase())) score += 2
      score += e.product.rating / 5
      return { p: e.product, score }
    })
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.p)
}
