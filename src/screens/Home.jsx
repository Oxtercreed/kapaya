import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { products, categories, journal } from '../data/catalog'
import { ProductCard } from '../components/ui'
import {
  IconArrowRight,
  IconArrowLeft,
  IconTruck,
  IconShield,
  IconReturn,
  IconSparkle,
  IconChat,
} from '../components/Icons'

/* ------------------------------------------------------------
   Horizontal rail with paging controls
   ------------------------------------------------------------ */
function RailSection({ kicker, title, action, children }) {
  const ref = useRef(null)
  const [edge, setEdge] = useState({ left: true, right: false })

  const update = () => {
    const el = ref.current
    if (!el) return
    setEdge({
      left: el.scrollLeft < 8,
      right: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    })
  }

  useEffect(() => {
    update()
    const el = ref.current
    el?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const nudge = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 880), behavior: 'smooth' })
  }

  return (
    <section className="section" style={{ paddingBottom: 24 }}>
      <div className="sec-head">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2 className="sec-head__title">{title}</h2>
        </div>
        <div className="row gap-12 wrap" style={{ alignItems: 'center' }}>
          {action}
          <div className="rail-nav">
            <button
              className="rail-btn"
              onClick={() => nudge(-1)}
              disabled={edge.left}
              aria-label="Previous"
              style={edge.left ? { opacity: 0.4 } : undefined}
            >
              <IconArrowLeft size={16} />
            </button>
            <button
              className="rail-btn"
              onClick={() => nudge(1)}
              disabled={edge.right}
              aria-label="Next"
              style={edge.right ? { opacity: 0.4 } : undefined}
            >
              <IconArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="rail" ref={ref}>
        {children}
      </div>
    </section>
  )
}

export default function Home() {
  const { state } = useStore()
  const [cat, setCat] = useState('all')

  useEffect(() => {
    document.title = 'VOLTA — Good tech. Better everyday.'
  }, [])

  const first = state.user.firstName

  const rail = cat === 'all' ? products : products.filter((p) => p.category === cat)
  const featured = products.filter((p) => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 4)
  const hero = products[0]

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="shell">
          <div className="hero__frame">
            <div className="hero__content">
              <span className="hero__eyebrow">
                <IconSparkle size={13} /> New · Slate Keyboard
              </span>
              <h1 className="hero__title">
                Good tech.
                <br />
                <em>Better</em> everyday.
              </h1>
              <p className="hero__sub">
                Thoughtful design. Tech you’ll actually love. Audio, wearables and desk
                tools chosen for the hours you spend with them — nothing that needs a manual.
              </p>
              <div className="hero__actions">
                <Link className="btn" to="/shop">
                  Shop all products <IconArrowRight size={16} />
                </Link>
                <Link className="btn btn--ghost" to={`/product/${hero.slug}`}>
                  Aurora Buds Pro
                </Link>
              </div>
            </div>
            <div className="hero__media">
              <img src="/images/v-buds.jpg" alt="Aurora Buds Pro in its charging case" />
            </div>
          </div>

          <div className="trustbar">
            <div className="trustbar__inner">
              <span className="trustbar__item">
                <IconTruck size={17} /> Free shipping over $100
              </span>
              <span className="trustbar__item">
                <IconReturn size={17} /> 30-day returns
              </span>
              <span className="trustbar__item">
                <IconShield size={17} /> 2-year warranty
              </span>
              <span className="trustbar__item">
                <IconChat size={17} /> Real people, same day
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="shell">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Browse</p>
              <h2 className="sec-head__title">Shop by category</h2>
            </div>
            <Link className="link-arrow" to="/shop">
              All products <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="cat-rail">
            {categories.map((c) => (
              <Link className="cat-card" key={c.slug} to={`/shop?category=${c.slug}`}>
                <img src={c.image} alt={c.name} loading="lazy" />
                <div className="cat-card__body">
                  <h3 className="cat-card__name">{c.name}</h3>
                  <span className="cat-card__line">{c.line}</span>
                </div>
                <span className="cat-card__arrow">
                  <IconArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED RAIL ============ */}
      <div className="shell">
        <RailSection
          kicker={`Welcome back, ${first}`}
          title="Find your next everyday essential"
          action={
            <Link className="link-arrow" to="/shop">
              View all <IconArrowRight size={14} />
            </Link>
          }
        >
          {rail.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </RailSection>
      </div>

      {/* ============ EDITORIAL BAND ============ */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="shell">
          <div className="editorial">
            <div className="editorial__img">
              <img src="/images/v-desk.jpg" alt="A quiet desk setup" loading="lazy" />
            </div>
            <div className="editorial__body">
              <p className="eyebrow" style={{ color: 'var(--violet-4)' }}>
                The VOLTA Standard
              </p>
              <h2>We only ship a product once we would keep it.</h2>
              <p>
                Every piece is prototyped in the studio, lived with for at least six weeks, and
                tuned against real rooms and real commutes before it goes on sale. If it starts to
                annoy us, it does not ship.
              </p>
              <span className="editorial__sig">Zawadi Mwangi · Studio lead</span>
              <Link className="btn" to="/makers">
                About VOLTA <IconArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BESTSELLERS ============ */}
      <div className="shell">
        <RailSection
          kicker="Most wanted"
          title={cat === 'all' ? 'Bestsellers' : `${categories.find((c) => c.slug === cat)?.name}`}
          action={
            <div className="row gap-8">
              {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
                <button
                  key={c.slug}
                  className={`chip chip--sm ${cat === c.slug ? 'is-on' : ''}`}
                  onClick={() => setCat(c.slug)}
                  aria-pressed={cat === c.slug}
                >
                  {c.name}
                </button>
              ))}
            </div>
          }
        >
          {(cat === 'all' ? featured : rail.slice(0, 4)).map((p, i) => (
            <ProductCard key={`b-${p.slug}`} product={p} index={i} />
          ))}
        </RailSection>
      </div>

      {/* ============ JOURNAL ============ */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="shell">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Journal</p>
              <h2 className="sec-head__title">Notes from the studio</h2>
            </div>
            <Link className="link-arrow" to="/journal">
              Read the journal <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="journal-row">
            {journal.map((j) => (
              <Link className="jcard" key={j.slug} to={`/journal/${j.slug}`}>
                <div className="jcard__media">
                  <img src={j.image} alt="" loading="lazy" />
                </div>
                <div className="jcard__body">
                  <p className="eyebrow">{j.kicker}</p>
                  <h3>{j.title}</h3>
                  <p>{j.excerpt}</p>
                  <span className="link-arrow" style={{ marginTop: 4 }}>
                    {j.read} <IconArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="services">
            <div className="service">
              <IconTruck size={20} />
              <h3>Free shipping over $100</h3>
              <p>Express is next working day for $12. Standard is 3–5 days and free over $100.</p>
            </div>
            <div className="service">
              <IconReturn size={20} />
              <h3>30-day returns</h3>
              <p>Opened or not. A prepaid label, collected from your door, no questions.</p>
            </div>
            <div className="service">
              <IconChat size={20} />
              <h3>Talk to a person</h3>
              <p>
                Zawadi and the team answer in the chat, weekdays, usually within the hour.{' '}
                <Link to="/chat" style={{ color: 'var(--violet)' }}>
                  Start a chat
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
