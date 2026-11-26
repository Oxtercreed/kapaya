import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStore, formatTZS } from '../store'
import { getProduct, addresses as seedAddresses, faqs, BRAND } from '../data/catalog'
import { Empty, ProductCard, Sheet, Accordion, Stars, TotalRow } from '../components/ui'
import {
  IconUser,
  IconBox,
  IconPin,
  IconCard,
  IconHeart,
  IconBell,
  IconShield,
  IconLogout,
  IconPencil,
  IconTrash,
  IconCheck,
  IconPlus,
  IconArrowRight,
  IconArrowLeft,
  IconChat,
  IconMail,
  IconPhone,
  IconLock,
  IconTag,
  IconTruck,
  IconReturn,
  IconLeaf,
  IconClose,
  IconArchive,
} from '../components/Icons'

const statusClass = (s) =>
  s === 'Delivered' ? 'order__status--delivered' : s === 'Processing' ? 'order__status--processing' : 'order__status--transit'
const statusIcon = (s) => (s === 'Delivered' ? <IconCheck size={11} /> : <IconTruck size={11} />)

/* ============================================================
   Shared shell
   ============================================================ */
export function AccountLayout() {
  const { state, dispatch, authed, setAuthed, cart, toast } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const unread = state.notifications.filter((n) => !n.read).length

  useEffect(() => {
    document.title = 'Your account · KAPAYA'
  }, [])

  const links = [
    { to: '/account', label: 'Overview', icon: <IconUser size={17} />, end: true },
    { to: '/account/orders', label: 'Orders', icon: <IconBox size={17} />, n: state.orders.filter((o) => o.status === 'In transit' || o.status === 'Processing').length },
    { to: '/account/saved', label: 'Saved pieces', icon: <IconHeart size={17} />, n: state.saved.length },
    { to: '/account/addresses', label: 'Addresses', icon: <IconPin size={17} /> },
    { to: '/account/payments', label: 'Payment methods', icon: <IconCard size={17} /> },
    { to: '/account/details', label: 'Account details', icon: <IconPencil size={17} /> },
    { to: '/account/notifications', label: 'Notifications', icon: <IconBell size={17} />, n: unread },
  ]

  return (
    <div className="shell">
      <div className="page-head" style={{ paddingBottom: 8 }}>
        <div className="split-head">
          <div>
            <p className="eyebrow">
              <span className="dot" /> Your studio
            </p>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              Karibu, {state.user.firstName}.
            </h1>
          </div>
          <div className="row gap-8" style={{ marginBottom: 8 }}>
            <Link to="/account/orders" className="btn btn--ghost btn--sm">
              <IconBox size={14} /> Track an order
            </Link>
            <Link to="/shop" className="btn btn--sm">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="acct">
        <nav className="acct__nav" aria-label="Account sections">
          <div className="acct__card">
            <span className="acct__avatar">
              {state.user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <div className="acct__hello">{state.user.firstName}</div>
              <div className="acct__tier">{state.user.tier} · {state.user.points} pts</div>
            </div>
          </div>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `acct__link ${isActive ? 'is-active' : ''}`}
            >
              {l.icon}
              {l.label}
              {l.n > 0 && <span className="n">{l.n}</span>}
            </NavLink>
          ))}
          <div className="acct__sub">
            <Link to="/account/help" className={`acct__link acct__link--sm ${loc.pathname === '/account/help' ? 'is-active' : ''}`}>
              <IconShield size={15} /> Care & help
            </Link>
            <Link to="/chat" className="acct__link acct__link--sm">
              <IconChat size={15} /> Chat with the studio
            </Link>
            <button
              className="acct__link acct__link--sm"
              onClick={() => {
                setAuthed(false)
                toast('Signed out. Your bag is still saved on this device.', { duration: 3000 })
                nav('/', { replace: true })
              }}
            >
              <IconLogout size={15} /> Sign out
            </button>
          </div>
        </nav>
        <div className="acct__body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Overview
   ============================================================ */
export function AccountHome() {
  const { state, cart, dispatch, toast } = useStore()
  const nav = useNavigate()
  const active = state.orders.find((o) => o.status === 'In transit' || o.status === 'Processing')
  const saved = state.saved.map(getProduct).filter(Boolean).slice(0, 2)

  return (
    <div className="stack gap-16">
      <div className="stat-grid">
        <div className="stat">
          <div className="stat__n">{state.orders.length}</div>
          <div className="stat__l">Orders placed</div>
        </div>
        <div className="stat">
          <div className="stat__n">{state.saved.length}</div>
          <div className="stat__l">Pieces saved</div>
        </div>
        <div className="stat">
          <div className="stat__n">{state.user.points.toLocaleString()}</div>
          <div className="stat__l">Studio points</div>
        </div>
      </div>

      {active && (
        <div className="panel">
          <div className="row between wrap gap-12">
            <div>
              <p className="eyebrow">
                <span className="dot" /> On its way
              </p>
              <h3 style={{ marginTop: 8 }}>Order {active.id}</h3>
              <p className="panel__hint" style={{ marginBottom: 0 }}>
                {active.eta} · {active.delivery}
              </p>
            </div>
            <span className="order__status order__status--transit">
              <IconTruck size={12} /> {active.status}
            </span>
          </div>
          <div className="tracker">
            {['Confirmed', 'Packed', 'In transit', 'Delivered'].map((s, i) => (
              <div
                className={`track-step ${i < ({ Processing: 1, Packed: 2, 'In transit': 3, Delivered: 4 }[active.status] ?? 2) ? 'is-done' : ''}`}
                key={s}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="row between wrap gap-12" style={{ marginTop: 12 }}>
            <div className="order__thumbs">
              {active.items.map((it, i) => {
                const p = getProduct(it.slug)
                return p ? <img key={i} src={p.images[0]} alt="" /> : null
              })}
            </div>
            <Link to={`/account/orders/${active.id}`} className="btn btn--ghost btn--sm">
              View order <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="row between wrap gap-12">
          <div>
            <h3>Your pieces</h3>
            <p className="panel__hint">Saved for later — we’ll hold nothing, but we’ll remember.</p>
          </div>
          <Link to="/account/saved" className="link-arrow" style={{ fontSize: 11 }}>
            All saved <IconArrowRight size={13} />
          </Link>
        </div>
        {saved.length ? (
          <div className="saved-grid">
            {saved.map((p) => (
              <Link to={`/product/${p.slug}`} key={p.slug} className="saved-item">
                <img src={p.images[0]} alt="" />
                <div>
                  <div className="saved-item__t">{p.name}</div>
                  <div className="saved-item__p mono">{formatTZS(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
            Nothing saved yet — tap the heart on any piece to keep it here.
          </p>
        )}
      </div>

      <div className="panel">
        <h3>Studio Circle</h3>
        <p className="panel__hint">
          {state.user.points.toLocaleString()} of 2,500 points to your next early-access batch.
        </p>
        <div className="ship-meter__bar" style={{ height: 5 }}>
          <div className="ship-meter__fill" style={{ width: `${Math.min(100, (state.user.points / 2500) * 100)}%` }} />
        </div>
        <div className="row gap-8 wrap" style={{ marginTop: 16 }}>
          <Link to="/shop?sort=new" className="btn btn--ghost btn--sm">
            Shop new arrivals
          </Link>
          <Link to="/account/help" className="btn btn--ghost btn--sm">
            How points work
          </Link>
        </div>
      </div>

      <div className="panel">
        <div className="row between wrap gap-12">
          <div>
            <h3>Your details</h3>
            <p className="panel__hint" style={{ marginBottom: 0 }}>{state.user.email} · member since {state.user.since}</p>
          </div>
          <Link to="/account/details" className="link-arrow" style={{ fontSize: 11 }}>
            Edit <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Orders
   ============================================================ */
export function Orders() {
  const { state, dispatch, toast } = useStore()
  const [tab, setTab] = useState('all')
  const list = state.orders.filter((o) =>
    tab === 'all' ? true : tab === 'active' ? o.status !== 'Delivered' : o.status === 'Delivered',
  )

  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Orders</h1>
          <p>Everything you’ve brought home from the studio.</p>
        </div>
        <div className="segmented">
          {[
            ['all', 'All'],
            ['active', 'Active'],
            ['done', 'Delivered'],
          ].map(([id, label]) => (
            <button key={id} className={tab === id ? 'is-on' : ''} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <Empty
          icon={<IconBox size={22} />}
          title="No orders here yet"
          body="When you bring something home it will appear here, with tracking and care notes."
          action={
            <Link to="/shop" className="btn btn--sm" style={{ marginTop: 8 }}>
              Find something
            </Link>
          }
        />
      ) : (
        <div className="stack gap-12">
          {list.map((o) => (
            <article className="order" key={o.id}>
              <div className="order__top">
                <span className="row gap-16 wrap">
                  <span className="order__id">Order {o.id}</span>
                  <span className="faint">{new Date(o.placed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </span>
                <span className={`order__status ${statusClass(o.status)}`}>
                  {statusIcon(o.status)} {o.status}
                </span>
              </div>
              <div className="order__body">
                <div className="order__thumbs">
                  {o.items.map((it, i) => {
                    const p = getProduct(it.slug)
                    return p ? (
                      <Link to={`/product/${p.slug}`} key={i}>
                        <img src={p.images[0]} alt={p.name} />
                      </Link>
                    ) : null
                  })}
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 13 }}>
                    {o.items.map((it) => getProduct(it.slug)?.name).filter(Boolean).join(', ')}
                  </div>
                  <div className="faint" style={{ fontSize: 11.5, marginTop: 3 }}>
                    {o.eta} · {o.delivery}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 14 }}>{formatTZS(o.total)}</div>
              </div>
              <div className="order__foot">
                <span className="faint">{o.address}</span>
                <div className="order__actions">
                  <button
                    className="chip"
                    onClick={() => {
                      dispatch({ type: 'reorder', id: o.id })
                      toast('Added to your bag', { action: { label: 'View bag', to: '/cart' } })
                    }}
                  >
                    Buy again
                  </button>
                  <Link to={`/account/orders/${o.id}`} className="chip chip--soft">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Order detail
   ============================================================ */
export function OrderDetail() {
  const { id } = useParams()
  const { state, dispatch, toast } = useStore()
  const order = state.orders.find((o) => o.id === id)
  if (!order)
    return (
      <Empty
        title="Order not found"
        body="That order number isn’t in your account."
        action={<Link to="/account/orders" className="btn btn--sm" style={{ marginTop: 8 }}>All orders</Link>}
      />
    )
  const delivered = order.status === 'Delivered'
  const stage = delivered ? 5 : order.status === 'Processing' ? 2 : 3

  return (
    <div>
      <Link to="/account/orders" className="row gap-8 faint" style={{ fontSize: 12, marginBottom: 18 }}>
        <IconArrowLeft size={14} /> All orders
      </Link>
      <div className="acct__head">
        <div>
          <h1>Order {order.id}</h1>
          <p>
            Placed {new Date(order.placed).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
        <span className={`order__status ${statusClass(order.status)}`}>
          {statusIcon(order.status)} {order.status}
        </span>
      </div>

      <div className="panel">
        <div className="row between wrap gap-12">
          <h3>{order.eta}</h3>
          <span className="tiny-meta">Tracking {order.tracking}</span>
        </div>
        <div className="tracker">
          {['Confirmed', 'Packed', 'In transit', 'Delivered'].map((s, i) => (
            <div className={`track-step ${i < stage ? 'is-done' : ''}`} key={s}>
              {s}
            </div>
          ))}
        </div>
        <div className="row gap-8 wrap" style={{ marginTop: 16 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => toast(`Tracking ${order.tracking} copied`)}>
            Copy tracking
          </button>
          <Link to="/chat" className="btn btn--ghost btn--sm">
            <IconChat size={14} /> Ask about this order
          </Link>
        </div>
      </div>

      <div className="panel">
        <h3>In this order</h3>
        <div style={{ marginTop: 12 }}>
          {order.items.map((it, i) => {
            const p = getProduct(it.slug)
            if (!p) return null
            return (
              <div key={i} className="kv" style={{ alignItems: 'center' }}>
                <span className="row gap-12" style={{ alignItems: 'center' }}>
                  <Link to={`/product/${p.slug}`}>
                    <img src={p.images[0]} alt="" style={{ width: 54, height: 62, objectFit: 'cover', borderRadius: 8 }} />
                  </Link>
                  <span>
                    <Link to={`/product/${p.slug}`} style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
                      {p.name}
                    </Link>
                    <div className="faint" style={{ fontSize: 11.5 }}>
                      {[it.color, it.size].filter(Boolean).join(' · ')} · Qty {it.qty}
                    </div>
                  </span>
                </span>
                <span className="mono">{formatTZS(p.price * it.qty)}</span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 16 }}>
          <TotalRow label="Subtotal" value={order.total} />
          <TotalRow label="Delivery" value={0} free />
          <TotalRow label="Total paid" value={order.total} strong />
        </div>
      </div>

      <div className="row gap-12 wrap" style={{ alignItems: 'stretch' }}>
        <div className="panel" style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontSize: 14 }}>Delivery address</h3>
          <p className="faint" style={{ fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.6 }}>
            {order.address}
            <br />
            {state.user.phone}
          </p>
        </div>
        <div className="panel" style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontSize: 14 }}>Need a hand?</h3>
          <p className="faint" style={{ fontSize: 12.5, margin: '6px 0 12px' }}>
            Returns are open for 14 days from delivery.
          </p>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => {
              dispatch({ type: 'reorder', id: order.id })
              toast('Added to your bag', { action: { label: 'View bag', to: '/cart' } })
            }}
          >
            Buy it again
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Saved
   ============================================================ */
export function Saved() {
  const { state, dispatch, toast } = useStore()
  const items = state.saved.map(getProduct).filter(Boolean)
  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Saved pieces</h1>
          <p>{items.length} {items.length === 1 ? 'piece' : 'pieces'} you’re thinking about.</p>
        </div>
      </div>
      {items.length === 0 ? (
        <Empty
          icon={<IconHeart size={22} />}
          title="Nothing saved yet"
          body="Tap the heart on any piece and it will wait for you here."
          action={<Link to="/shop" className="btn btn--sm" style={{ marginTop: 8 }}>Browse the studio</Link>}
        />
      ) : (
        <>
          <div className="stack gap-8">
            {items.map((p) => (
              <div className="saved-item" key={p.slug} style={{ padding: 12 }}>
                <Link to={`/product/${p.slug}`}>
                  <img src={p.images[0]} alt="" style={{ width: 74, height: 88 }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/product/${p.slug}`} className="saved-item__t">
                    {p.name}
                  </Link>
                  <div className="saved-item__p mono">{formatTZS(p.price)}</div>
                  <div className="faint" style={{ fontSize: 11, marginTop: 2 }}>
                    {p.studio} · {p.stock} in stock
                  </div>
                </div>
                <div className="row gap-8">
                  <button
                    className="btn btn--sm"
                    onClick={() => {
                      dispatch({ type: 'add', slug: p.slug, size: p.sizes?.[0]?.label ?? null, color: p.colors?.[0]?.name ?? null })
                      toast(`${p.name} added to your bag`, { action: { label: 'View bag', to: '/cart' } })
                    }}
                  >
                    Add
                  </button>
                  <button
                    className="icon-btn"
                    style={{ width: 34, height: 34, border: '1px solid var(--line)' }}
                    onClick={() => {
                      dispatch({ type: 'toggleSave', slug: p.slug })
                      toast('Removed from saved', { duration: 2000 })
                    }}
                    aria-label={`Remove ${p.name}`}
                  >
                    <IconClose size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="plp-grid" style={{ marginTop: 34 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: 19, marginBottom: 16 }}>Goes well with what you saved</h3>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ============================================================
   Addresses
   ============================================================ */
const blankAddr = {
  id: '',
  label: 'Home',
  name: '',
  line1: '',
  city: '',
  region: 'Dar es Salaam',
  postal: '',
  phone: '',
  default: false,
}

export function Addresses() {
  const { state, dispatch, toast } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankAddr)
  const [err, setErr] = useState({})

  const open = (addr) => {
    setForm(addr ?? { ...blankAddr, id: `addr-${Date.now()}` })
    setErr({})
    setEditing(true)
  }

  const save = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Add a name'
    if (!form.line1.trim()) e.line1 = 'Street address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.phone.trim()) e.phone = 'A phone helps the courier'
    setErr(e)
    if (Object.keys(e).length) return
    dispatch({ type: 'saveAddress', addr: form })
    setEditing(false)
    toast('Address saved')
  }

  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Addresses</h1>
          <p>Where the studio should bring your pieces.</p>
        </div>
        <button className="btn btn--sm" onClick={() => open(null)}>
          <IconPlus size={14} /> Add address
        </button>
      </div>

      <div className="addr-grid">
        {state.addresses.map((a) => (
          <div className={`addr ${a.default ? 'is-default' : ''}`} key={a.id}>
            <div className="addr__tag">
              {a.label} {a.default && <span className="addr__badge">Default</span>}
            </div>
            <div style={{ fontWeight: 600 }}>{a.name}</div>
            <div className="muted">
              {a.line1}
              <br />
              {a.city} {a.postal}
              <br />
              {a.phone}
            </div>
            <div className="addr__actions">
              <button onClick={() => open(a)}>Edit</button>
              {!a.default && (
                <button
                  onClick={() => {
                    dispatch({ type: 'setDefaultAddress', id: a.id })
                    toast('Default address updated')
                  }}
                >
                  Set as default
                </button>
              )}
              {state.addresses.length > 1 && (
                <button
                  onClick={() => {
                    dispatch({ type: 'deleteAddress', id: a.id })
                    toast('Address removed', { duration: 2200 })
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="addr addr--new" onClick={() => open(null)}>
          <IconPlus size={20} />
          Add a new address
        </button>
      </div>

      <Sheet open={!!editing} onClose={() => setEditing(false)} title={form.id && state.addresses.some((a) => a.id === form.id) ? 'Edit address' : 'New address'} labelledBy="addr-title">
        <div style={{ padding: '20px 22px 110px' }} className="stack gap-16">
          <div className="chip-row">
            {['Home', 'Studio', 'Other'].map((l) => (
              <button key={l} className={`chip ${form.label === l ? 'is-on' : ''}`} onClick={() => setForm((f) => ({ ...f, label: l }))}>
                {l}
              </button>
            ))}
          </div>
          <div className="field">
            <label>Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Amani Hassan" />
            {err.name && <span className="field-error">{err.name}</span>}
          </div>
          <div className="field">
            <label>Street address</label>
            <input className="input" value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} placeholder="24 Chole Road, Mikocheni B" />
            {err.line1 && <span className="field-error">{err.line1}</span>}
          </div>
          <div className="form-grid">
            <div className="field">
              <label>City</label>
              <input className="input" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="Dar es Salaam" />
              {err.city && <span className="field-error">{err.city}</span>}
            </div>
            <div className="field">
              <label>Postal code</label>
              <input className="input" value={form.postal} onChange={(e) => setForm((f) => ({ ...f, postal: e.target.value }))} placeholder="14111" />
            </div>
          </div>
          <div className="field">
            <label>Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+255 754 000 000" />
            {err.phone && <span className="field-error">{err.phone}</span>}
          </div>
          <label className="checkline">
            <input
              type="checkbox"
              checked={form.default}
              onChange={(e) => setForm((f) => ({ ...f, default: e.target.checked }))}
            />
            Make this my default address
          </label>
        </div>
        <div className="sheet-footer">
          <button className="btn btn--ghost" onClick={() => setEditing(false)}>
            Cancel
          </button>
          <button className="btn" onClick={save}>
            Save address
          </button>
        </div>
      </Sheet>
    </div>
  )
}

/* ============================================================
   Payment methods
   ============================================================ */
export function Payments() {
  const { state, dispatch, toast } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ num: '', name: '', exp: '', cvc: '' })
  const [err, setErr] = useState({})

  const add = () => {
    const digits = form.num.replace(/\s/g, '')
    const e = {}
    if (digits.length < 12) e.num = 'Enter a card number'
    if (!form.name.trim()) e.name = 'Name on card is required'
    if (!/^\d{2}\s?\/?\s?\d{2}$/.test(form.exp.trim())) e.exp = 'Use MM/YY'
    if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = '3 or 4 digits'
    setErr(e)
    if (Object.keys(e).length) return
    dispatch({
      type: 'addCard',
      card: {
        id: `card-${Date.now()}`,
        brand: digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'Card',
        last4: digits.slice(-4),
        exp: form.exp,
        name: form.name,
        default: state.cards.length === 0,
      },
    })
    setOpen(false)
    setForm({ num: '', name: '', exp: '', cvc: '' })
    toast('Payment method added')
  }

  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Payment methods</h1>
          <p>Saved securely for faster checkout.</p>
        </div>
        <button className="btn btn--sm" onClick={() => setOpen(true)}>
          <IconPlus size={14} /> Add card
        </button>
      </div>

      <div className="stack gap-8">
        {state.cards.map((c) => (
          <div className={`size-opt ${c.default ? 'is-on' : ''}`} key={c.id} style={{ padding: 16 }}>
            <span className="row gap-12">
              <span
                style={{
                  width: 38,
                  height: 26,
                  borderRadius: 5,
                  background: c.brand === 'Mastercard' ? '#2c2a27' : '#1a3a6b',
                  color: '#fff',
                  fontSize: 9,
                  display: 'grid',
                  placeItems: 'center',
                  letterSpacing: '0.04em',
                }}
              >
                {c.brand}
              </span>
              <span>
                <div style={{ fontSize: 13.5 }}>···· ···· ···· {c.last4}</div>
                <div className="faint" style={{ fontSize: 11.5 }}>
                  {c.name} · exp {c.exp} {c.default && '· Default'}
                </div>
              </span>
            </span>
            <span className="row gap-12">
              {!c.default && (
                <button
                  style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}
                  onClick={() => {
                    dispatch({ type: 'setDefaultCard', id: c.id })
                    toast('Default card updated')
                  }}
                >
                  Make default
                </button>
              )}
              <button
                onClick={() => {
                  dispatch({ type: 'deleteCard', id: c.id })
                  toast('Card removed', { duration: 2000 })
                }}
                aria-label="Remove card"
                style={{ color: 'var(--ink-faint)' }}
              >
                <IconTrash size={15} />
              </button>
            </span>
          </div>
        ))}
        <div className="size-opt" style={{ padding: 16 }}>
          <span className="row gap-12">
            <span
              style={{
                width: 38,
                height: 26,
                borderRadius: 5,
                background: '#b4552d',
                color: '#fff',
                fontSize: 8.5,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              MPESA
            </span>
            <span>
              <div style={{ fontSize: 13.5 }}>Mobile money</div>
              <div className="faint" style={{ fontSize: 11.5 }}>
                M-Pesa · Airtel Money · Tigo Pesa
              </div>
            </span>
          </span>
          <span className="tiny-meta">Available at checkout</span>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <p className="row gap-8" style={{ margin: 0, fontSize: 12, color: 'var(--ink-soft)' }}>
          <IconLock size={14} /> Card details are tokenised — the studio never sees your full number. This is a demo
          store, so no charge is ever made.
        </p>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Add a card" labelledBy="card-title">
        <div style={{ padding: '20px 22px 110px' }} className="stack gap-16">
          <div className="field">
            <label>Card number</label>
            <input
              className="input"
              value={form.num}
              onChange={(e) => setForm((f) => ({ ...f, num: e.target.value.replace(/[^\d\s]/g, '').slice(0, 19) }))}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
            />
            {err.num && <span className="field-error">{err.num}</span>}
          </div>
          <div className="field">
            <label>Name on card</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="A. Hassan" />
            {err.name && <span className="field-error">{err.name}</span>}
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Expiry</label>
              <input className="input" value={form.exp} onChange={(e) => setForm((f) => ({ ...f, exp: e.target.value }))} placeholder="09/28" inputMode="numeric" />
              {err.exp && <span className="field-error">{err.exp}</span>}
            </div>
            <div className="field">
              <label>CVC</label>
              <input className="input" value={form.cvc} onChange={(e) => setForm((f) => ({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" inputMode="numeric" />
              {err.cvc && <span className="field-error">{err.cvc}</span>}
            </div>
          </div>
        </div>
        <div className="sheet-footer">
          <button className="btn btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn" onClick={add}>Save card</button>
        </div>
      </Sheet>
    </div>
  )
}

/* ============================================================
   Details
   ============================================================ */
export function Details() {
  const { state, dispatch, toast } = useStore()
  const [form, setForm] = useState({ name: state.user.name, firstName: state.user.firstName, email: state.user.email, phone: state.user.phone })
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.includes('@')) return toast('Check your name and email', { tone: 'warn' })
    dispatch({ type: 'updateUser', patch: { ...form, firstName: form.firstName || form.name.split(' ')[0] } })
    setSaved(true)
    toast('Details updated')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Account details</h1>
          <p>How the studio knows you.</p>
        </div>
        <span className="tiny-meta">Member since {state.user.since}</span>
      </div>

      <form onSubmit={save} className="panel stack gap-16">
        <div className="row gap-16" style={{ alignItems: 'center' }}>
          <span className="acct__avatar" style={{ width: 56, height: 56, fontSize: 19 }}>
            {state.user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{state.user.name}</div>
            <div className="faint" style={{ fontSize: 12 }}>
              {state.user.tier} · {state.user.points.toLocaleString()} points
            </div>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" style={{ marginLeft: 'auto' }} onClick={() => toast('Avatar uploads are coming soon')}>
            Change
          </button>
        </div>
        <hr className="rule" />
        <div className="form-grid">
          <div className="field">
            <label>Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>First name</label>
            <input className="input" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
        </div>
        <div className="row gap-8">
          <button className="btn" type="submit">
            {saved ? <><IconCheck size={15} /> Saved</> : 'Save changes'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setForm({ name: state.user.name, firstName: state.user.firstName, email: state.user.email, phone: state.user.phone })}>
            Reset
          </button>
        </div>
      </form>

      <div className="panel" style={{ marginTop: 14 }}>
        <h3>Password</h3>
        <p className="panel__hint">Last changed 4 months ago.</p>
        <div className="form-grid">
          <div className="field">
            <label>Current password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <div className="field">
            <label>New password</label>
            <input className="input" type="password" placeholder="At least 8 characters" />
          </div>
        </div>
        <button className="btn btn--ghost btn--sm" style={{ marginTop: 14 }} onClick={() => toast('Password updated')}>
          Update password
        </button>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <h3>Preferences</h3>
        <p className="panel__hint">Account settings.</p>
        <div className="toggle-row">
          <div>
            <div className="toggle-row__t">Studio letters</div>
            <div className="toggle-row__d">New batches, studio visits, occasional recipes.</div>
          </div>
          <button className="switch is-on" aria-label="Toggle studio letters" onClick={(e) => e.currentTarget.classList.toggle('is-on')} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-row__t">Order updates by SMS</div>
            <div className="toggle-row__d">Sent to {state.user.phone}</div>
          </div>
          <button className="switch is-on" aria-label="Toggle SMS updates" onClick={(e) => e.currentTarget.classList.toggle('is-on')} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-row__t">Early access to new batches</div>
            <div className="toggle-row__d">You’ll hear before the shop does.</div>
          </div>
          <button className="switch" aria-label="Toggle early access" onClick={(e) => e.currentTarget.classList.toggle('is-on')} />
        </div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <h3>Currency & language</h3>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Currency</label>
            <select className="select" defaultValue="TZS">
              <option value="TZS">TZS — Tanzanian shilling</option>
              <option value="KES">KES — Kenyan shilling</option>
              <option value="USD">USD — US dollar</option>
            </select>
          </div>
          <div className="field">
            <label>Language</label>
            <select className="select" defaultValue="en">
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Notifications
   ============================================================ */
export function Notifications() {
  const { state, dispatch } = useStore()
  const unread = state.notifications.filter((n) => !n.read).length
  const icons = { order: <IconBox size={15} />, chat: <IconChat size={15} />, drop: <IconTag size={15} />, care: <IconLeaf size={15} /> }

  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Notifications</h1>
          <p>{unread ? `${unread} unread` : 'You’re all caught up.'}</p>
        </div>
        {unread > 0 && (
          <button className="btn btn--ghost btn--sm" onClick={() => dispatch({ type: 'readAllNotifs' })}>
            Mark all read
          </button>
        )}
      </div>

      <div className="stack gap-8">
        {state.notifications.map((n) => (
          <Link
            key={n.id}
            to={n.to}
            className="saved-item"
            style={{ padding: 14, alignItems: 'flex-start', background: n.read ? 'var(--paper-2)' : 'var(--white)', borderColor: n.read ? 'var(--line)' : 'var(--line-strong)' }}
            onClick={() => dispatch({ type: 'readNotif', id: n.id })}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: n.read ? 'var(--paper-3)' : 'rgba(180,85,45,0.12)',
                color: n.read ? 'var(--ink-soft)' : 'var(--clay-deep)',
                flex: 'none',
              }}
            >
              {icons[n.type] ?? <IconBell size={15} />}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="row between gap-12">
                <span style={{ fontSize: 13.5, fontWeight: n.read ? 500 : 600 }}>{n.title}</span>
                <span className="faint" style={{ fontSize: 10.5, flex: 'none' }}>{n.time}</span>
              </span>
              <span className="faint" style={{ fontSize: 12.5, display: 'block', marginTop: 3, lineHeight: 1.5 }}>
                {n.body}
              </span>
            </span>
            {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--clay)', flex: 'none', marginTop: 6 }} />}
          </Link>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3>Stay in the loop</h3>
        <div className="toggle-row">
          <span className="toggle-row__t">New batches & studio drops</span>
          <button className="switch is-on" aria-label="Toggle drops" onClick={(e) => e.currentTarget.classList.toggle('is-on')} />
        </div>
        <div className="toggle-row">
          <span className="toggle-row__t">Care notes for things you own</span>
          <button className="switch is-on" aria-label="Toggle care notes" onClick={(e) => e.currentTarget.classList.toggle('is-on')} />
        </div>
        <div className="toggle-row">
          <span className="toggle-row__t">Studio letters (monthly)</span>
          <button className="switch" aria-label="Toggle letters" onClick={(e) => e.currentTarget.classList.toggle('is-on')} />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Help
   ============================================================ */
export function Help() {
  return (
    <div>
      <div className="acct__head">
        <div>
          <h1>Care & help</h1>
          <p>The things people ask us most.</p>
        </div>
        <Link to="/chat" className="btn btn--sm">
          <IconChat size={14} /> Message the studio
        </Link>
      </div>

      <Accordion items={faqs} defaultOpen={0} />

      <div className="row gap-12 wrap" style={{ marginTop: 24, alignItems: 'stretch' }}>
        <div className="panel" style={{ flex: 1, minWidth: 220 }}>
          <IconTruck size={18} style={{ color: 'var(--clay)' }} />
          <h3 style={{ marginTop: 10, fontSize: 15 }}>Delivery</h3>
          <p className="faint" style={{ fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.6 }}>
            Same-day in Dar before 12:00. Standard 2–4 days, free over TZS 500,000.
          </p>
        </div>
        <div className="panel" style={{ flex: 1, minWidth: 220 }}>
          <IconReturn size={18} style={{ color: 'var(--clay)' }} />
          <h3 style={{ marginTop: 10, fontSize: 15 }}>Returns</h3>
          <p className="faint" style={{ fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.6 }}>
            14 days from delivery, original condition. Made-to-order pieces are final.
          </p>
        </div>
        <div className="panel" style={{ flex: 1, minWidth: 220 }}>
          <IconShield size={18} style={{ color: 'var(--clay)' }} />
          <h3 style={{ marginTop: 10, fontSize: 15 }}>Our promise</h3>
          <p className="faint" style={{ fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.6 }}>
            If a piece fails in normal use, the studio that made it will repair it.
          </p>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3>Reach us directly</h3>
        <div className="stack gap-12" style={{ marginTop: 12 }}>
          <a href={`mailto:${BRAND.email}`} className="row gap-12" style={{ fontSize: 13 }}>
            <IconMail size={16} /> {BRAND.email}
          </a>
          <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className="row gap-12" style={{ fontSize: 13 }}>
            <IconPhone size={16} /> {BRAND.phone}
          </a>
          <div className="row gap-12 faint" style={{ fontSize: 13 }}>
            <IconPin size={16} /> {BRAND.address}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Sign-in gate for account routes
   ============================================================ */
export function AccountGate({ children }) {
  const { authed } = useStore()
  const nav = useNavigate()
  useEffect(() => {
    if (!authed) nav('/', { replace: true })
  }, [authed])
  if (!authed) return null
  return children
}
