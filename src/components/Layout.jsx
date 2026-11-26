import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore, formatTZS } from '../store'
import { categories, products, BRAND } from '../data/catalog'
import {
  IconSearch,
  IconBag,
  IconUser,
  IconChat,
  IconMenu,
  IconClose,
  IconChevronRight,
  IconArrowRight,
  IconCheck,
  IconSparkle,
} from './Icons'
import { SearchBox, Sheet, Toasts } from './ui'
import { buildIndex, searchProducts } from '../lib/search'

/* ============================================================
   Announcement marquee
   ============================================================ */
function Announce() {
  const items = [
    'Good tech. Better everyday.',
    'Free shipping on orders $100+',
    'New in: Slate Mechanical Keyboard',
    '30-day returns, two-year warranty',
  ]
  return (
    <div className="announce" aria-hidden="true">
      <div className="announce__track">
        {[0, 1].map((k) => (
          <div key={k} style={{ display: 'flex' }}>
            {items.map((t) => (
              <span className="announce__item" key={t + k}>
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Search overlay
   ============================================================ */
function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const { state, dispatch } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (open) setQ('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const index = useMemo(() => buildIndex(products), [])
  const results = useMemo(() => searchProducts(index, q, 6), [index, q])

  const submit = (term) => {
    if (!term.trim()) return
    dispatch({ type: 'search', q: term.trim() })
    onClose()
    navigate(`/shop?q=${encodeURIComponent(term.trim())}`)
  }

  if (!open) return null

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search-overlay__scrim" onClick={onClose} />
      <div className="search-panel">
        <div className="search-panel__inner">
          <div className="search-panel__row">
            <SearchBox value={q} onChange={setQ} onSubmit={submit} autoFocus size="lg" placeholder="Search audio, wearables, desk…" />
            <button className="icon-btn" onClick={onClose} aria-label="Close search">
              <IconClose size={22} />
            </button>
          </div>

          {!q && (
            <>
              {state.recentSearches.length > 0 && (
                <div>
                  <p className="search-group-label">Recent</p>
                  <div className="search-chips">
                    {state.recentSearches.map((s) => (
                      <button key={s} className="chip chip--soft" onClick={() => setQ(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="search-group-label">Popular right now</p>
                <div className="search-chips">
                  {['Wireless earbuds', 'Noise cancelling', 'Desk lamp', 'Under $60', 'New arrivals'].map((s) => (
                    <button key={s} className="chip" onClick={() => setQ(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="search-group-label">Categories</p>
                <div className="search-chips">
                  {categories.map((c) => (
                    <Link key={c.slug} className="chip" to={`/shop?category=${c.slug}`} onClick={onClose}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {q && results.length > 0 && (
            <div>
              <div className="row between" style={{ marginBottom: 12 }}>
                <p className="search-group-label" style={{ margin: 0 }}>
                  {results.length} {results.length === 1 ? 'piece' : 'pieces'} found
                </p>
                <button className="link-arrow" onClick={() => submit(q)}>
                  View all <IconArrowRight size={14} />
                </button>
              </div>
              <div className="search-results">
                {results.map((p) => (
                  <Link key={p.slug} to={`/product/${p.slug}`} className="search-hit" onClick={onClose}>
                    <img src={p.images[0]} alt="" />
                    <div>
                      <div className="search-hit__t">{p.name}</div>
                      <div className="search-hit__p mono">{formatTZS(p.price)}</div>
                      <div className="search-hit__p">{p.studio}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {q && results.length === 0 && (
            <div className="search-empty">
              <p style={{ margin: '0 0 6px', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: 20 }}>
                Nothing matches “{q}” yet.
              </p>
              <p style={{ margin: 0 }}>
                Try “vase”, “throw”, “rattan” — or{' '}
                <Link to="/chat" onClick={onClose} className="underline-link">
                  ask the studio directly
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Header
   ============================================================ */
function Header({ onSearch, onMenu }) {
  const { cart, state } = useStore()
  const [stuck, setStuck] = useState(false)
  const [bump, setBump] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const loc = useLocation()
  const prevCount = useRef(cart.count)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (cart.count > prevCount.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 600)
      return () => clearTimeout(t)
    }
    prevCount.current = cart.count
  }, [cart.count])

  useEffect(() => { prevCount.current = cart.count }, [cart.count])

  const unread = state.notifications.filter((n) => !n.read).length

  return (
    <>
      <Announce />
      <header className={`header ${stuck ? 'is-stuck' : ''}`}>
        <div className="shell header__bar">
          <div className="header__left">
            <button className="icon-btn mob-only" onClick={onMenu} aria-label="Open menu">
              <IconMenu size={21} />
            </button>
            <nav className="nav-links desk-only" aria-label="Main">
              <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                Shop
              </NavLink>
              <NavLink to="/collections" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                Collections
              </NavLink>
              <NavLink to="/journal" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                Journal
              </NavLink>
              <NavLink to="/makers" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                Our makers
              </NavLink>
            </nav>
          </div>

          <Link to="/" className="wordmark" aria-label="VOLTA home">
            VOLTA
          </Link>

          <div className="header__right">
            <div className="header__tools">
              <button className="icon-btn" onClick={onSearch} aria-label="Search">
                <IconSearch size={20} />
              </button>
              <Link
                to="/chat"
                className="icon-btn"
                aria-label={`Chat with us${unread ? `, ${unread} unread` : ''}`}
              >
                <IconChat size={20} />
                {unread > 0 && <span className="badge-dot">{unread}</span>}
              </Link>
              <Link to="/account" className="icon-btn desk-only" aria-label="Account">
                <IconUser size={20} />
              </Link>
              <Link to="/cart" className="icon-btn" aria-label={`Bag, ${cart.count} items`}>
                <IconBag size={20} />
                {cart.count > 0 && <span className={`cart-count ${bump ? 'is-bump' : ''}`}>{cart.count}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

/* ============================================================
   Mobile tab bar
   ============================================================ */
function TabBar() {
  const { cart, state } = useStore()
  const loc = useLocation()
  const unread = state.notifications.filter((n) => !n.read).length
  const items = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/shop', label: 'Shop', icon: 'shop' },
    { to: '/chat', label: 'Chat', icon: 'chat', badge: unread },
    { to: '/cart', label: 'Bag', icon: 'bag', badge: cart.count },
    { to: '/account', label: 'Account', icon: 'user' },
  ]
  const active = (to) => (to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to))

  return (
    <nav className="tabbar" aria-label="Mobile navigation">
      {items.map((it) => (
        <Link key={it.to} to={it.to} className={`tab ${active(it.to) ? 'is-active' : ''}`}>
          {it.icon === 'home' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1Z" />
            </svg>
          )}
          {it.icon === 'shop' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9h16l-1.2 10a1.5 1.5 0 0 1-1.5 1.3H6.7A1.5 1.5 0 0 1 5.2 19Z" />
              <path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2" />
            </svg>
          )}
          {it.icon === 'chat' && <IconChat size={20} />}
          {it.icon === 'bag' && <IconBag size={20} />}
          {it.icon === 'user' && <IconUser size={20} />}
          <span>{it.label}</span>
          {it.badge > 0 && <span className="tab__badge">{it.badge}</span>}
        </Link>
      ))}
    </nav>
  )
}

/* ============================================================
   Mobile drawer menu
   ============================================================ */
function MobileMenu({ open, onClose }) {
  const { state } = useStore()
  return (
    <Sheet open={open} onClose={onClose} title="VOLTA" side="left" width={360} labelledBy="menu-title">
      <div className="mmenu">
        <Link to="/shop" onClick={onClose}>
          Shop all <IconChevronRight size={18} />
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} to={`/shop?category=${c.slug}`} onClick={onClose} style={{ fontSize: 17 }}>
            {c.name} <IconChevronRight size={16} />
          </Link>
        ))}
        <Link to="/collections" onClick={onClose}>
          Collections <IconChevronRight size={18} />
        </Link>
        <Link to="/journal" onClick={onClose}>
          Journal <IconChevronRight size={18} />
        </Link>
        <Link to="/makers" onClick={onClose}>
          Our makers <IconChevronRight size={18} />
        </Link>
        <Link to="/account" onClick={onClose}>
          Account <IconChevronRight size={18} />
        </Link>
        <Link to="/chat" onClick={onClose}>
          Chat with us <IconChevronRight size={18} />
        </Link>
        <div className="mmenu__sub">
          <span className="eyebrow">
            <span className="dot" /> {BRAND.city}
          </span>
          <a href={`mailto:${BRAND.email}`} className="underline-link">
            {BRAND.email}
          </a>
          <span>{BRAND.hours}</span>
        </div>
      </div>
    </Sheet>
  )
}

/* ============================================================
   Footer
   ============================================================ */
function Footer() {
  const { toast } = useStore()
  const [email, setEmail] = useState('')
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="wordmark">
              VOLTA
            </Link>
            <p className="footer__tag">Good tech. Better everyday.</p>
            <p style={{ fontSize: 13, maxWidth: '34ch', margin: '0 0 4px' }}>
              A small hardware studio in {BRAND.city}, building quiet technology for everyday life.
            </p>
            <form
              className="footer__news"
              onSubmit={(e) => {
                e.preventDefault()
                if (!email.includes('@')) return toast('Please enter a valid email address', { tone: 'warn' })
                setEmail('')
                toast('Thanks — check your inbox for a welcome note.')
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for product notes"
                aria-label="Email address"
              />
              <button className="btn btn--sm btn--paper" type="submit">
                Join
              </button>
            </form>
          </div>

          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop?category=${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/shop?sort=new">New arrivals</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/makers">About VOLTA</Link>
              </li>
              <li>
                <Link to="/journal">Journal</Link>
              </li>
              <li>
                <Link to="/collections">Collections</Link>
              </li>
              <li>
                <Link to="/chat">Chat with us</Link>
              </li>
              <li>
                <Link to="/account/help">Care &amp; help</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Visit</h4>
            <ul>
              <li>{BRAND.address}</li>
              <li>{BRAND.hours}</li>
              <li>
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </li>
              <li>
                <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} VOLTA Labs Ltd · Dar es Salaam, Tanzania</span>
          <div className="footer__legal">
            <span>Shipping</span>
            <span>Returns</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   Layout
   ============================================================ */
export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [loc.pathname, loc.search])

  return (
    <>
      <Header onSearch={() => setSearchOpen(true)} onMenu={() => setMenuOpen(true)} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <TabBar />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Toasts />
    </>
  )
}
