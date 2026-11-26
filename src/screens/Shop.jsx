import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products, categories, categoryName } from '../data/catalog'
import { formatTZS, useStore } from '../store'
import { ProductCard, Empty, Sheet, useDragScroll, Qty } from '../components/ui'
import { haystack, matchesQuery } from '../lib/search'
import {
  IconFilter,
  IconSliders,
  IconChevronDown,
  IconChevronRight,
  IconClose,
  IconCheck,
  IconSearch,
  IconGrid,
  IconArrowRight,
} from '../components/Icons'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'Newest first' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Best rated' },
]

const PRICE_MIN = 0
const PRICE_MAX = 400
const PRICE_STEP = 10

const MATERIALS = [
  { id: 'aluminium', label: 'Aluminium', match: /aluminium|alumina/i },
  { id: 'fabric', label: 'Fabric & weave', match: /fabric|weave|nylon|polyester|knit/i },
  { id: 'silicone', label: 'Silicone & rubber', match: /silicone|rubber|fluoroelastomer/i },
  { id: 'leather', label: 'Leather', match: /leather|protein/i },
  { id: 'glass', label: 'Glass & crystal', match: /glass|sapphire/i },
]

const TAGS = [
  { id: 'bestseller', label: 'Bestseller' },
  { id: 'audio', label: 'Audio' },
  { id: 'new', label: 'New in' },
  { id: 'sale', label: 'On sale' },
  { id: 'desk', label: 'Desk' },
]

function PriceRange({ value, onChange }) {
  const [lo, hi] = value
  const trackRef = useRef(null)

  const pct = (v) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const startDrag = (which) => (e) => {
    e.preventDefault()
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const move = (ev) => {
      const x = Math.min(Math.max(0, ev.clientX - rect.left), rect.width)
      const raw = PRICE_MIN + (x / rect.width) * (PRICE_MAX - PRICE_MIN)
      const v = Math.round(raw / PRICE_STEP) * PRICE_STEP
      if (which === 'lo') onChange([Math.min(v, hi - PRICE_STEP), hi])
      else onChange([lo, Math.max(v, lo + PRICE_STEP)])
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="price-range">
      <div className="price-track" ref={trackRef}>
        <div className="price-track__fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <button
          className="price-knob"
          style={{ left: `${pct(lo)}%` }}
          onPointerDown={startDrag('lo')}
          aria-label={`Minimum price ${formatTZS(lo)}`}
          role="slider"
          aria-valuemin={PRICE_MIN}
          aria-valuemax={hi}
          aria-valuenow={lo}
        />
        <button
          className="price-knob"
          style={{ left: `${pct(hi)}%` }}
          onPointerDown={startDrag('hi')}
          aria-label={`Maximum price ${formatTZS(hi)}`}
          role="slider"
          aria-valuemin={lo}
          aria-valuemax={PRICE_MAX}
          aria-valuenow={hi}
        />
      </div>
      <div className="row between" style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums' }}>
        <span>{formatTZS(lo)}</span>
        <span>{hi >= PRICE_MAX ? `${formatTZS(hi)}+` : formatTZS(hi)}</span>
      </div>
    </div>
  )
}

function FiltersPanel({ filters, setFilters, counts }) {
  const toggle = (key, val) =>
    setFilters((f) => {
      const set = new Set(f[key])
      set.has(val) ? set.delete(val) : set.add(val)
      return { ...f, [key]: [...set] }
    })

  return (
    <div>
      <div className="fgroup">
        <p className="fgroup__title">Category</p>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={`fopt ${filters.category === c.slug ? 'is-on' : ''}`}
            onClick={() => setFilters((f) => ({ ...f, category: f.category === c.slug ? null : c.slug }))}
          >
            <span className="fopt__box">{filters.category === c.slug && <IconCheck size={11} />}</span>
            {c.name}
            <span className="fopt__n">{counts.category[c.slug] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="fgroup" style={{ marginTop: 26 }}>
        <p className="fgroup__title">Price</p>
        <PriceRange value={filters.price} onChange={(price) => setFilters((f) => ({ ...f, price }))} />
      </div>

      <div className="fgroup" style={{ marginTop: 26 }}>
        <p className="fgroup__title">Finish</p>
        {MATERIALS.map((m) => (
          <button
            key={m.id}
            className={`fopt ${filters.materials.includes(m.id) ? 'is-on' : ''}`}
            onClick={() => toggle('materials', m.id)}
          >
            <span className="fopt__box">{filters.materials.includes(m.id) && <IconCheck size={11} />}</span>
            {m.label}
          </button>
        ))}
      </div>

      <div className="fgroup" style={{ marginTop: 26 }}>
        <p className="fgroup__title">More</p>
        {TAGS.map((t) => (
          <button key={t.id} className={`fopt ${filters.tags.includes(t.id) ? 'is-on' : ''}`} onClick={() => toggle('tags', t.id)}>
            <span className="fopt__box">{filters.tags.includes(t.id) && <IconCheck size={11} />}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="fgroup" style={{ marginTop: 26 }}>
        <p className="fgroup__title">Designed by</p>
        {[...new Set(products.map((p) => p.studio))].map((s) => (
          <button key={s} className={`fopt ${filters.makers.includes(s) ? 'is-on' : ''}`} onClick={() => toggle('makers', s)}>
            <span className="fopt__box">{filters.makers.includes(s) && <IconCheck size={11} />}</span>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const { state } = useStore()
  const catParam = params.get('category')
  const tagParam = params.get('sort')
  const qParam = params.get('q') ?? ''

  const [filters, setFilters] = useState({
    category: catParam,
    price: [PRICE_MIN, PRICE_MAX],
    materials: [],
    tags: tagParam === 'new' ? ['new'] : [],
    makers: [],
  })
  const [sort, setSort] = useState('featured')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterSheet, setFilterSheet] = useState(false)
  const [visible, setVisible] = useState(8)
  const sliderRef = useRef(null)
  const sortRef = useRef(null)
  useDragScroll(sliderRef)

  useEffect(() => {
    setFilters((f) => ({ ...f, category: catParam }))
  }, [catParam])

  useEffect(() => {
    document.title = `${catParam ? categoryName(catParam) : 'Shop all'} · KAPAYA`
  }, [catParam])

  useEffect(() => {
    const close = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const setCategory = (slug) => {
    setFilters((f) => ({ ...f, category: slug }))
    const next = new URLSearchParams(params)
    if (slug) next.set('category', slug)
    else next.delete('category')
    setParams(next, { replace: true })
    setVisible(8)
  }

  const counts = useMemo(() => ({
    category: Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length])),
  }), [])

  const filtered = useMemo(() => {
    const search = qParam.trim().toLowerCase()
    let list = products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false
      if (p.price < filters.price[0] || p.price > filters.price[1]) return false
      if (filters.materials.length) {
        const mats = MATERIALS.filter((m) => filters.materials.includes(m.id))
        const hay = `${p.materials} ${p.blurb}`
        if (!mats.some((m) => m.match.test(hay))) return false
      }
      if (filters.tags.length && !filters.tags.every((t) => (p.tags ?? []).includes(t))) {
        const isSale = p.compareAt != null
        if (filters.tags.includes('sale') && isSale) {
          /* allow */
        } else return false
      }
      if (filters.makers.length && !filters.makers.includes(p.studio)) return false
      if (search) {
        if (/under\s*[\d,]/.test(search)) {
          const max = Number(search.match(/under\s*([\d,]+)/)[1].replace(/,/g, ''))
          if (p.price > max) return false
          const rest = search.replace(/under\s*[\d,]+/, '').trim()
          if (rest && !matchesQuery(haystack(p), rest)) return false
        } else if (!matchesQuery(haystack(p), search)) return false
      }
      return true
    })

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'new') list = [...list].sort((a, b) => (b.tags?.includes('new') ? 1 : 0) - (a.tags?.includes('new') ? 1 : 0))
    return list
  }, [filters, sort, qParam])

  const activeCount =
    (filters.category ? 1 : 0) +
    filters.materials.length +
    filters.tags.length +
    filters.makers.length +
    (filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX ? 1 : 0)

  const clearAll = () => {
    setFilters({ category: null, price: [PRICE_MIN, PRICE_MAX], materials: [], tags: [], makers: [] })
    setParams({}, { replace: true })
  }

  const shown = filtered.slice(0, visible)

  return (
    <div>
      <div className="shop-head">
        <div className="shell">
          <div className="shop-head__top">
            <div>
              <p className="eyebrow">
                <span className="dot" />
                <Link to="/" className="underline-link">
                  Home
                </Link>{' '}
                / {qParam ? 'Search' : 'Shop'}
              </p>
              <h1>
                {qParam ? (
                  <>
                    <em>“{qParam}”</em>
                  </>
                ) : filters.category ? (
                  <>
                    {categoryName(filters.category)}.
                  </>
                ) : (
                  <>
                    All products.
                  </>
                )}
              </h1>
            </div>
            <div className="shop-head__meta">
              <div className="shop-head__count">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </div>
              <div>{qParam ? 'Matching your search' : 'In stock and ready to ship'}</div>
              <div className="shop-head__folio">Free shipping over $100</div>
            </div>
          </div>

          <div className="cat-slider-wrap">
            <div className="cat-slider-fade cat-slider-fade--l" />
            <div className="cat-slider-fade cat-slider-fade--r" />
            <button className="cat-slider-btn cat-slider-btn--l" onClick={() => sliderRef.current?.scrollBy({ left: -260, behavior: 'smooth' })} aria-label="Scroll categories left">
              <IconChevronRight size={15} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button className="cat-slider-btn cat-slider-btn--r" onClick={() => sliderRef.current?.scrollBy({ left: 260, behavior: 'smooth' })} aria-label="Scroll categories right">
              <IconChevronRight size={15} />
            </button>
            <div className="cat-slider" ref={sliderRef} role="tablist" aria-label="Product categories">
              <button className={`cat-tab ${!filters.category ? 'is-on' : ''}`} onClick={() => setCategory(null)} role="tab" aria-selected={!filters.category}>
                All products <span className="cat-tab__n">{products.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  className={`cat-tab ${filters.category === c.slug ? 'is-on' : ''}`}
                  onClick={() => setCategory(c.slug)}
                  role="tab"
                  aria-selected={filters.category === c.slug}
                >
                  <img src={c.image} alt="" />
                  {c.name}
                  <span className="cat-tab__n">{counts.category[c.slug]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="shop-toolbar">
          <div className="shop-toolbar__filters">
            <button className="tool-btn mob-only" onClick={() => setFilterSheet(true)}>
              <IconSliders size={15} /> Filters
              {activeCount > 0 && <span className="tool-btn__n">{activeCount}</span>}
            </button>
            <span className="result-note desk-only">
              Showing {shown.length} of {filtered.length}
            </span>
            {activeCount > 0 && (
              <button className="tool-btn" onClick={clearAll}>
                <IconClose size={13} /> Clear
              </button>
            )}
          </div>

          <div className="row gap-12">
            <button className="tool-btn tool-btn--refine" onClick={() => setFilterSheet(true)}>
              <IconFilter size={15} /> <span className="desk-only">Refine</span>
            </button>
            <div className="sort-wrap" ref={sortRef}>
              <button className="tool-btn" onClick={() => setSortOpen((o) => !o)} aria-expanded={sortOpen} aria-haspopup="listbox">
                <span className="faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Sort
                </span>
                {SORTS.find((s) => s.id === sort).label}
                <IconChevronDown size={14} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
              </button>
              {sortOpen && (
                <div className="sort-menu" role="listbox">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      className={sort === s.id ? 'is-on' : ''}
                      onClick={() => {
                        setSort(s.id)
                        setSortOpen(false)
                      }}
                      role="option"
                      aria-selected={sort === s.id}
                    >
                      {s.label} {sort === s.id && <IconCheck size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="active-filters">
            {filters.category && (
              <button className="tag-clear" onClick={() => setCategory(null)}>
                {categoryName(filters.category)} <IconClose size={12} />
              </button>
            )}
            {filters.materials.map((m) => (
              <button key={m} className="tag-clear" onClick={() => setFilters((f) => ({ ...f, materials: f.materials.filter((x) => x !== m) }))}>
                {MATERIALS.find((x) => x.id === m)?.label} <IconClose size={12} />
              </button>
            ))}
            {filters.tags.map((t) => (
              <button key={t} className="tag-clear" onClick={() => setFilters((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}>
                {TAGS.find((x) => x.id === t)?.label} <IconClose size={12} />
              </button>
            ))}
            {filters.makers.map((m) => (
              <button key={m} className="tag-clear" onClick={() => setFilters((f) => ({ ...f, makers: f.makers.filter((x) => x !== m) }))}>
                {m} <IconClose size={12} />
              </button>
            ))}
            {(filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX) && (
              <button
                className="tag-clear"
                onClick={() => setFilters((f) => ({ ...f, price: [PRICE_MIN, PRICE_MAX] }))}
              >
                {formatTZS(filters.price[0])} – {formatTZS(filters.price[1])} <IconClose size={12} />
              </button>
            )}
            {qParam && (
              <button className="tag-clear" onClick={() => setParams({}, { replace: true })}>
                “{qParam}” <IconClose size={12} />
              </button>
            )}
          </div>
        )}

        <div className="shop-body">
          <aside className="filters-side" aria-label="Filters">
            <FiltersPanel filters={filters} setFilters={setFilters} counts={counts} />
            <button className="btn btn--ghost btn--sm" onClick={clearAll} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              Reset all
            </button>
          </aside>

          <div className="shop-main">
            {filtered.length === 0 ? (
              <Empty
                icon={<IconSearch size={22} />}
                title="Nothing in this corner yet"
                body="Your filters are a little too specific. Try widening the price range or clearing a material."
                action={
                  <button className="btn btn--ghost btn--sm" onClick={clearAll} style={{ marginTop: 8 }}>
                    Clear all filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="plp-grid">
                  {shown.map((p, i) => (
                    <ProductCard key={p.slug} product={p} index={i} />
                  ))}
                </div>
                {visible < filtered.length && (
                  <div className="load-more">
                    <button className="btn btn--ghost" onClick={() => setVisible((v) => v + 8)}>
                      Load more products ({filtered.length - visible} left)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* mobile filter sheet */}
        <Sheet open={filterSheet} onClose={() => setFilterSheet(false)} title="Refine" labelledBy="filter-title">
          <div style={{ padding: '20px 22px 110px' }}>
            <FiltersPanel filters={filters} setFilters={setFilters} counts={counts} />
          </div>
          <div className="sheet-footer">
            <button className="btn btn--ghost" onClick={clearAll}>
              Reset
            </button>
            <button className="btn" onClick={() => setFilterSheet(false)}>
              Show all {filtered.length} products
            </button>
          </div>
        </Sheet>
      </div>
    </div>
  )
}
