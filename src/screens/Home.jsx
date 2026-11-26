import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { products, categories, journal } from '../data/catalog'
import { ProductCard } from '../components/ui'
import {
  IconArrowRight,
  IconArrowLeft,
  IconLeaf,
  IconTruck,
  IconShield,
  IconReturn,
  IconSparkle,
  IconChat,
} from '../components/Icons'

/* ---------- horizontal plate rail with editorial header ---------- */
function RailSection({ folio, title, action, children }) {
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
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.82, 860), behavior: 'smooth' })
  }

  return (
    <>
      <div className="m-railhead">
        <div>
          <p className="eyebrow" style={{ marginBottom: 12 }}>
            {folio}
          </p>
          <h2 className="m-railhead__title">{title}</h2>
        </div>
        <div className="m-railhead__meta">
          {action}
          <div className="m-rail-nav">
            <button onClick={() => nudge(-1)} disabled={edge.left} aria-label="Previous plates">
              <IconArrowLeft size={15} />
            </button>
            <button onClick={() => nudge(1)} disabled={edge.right} aria-label="More plates">
              <IconArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <div className="m-rail" ref={ref}>
        {children}
      </div>
    </>
  )
}

export default function Home() {
  const { toast } = useStore()
  const [email, setEmail] = useState('')
  const newest = products.slice(0, 6)
  const best = products.filter((p) => ['p-sona', 'p-terra', 'p-halcyon', 'p-zanzu', 'p-kauri'].includes(p.id))

  useEffect(() => {
    document.title = 'KAPAYA — Objects for a slower home'
  }, [])

  return (
    <div>
      {/* ================= MASTHEAD ================= */}
      <section className="m-hero">
        <div className="shell">
          <div className="m-hero__grid">
            <div className="m-hero__type">
              <div className="m-hero__topline">
                <span>Kapaya Studio — Dar es Salaam</span>
                <span className="mob-hide">Catalogue No. 07 · 2026</span>
              </div>

              <h1 className="m-hero__title">
                <span className="line">
                  <span style={{ animationDelay: '0.15s' }}>Objects for</span>
                </span>
                <span className="line">
                  <span style={{ animationDelay: '0.29s' }}>
                    a <em>slower</em>
                  </span>
                </span>
                <span className="line">
                  <span style={{ animationDelay: '0.43s' }}>home.</span>
                </span>
              </h1>

              <div className="m-hero__foot">
                <p className="m-hero__sub">
                  Ceramics, textiles and furniture from independent workshops across East Africa. Made in small
                  batches, signed by the maker, and chosen for how they age.
                </p>
                <div className="m-hero__actions">
                  <Link to="/shop" className="btn">
                    Shop the collection <IconArrowRight size={14} />
                  </Link>
                  <Link to="/collections" className="btn btn--ghost">
                    The catalogue
                  </Link>
                </div>
              </div>
            </div>

            <figure className="m-hero__media">
              <span className="m-hero__corner">Pl. I</span>
              <img
                src="/images/mono-hero.jpg"
                alt="Three hand-thrown stoneware vessels in hard afternoon light"
              />
              <figcaption className="m-hero__figcap">
                <span>Vessels — Kibanda Clay Studio</span>
                <span>Studio, Dar es Salaam</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ================= RUNNING STRIP ================= */}
      <div className="m-strip">
        <div className="shell">
          <div className="m-strip__inner">
            <span className="m-strip__item">
              <IconTruck size={14} /> Free delivery over TZS 500,000
            </span>
            <span className="m-strip__item">
              <IconLeaf size={14} /> Natural, low-impact materials
            </span>
            <span className="m-strip__item">
              <IconSparkle size={14} /> Signed by the maker
            </span>
            <span className="m-strip__item">
              <IconReturn size={14} /> 14-day returns
            </span>
            <span className="m-strip__item">
              <IconShield size={14} /> Secure checkout
            </span>
          </div>
        </div>
      </div>

      {/* ================= INDEX ================= */}
      <section className="m-index">
        <div className="shell">
          <div className="m-index__head">
            <h2>
              Five materials,
              <br />
              <em>one long tradition.</em>
            </h2>
            <Link to="/shop" className="link-arrow">
              Shop all pieces <IconArrowRight size={13} />
            </Link>
          </div>

          <div className="m-index__rows">
            {categories.map((c, i) => (
              <Link key={c.slug} to={`/shop?category=${c.slug}`} className="m-index__row">
                <span className="m-index__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="m-index__name">{c.name}</span>
                <span className="m-index__line">{c.line}</span>
                <span className="m-index__media">
                  <img src={c.image} alt="" loading="lazy" />
                </span>
                <span className="m-index__go">
                  <IconArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEW IN ================= */}
      <section>
        <div className="shell">
          <RailSection
            folio="Plates ii — vii · Just arrived"
            title="New in the studio"
            action={
              <Link to="/shop" className="link-arrow">
                Shop all <IconArrowRight size={13} />
              </Link>
            }
          >
            {newest.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </RailSection>
        </div>
      </section>

      {/* ================= FEATURE ================= */}
      <section className="m-feature">
        <div className="shell">
          <div className="m-feature__grid">
            <figure className="m-feature__media" style={{ margin: 0 }}>
              <span className="m-feature__folio">Pl. viii — The wheel</span>
              <img src="/images/mono-atelier.jpg" alt="Hands shaping a vessel on a kick wheel" loading="lazy" />
            </figure>
            <div className="m-feature__body">
              <p className="eyebrow">Amani Mwinyi · Kibanda Clay Studio</p>
              <blockquote className="m-feature__quote">
                “Every rib is a record of the hand that made it.”
              </blockquote>
              <p className="m-feature__text">
                Amani throws each vessel on a kick wheel, carving the surface while the clay is still soft. The
                glaze is mixed from wood ash gathered from the studio’s own kiln — so no two Sona vessels share a
                surface. Nothing is pressed, cast or hurried.
              </p>
              <span className="m-feature__sig">Dar es Salaam · Est. 2014 · 2 makers</span>
              <Link to="/product/sona-vessel" className="link-arrow" style={{ marginTop: 20 }}>
                The Sona Vessel <IconArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MOST KEPT ================= */}
      <section>
        <div className="shell">
          <RailSection folio="Plates ix — xiii · Most kept" title="The pieces that keep coming back">
            {best.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </RailSection>
        </div>
      </section>

      {/* ================= SPREAD ================= */}
      <section>
        <div className="shell">
          <div className="m-spread">
            <figure>
              <div className="m-spread__media">
                <img src="/images/mono-textile.jpg" alt="A handwoven linen throw folded over a bench" loading="lazy" />
              </div>
              <figcaption>
                <span>Pl. xiv — Zawadi linen, undyed</span>
                <span>Zawadi Weave Studio, Nairobi</span>
              </figcaption>
            </figure>
            <figure>
              <div className="m-spread__media">
                <img
                  src="/images/mono-objects.jpg"
                  alt="A stoneware cup, a stone candle holder and a folded linen napkin"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <span>Pl. xv — The quiet table</span>
                <span>Kibanda Clay Studio, Dar es Salaam</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ================= MAKERS ================= */}
      <section className="m-makers">
        <div className="shell">
          <div className="m-makers__head">
            <h2>
              Four workshops.
              <br />
              <em>One shared patience.</em>
            </h2>
            <Link to="/makers" className="link-arrow" style={{ color: 'var(--paper)' }}>
              Our makers <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="m-makers__grid">
            {[
              { name: 'Kibanda Clay Studio', place: 'Dar es Salaam, TZ', craft: 'Wheel-thrown stoneware, glazed in wood ash.' },
              { name: 'Zawadi Weave Studio', place: 'Nairobi, KE', craft: 'Handloomed linen and cotton on floor looms.' },
              { name: 'Halcyon Rattan', place: 'Zanzibar, TZ', craft: 'Steam-bent cane and open-weave lighting.' },
              { name: 'Mlango Woodwork', place: 'Arusha, TZ', craft: 'Joinery-first furniture in mvule and oak.' },
            ].map((m, i) => (
              <Link to="/makers" className="m-maker" key={m.name}>
                <span className="m-maker__n">{String(i + 1).padStart(2, '0')}</span>
                <div className="m-maker__name">{m.name}</div>
                <div className="m-maker__place">{m.place}</div>
                <p className="m-maker__craft">{m.craft}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOURNAL ================= */}
      <section>
        <div className="shell">
          <div className="m-railhead">
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>
                The journal
              </p>
              <h2 className="m-railhead__title">Notes on making and keeping</h2>
            </div>
            <div className="m-railhead__meta">
              <Link to="/journal" className="link-arrow">
                Read the journal <IconArrowRight size={13} />
              </Link>
            </div>
          </div>
          <div className="m-journal">
            {journal.slice(0, 3).map((j, i) => (
              <Link to="/journal" key={j.slug} className="m-journal__card">
                <div className="m-journal__num">
                  <span>No. {String(i + 1).padStart(2, '0')}</span>
                  <span>{j.read}</span>
                </div>
                <div className="m-journal__media">
                  <img src={j.image} alt={j.title} loading="lazy" />
                </div>
                <h3 className="m-journal__title">{j.title}</h3>
                <p className="m-journal__excerpt">{j.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PLATES (UGC) ================= */}
      <section>
        <div className="shell" style={{ marginBottom: 16 }}>
          <div className="split-head">
            <p className="eyebrow">@kapayastudio — photographed by our customers</p>
            <span className="eyebrow">Pl. xvi — xx</span>
          </div>
        </div>
        <div className="m-plates">
          {[
            '/images/mono-hero.jpg',
            '/images/mug-kauri.jpg',
            '/images/throw-terra.jpg',
            '/images/chair-obi.jpg',
            '/images/tray-ashlar.jpg',
          ].map((src) => (
            <div key={src}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section>
        <div className="shell">
          <div className="m-services" style={{ marginTop: 'clamp(40px, 5vw, 72px)' }}>
            <div className="m-service">
              <IconTruck size={18} />
              <h4>Same-day in Dar</h4>
              <p>Order before noon and we’ll bring it over ourselves.</p>
            </div>
            <div className="m-service">
              <IconLeaf size={18} />
              <h4>Made to last</h4>
              <p>Natural materials, small batches, repairable by design.</p>
            </div>
            <div className="m-service">
              <IconChat size={18} />
              <h4>Ask the studio</h4>
              <p>A real person answers — usually within the hour.</p>
            </div>
            <div className="m-service">
              <IconReturn size={18} />
              <h4>14-day returns</h4>
              <p>Not right for the room? Send it back, no fuss.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LETTER ================= */}
      <section>
        <div className="shell">
          <div className="m-letter">
            <div>
              <p className="eyebrow">Studio letters</p>
              <h2>
                Slow news: new batches, studio visits,
                <br />
                <em>one good recipe.</em>
              </h2>
            </div>
            <div>
              <form
                className="m-letter__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!email.includes('@')) return toast('Please enter a valid email address')
                  setEmail('')
                  toast('Karibu — your welcome note is on its way.')
                }}
              >
                <input
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button type="submit">
                  Subscribe <IconArrowRight size={13} />
                </button>
              </form>
              <p className="m-letter__note">One letter a month. No noise, no tracking pixels.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
