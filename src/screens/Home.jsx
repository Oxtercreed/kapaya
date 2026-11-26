import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, formatTZS } from '../store'
import { products, categories, journal, BRAND } from '../data/catalog'
import { ProductCard, SectionHead, Stars } from '../components/ui'
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

function Rail({ children }) {
  const ref = useRef(null)
  const [state, setState] = useState({ left: true, right: false })

  const update = () => {
    const el = ref.current
    if (!el) return
    setState({
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
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.78, 700), behavior: 'smooth' })
  }

  return (
    <>
      <div className="rail-nav">
        <button className="rail-btn" onClick={() => nudge(-1)} disabled={state.left} aria-label="Previous">
          <IconArrowLeft size={16} />
        </button>
        <button className="rail-btn" onClick={() => nudge(1)} disabled={state.right} aria-label="Next">
          <IconArrowRight size={16} />
        </button>
      </div>
      <div className="rail" ref={ref} style={{ marginTop: 24 }}>
        {children}
      </div>
    </>
  )
}

export default function Home() {
  const { state, dispatch, toast } = useStore()
  const [email, setEmail] = useState('')
  const newest = [...products].slice(0, 6)
  const best = products.filter((p) => ['p-sona', 'p-terra', 'p-halcyon', 'p-zanzu', 'p-kauri'].includes(p.id))

  useEffect(() => {
    document.title = 'KAPAYA — Objects for a slower home'
  }, [])

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero__frame">
          <div className="hero__media">
            <img src="/images/hero-salon.jpg" alt="A calm, sunlit room with handmade ceramics and woven textiles" />
          </div>
          <div className="hero__content">
            <p className="eyebrow hero__eyebrow">
              <span className="dot" /> Autumn collection · 2026
            </p>
            <h1 className="hero__title">
              <span className="line">
                <span style={{ animationDelay: '0.25s' }}>The art of</span>
              </span>
              <span className="line">
                <span style={{ animationDelay: '0.38s' }}>
                  <em>slow living</em>
                </span>
              </span>
              <span className="line">
                <span style={{ animationDelay: '0.51s' }}>made by hand.</span>
              </span>
            </h1>
            <p className="hero__sub">
              Ceramics, textiles and furniture from independent makers across East Africa — chosen for how they
              age, not how they photograph.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--paper">
                Shop the collection <IconArrowRight size={16} />
              </Link>
              <Link to="/makers" className="btn btn--ghost">
                Meet the makers
              </Link>
            </div>
          </div>

          <div className="hero__aside">
            <div className="hero__badge">
              Handmade
              <br />
              in small
              <br />
              batches
            </div>
            <span className="hero__scroll">
              <i /> Scroll to explore
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BAR ---------------- */}
      <div className="trustbar">
        <div className="shell trustbar__inner">
          <span className="trustbar__item">
            <IconTruck size={16} /> Free delivery over TZS 500,000
          </span>
          <span className="trustbar__item">
            <IconLeaf size={16} /> Natural, low-impact materials
          </span>
          <span className="trustbar__item">
            <IconSparkle size={16} /> Signed by the maker
          </span>
          <span className="trustbar__item">
            <IconReturn size={16} /> 14-day returns
          </span>
          <span className="trustbar__item">
            <IconShield size={16} /> Secure checkout
          </span>
        </div>
      </div>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="section">
        <div className="shell">
          <SectionHead
            kicker="Shop by material"
            title="Five ways to warm a room"
            action={
              <Link to="/collections" className="link-arrow">
                All collections <IconArrowRight size={15} />
              </Link>
            }
          />
          <div className="cat-rail" data-reveal>
            {categories.map((c) => (
              <Link key={c.slug} to={`/shop?category=${c.slug}`} className="cat-card">
                <img src={c.image} alt={c.name} loading="lazy" />
                <div className="cat-card__body">
                  <div className="cat-card__name">{c.name}</div>
                  <div className="cat-card__line">{c.line}</div>
                  <div className="cat-card__arrow">
                    <IconArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEW IN ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <SectionHead kicker="Just arrived" title="New in the studio" action={null} />
          <Rail>
            {newest.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </Rail>
        </div>
      </section>

      {/* ---------------- EDITORIAL BAND ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="editorial" data-reveal>
            <div className="editorial__img">
              <img src="/images/vase-sona.jpg" alt="A hand-thrown Sona vessel" loading="lazy" />
            </div>
            <div className="editorial__body">
              <p className="eyebrow">
                <span className="dot" /> The Sona story
              </p>
              <h2>Every rib is a record of the hand that made it.</h2>
              <p className="lede" style={{ fontSize: 14.5 }}>
                Amani throws each vessel on a kick wheel, carving the surface while the clay is still soft. The
                glaze is mixed from wood ash gathered from the studio’s own kiln — so no two Sona vessels share
                a surface.
              </p>
              <p className="editorial__sig">— Amani Mwinyi, Kibanda Clay Studio</p>
              <Link to="/product/sona-vessel" className="link-arrow" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                Meet the Sona Vessel <IconArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- BESTSELLERS ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <SectionHead
            kicker="Most loved"
            title="The pieces that keep coming back"
            action={
              <Link to="/shop" className="link-arrow">
                Shop all <IconArrowRight size={15} />
              </Link>
            }
          />
          <Rail>
            {best.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </Rail>
        </div>
      </section>

      {/* ---------------- COLLECTION TRIO ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="trio" data-reveal>
            <Link to="/shop?category=ceramics" className="tile">
              <img src="/images/bowl-ember.jpg" alt="Ember serving bowl" loading="lazy" />
              <div className="tile__body">
                <div className="tile__kicker">Collection 01</div>
                <div className="tile__title">Table, slowly set</div>
              </div>
            </Link>
            <Link to="/shop?category=textiles" className="tile">
              <img src="/images/rug-dune.jpg" alt="Dune wool rug" loading="lazy" />
              <div className="tile__body">
                <div className="tile__kicker">Collection 02</div>
                <div className="tile__title">Highland wool</div>
              </div>
            </Link>
            <Link to="/shop?category=lighting" className="tile">
              <img src="/images/pendant-halcyon.jpg" alt="Halcyon pendant" loading="lazy" />
              <div className="tile__body">
                <div className="tile__kicker">Collection 03</div>
                <div className="tile__title">Warm the evening</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- MAKERS ---------------- */}
      <section className="makers">
        <div className="shell">
          <p className="eyebrow" style={{ color: 'rgba(251,248,242,0.55)' }}>
            <span className="dot" style={{ background: 'var(--sand)' }} /> Our makers
          </p>
          <h2 style={{ marginTop: 12 }}>Four workshops. One shared patience.</h2>
          <div className="makers__grid">
            {[
              { name: 'Kibanda Clay Studio', place: 'Dar es Salaam, TZ', craft: 'Wheel-thrown stoneware, glazed in wood ash.' },
              { name: 'Zawadi Weave Studio', place: 'Nairobi, KE', craft: 'Handloomed linen and cotton on floor looms.' },
              { name: 'Halcyon Rattan', place: 'Zanzibar, TZ', craft: 'Steam-bent cane and open-weave lighting.' },
              { name: 'Mlango Woodwork', place: 'Arusha, TZ', craft: 'Joinery-first furniture in mvule and oak.' },
            ].map((m) => (
              <Link to="/makers" className="maker" key={m.name}>
                <div className="maker__name">{m.name}</div>
                <div className="maker__place">{m.place}</div>
                <p className="maker__craft">{m.craft}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- JOURNAL ---------------- */}
      <section className="section">
        <div className="shell">
          <SectionHead
            kicker="From the journal"
            title="Notes on making and keeping"
            action={
              <Link to="/journal" className="link-arrow">
                Read the journal <IconArrowRight size={15} />
              </Link>
            }
          />
          <div className="journal-row">
            {journal.map((j, i) => (
              <Link to="/journal" key={j.slug} className="jcard" data-reveal style={{ '--d': `${i * 90}ms` }}>
                <div className="jcard__media">
                  <img src={j.image} alt={j.title} loading="lazy" />
                </div>
                <p className="eyebrow">
                  <span className="dot" /> {j.kicker} · {j.read}
                </p>
                <h3>{j.title}</h3>
                <p>{j.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- UGC ---------------- */}
      <section style={{ paddingBottom: 0 }}>
        <div className="shell" style={{ marginBottom: 18 }}>
          <div className="row between wrap gap-12">
            <p className="eyebrow" style={{ margin: 0 }}>
              <span className="dot" /> @kapayastudio
            </p>
            <span className="tiny-meta">Photographed by our customers</span>
          </div>
        </div>
        <div className="ugc">
          {[
            '/images/hero-salon.jpg',
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

      {/* ---------------- SERVICES ---------------- */}
      <section className="section-tight" style={{ paddingTop: 46 }}>
        <div className="shell services">
          <div className="service">
            <IconTruck size={20} />
            <h4>Same-day in Dar</h4>
            <p>Order before noon and we’ll bring it over ourselves.</p>
          </div>
          <div className="service">
            <IconLeaf size={20} />
            <h4>Made to last</h4>
            <p>Natural materials, small batches, repairable by design.</p>
          </div>
          <div className="service">
            <IconChat size={20} />
            <h4>Ask the studio</h4>
            <p>A real person answers — usually within the hour.</p>
          </div>
          <div className="service">
            <IconReturn size={20} />
            <h4>14-day returns</h4>
            <p>Not right for the room? Send it back, no fuss.</p>
          </div>
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="section-tight">
        <div className="shell">
          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: 'clamp(34px, 5vw, 64px)',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 28,
              alignItems: 'end',
            }}
            className="newsletter"
          >
            <div>
              <p className="eyebrow">
                <span className="dot" /> Studio letters
              </p>
              <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 42px)', marginTop: 10, maxWidth: '22ch' }}>
                Slow news: new batches, studio visits, one good recipe.
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!email.includes('@')) return toast('Please enter a valid email address')
                setEmail('')
                toast('Karibu — your welcome note is on its way.')
              }}
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
            >
              <input
                className="input"
                style={{ minWidth: 220, width: 'auto', flex: 1 }}
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="btn" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
