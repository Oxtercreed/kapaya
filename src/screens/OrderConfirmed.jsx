import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useStore, formatUSD } from '../store'
import { getProduct } from '../data/catalog'
import {
  IconArrowRight,
  IconCheck,
  IconTruck,
  IconPin,
  IconMail,
  IconChat,
  IconBag,
  IconClock,
  IconShield,
} from '../components/Icons'

/* Order confirmed — the Figma "Order confirmed" frame, plus a tracking view
   for the same route (arriving from an order in the account area). */
export default function OrderConfirmed() {
  const { id } = useParams()
  const { state } = useStore()
  const loc = useLocation()
  const fresh = Boolean(loc.state?.fresh)
  const [confetti, setConfetti] = useState(fresh)

  const order = useMemo(
    () => state.orders.find((o) => o.id === id) ?? loc.state?.order ?? null,
    [state.orders, id, loc.state],
  )

  useEffect(() => {
    document.title = order ? `Order ${order.id} · VOLTA` : 'Order · VOLTA'
    window.scrollTo(0, 0)
    if (!confetti) return
    const t = setTimeout(() => setConfetti(false), 2600)
    return () => clearTimeout(t)
  }, [order, confetti])

  if (!order) {
    return (
      <div className="shell cart-page">
        <p className="eyebrow">
          <span className="dot" /> Orders
        </p>
        <h1>We can’t find that order.</h1>
        <p className="lede" style={{ maxWidth: 520, marginTop: 14 }}>
          The link may be from an older browser. Your orders live in your account, where they’ll be
          waiting.
        </p>
        <div className="row gap-8 wrap" style={{ marginTop: 26 }}>
          <Link to="/account/orders" className="btn">
            See your orders <IconArrowRight size={16} />
          </Link>
          <Link to="/chat" className="btn btn--ghost">
            <IconChat size={15} /> Ask the studio
          </Link>
        </div>
      </div>
    )
  }

  const items = order.items.map((it) => ({ ...it, product: getProduct(it.slug) })).filter((it) => it.product)
  const stage = ({ Processing: 1, Packed: 2, 'In transit': 3, Delivered: 4 })[order.status] ?? 1
  const STAGES = ['Confirmed', 'Packed', 'On its way', 'Delivered']
  const eta = order.eta?.includes('Arriving') ? order.eta : `Arriving in 2–4 working days`
  const count = items.reduce((n, it) => n + it.qty, 0)

  return (
    <div className={`shell confirm-page ${fresh ? 'is-fresh' : ''}`}>
      {confetti && (
        <div className="confirm-burst" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
        </div>
      )}

      <header className="confirm-head">
        <span className="confirm-tick">
          <IconCheck size={22} />
        </span>
        <p className="eyebrow">
          <span className="dot" /> {fresh ? 'Order confirmed' : 'Order details'}
        </p>
        <h1>Thank you, {state.user.firstName}.</h1>
        <p className="confirm-sub">
          {fresh
            ? `Your order is with the studio. We’ve sent a receipt to ${state.user.email} — and we’ll write again the moment it’s packed.`
            : `A receipt for this order is in your inbox. Everything below is live — it updates as the studio packs and ships it.`}
        </p>

        <div className="confirm-meta">
          <div>
            <span>Order</span>
            <b className="mono">{order.id}</b>
          </div>
          <div>
            <span>Placed</span>
            <b>{order.placed}</b>
          </div>
          <div>
            <span>Total</span>
            <b>{formatUSD(order.total)}</b>
          </div>
          <div>
            <span>Items</span>
            <b>
              {count} {count === 1 ? 'item' : 'items'}
            </b>
          </div>
        </div>
      </header>

      <div className="confirm-grid">
        <div className="confirm-main">
          {/* tracking */}
          <section className="co-card confirm-track">
            <div className="confirm-track__head">
              <div>
                <p className="eyebrow">
                  <span className="dot" /> {order.status === 'Delivered' ? 'Delivered' : 'On its way'}
                </p>
                <h2>{order.status === 'Delivered' ? order.eta : eta}</h2>
              </div>
              <span className="confirm-chip">
                <IconTruck size={13} /> {order.status}
              </span>
            </div>

            <ol className="confirm-rail">
              {STAGES.map((s, i) => {
                const n = i + 1
                return (
                  <li key={s} className={`confirm-rail__step ${stage >= n ? 'is-done' : ''} ${stage === n ? 'is-now' : ''}`}>
                    <span className="confirm-rail__node" aria-hidden="true">
                      {stage > n ? <IconCheck size={10} /> : null}
                    </span>
                    <span className="confirm-rail__label">{s}</span>
                    {stage === n && <span className="confirm-rail__now">Now</span>}
                  </li>
                )
              })}
            </ol>

            <div className="confirm-track__foot">
              <span>
                <IconClock size={14} /> Tracking <b className="mono">{order.tracking}</b>
              </span>
              <Link to={`/account/orders/${order.id}`} className="co-link">
                Full tracking <IconArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* items */}
          <section className="co-card">
            <div className="co-card__head">
              <h2>In this order</h2>
              <span className="tiny-meta" style={{ letterSpacing: 0, textTransform: 'none' }}>
                {order.delivery}
              </span>
            </div>
            <ul className="confirm-items">
              {items.map((it) => (
                <li key={`${it.slug}-${it.color ?? ''}-${it.size ?? ''}-${it.qty}`}>
                  <Link to={`/product/${it.slug}`} className="confirm-item__img">
                    <img src={it.product.images[0]} alt={it.product.name} />
                  </Link>
                  <div className="confirm-item__body">
                    <Link to={`/product/${it.slug}`} className="confirm-item__name">
                      {it.product.name}
                    </Link>
                    <em>
                      {[it.color, it.size].filter(Boolean).join(' · ') || it.product.categoryName} · Qty {it.qty}
                    </em>
                  </div>
                  <span className="confirm-item__price">{formatUSD(it.product.price * it.qty)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* delivery */}
          <section className="co-card">
            <div className="co-card__head">
              <h2>
                <IconPin size={16} /> Delivering to
              </h2>
            </div>
            <p className="confirm-addr">{order.address}</p>
            <p className="confirm-addr__meta">
              {order.delivery} · {eta}
            </p>
          </section>
        </div>

        <aside className="confirm-side">
          <div className="co-summary">
            <div className="co-summary__head">
              <h2>Summary</h2>
            </div>
            <dl className="co-totals">
              <div>
                <dt>Items</dt>
                <dd>{count}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{order.total >= 100 ? 'Free' : '$0.00'}</dd>
              </div>
              <div className="is-total">
                <dt>Paid</dt>
                <dd>{formatUSD(order.total)}</dd>
              </div>
            </dl>
            <div className="confirm-side__note">
              <IconShield size={15} />
              <p>Covered by the VOLTA two-year warranty. Returns are open for 30 days from delivery.</p>
            </div>
            <Link to={`/account/orders/${order.id}`} className="btn btn--block">
              Track this order <IconArrowRight size={15} />
            </Link>
            <Link to="/shop" className="btn btn--ghost btn--block" style={{ marginTop: 8 }}>
              <IconBag size={15} /> Keep shopping
            </Link>
          </div>

          <div className="confirm-help">
            <p className="confirm-help__q">Need to change something?</p>
            <p className="confirm-help__a">
              Orders can be edited until they’re packed. Message the studio and we’ll sort it.
            </p>
            <div className="row gap-8 wrap" style={{ marginTop: 12 }}>
              <Link to="/chat" className="btn btn--ghost btn--sm">
                <IconChat size={14} /> Message us
              </Link>
              <a href={`mailto:hello@volta.store?subject=Order%20${order.id}`} className="btn btn--ghost btn--sm">
                <IconMail size={14} /> Email
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
