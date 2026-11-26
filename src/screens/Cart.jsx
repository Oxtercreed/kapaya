import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, formatTZS } from '../store'
import { PROMOS, deliveryOptions, products } from '../data/catalog'
import { Qty, Empty, TotalRow, Sheet, ProductCard } from '../components/ui'
import {
  IconBag,
  IconArrowRight,
  IconTruck,
  IconCheck,
  IconClose,
  IconShield,
  IconLeaf,
  IconChat,
  IconPin,
  IconCard,
  IconLock,
} from '../components/Icons'

const FREE_OVER = 500000

export default function Cart() {
  const { state, dispatch, cart, toast, authed, setAuthed } = useStore()
  const nav = useNavigate()
  const [promoInput, setPromoInput] = useState('')
  const [checkout, setCheckout] = useState(false)
  const [done, setDone] = useState(null)
  const [step, setStep] = useState(1)

  useEffect(() => {
    document.title = 'Your bag · KAPAYA'
  }, [])

  const delivery = deliveryOptions.find((d) => d.id === state.delivery) ?? deliveryOptions[1]
  const shipping = delivery.price === 0 || cart.subtotal - cart.discount >= FREE_OVER ? 0 : delivery.price
  const total = cart.total + shipping
  const remaining = Math.max(0, FREE_OVER - cart.subtotal)

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    const promo = PROMOS[code]
    if (!promo) {
      toast('That code isn’t recognised — try KARIBU10', { tone: 'warn' })
      return
    }
    dispatch({ type: 'promo', promo })
    setPromoInput('')
    toast(`${promo.label} applied`)
  }

  const placeOrder = () => {
    const address = state.addresses.find((a) => a.default) ?? state.addresses[0]
    const order = {
      id: `KP-${Math.floor(25000 + Math.random() * 9000)}`,
      placed: new Date().toISOString().slice(0, 10),
      status: 'Processing',
      items: cart.lines.map((l) => ({ slug: l.slug, qty: l.qty, size: l.size, color: l.color })),
      delivery: delivery.name,
      address: `${address.label} — ${address.line1}, ${address.city}`,
      total,
      tracking: `KPX-${Math.floor(1000000 + Math.random() * 8999999)}`,
      eta: delivery.id === 'pickup' ? 'Ready for pickup in 2 hours' : 'Arriving in 2–4 working days',
    }
    dispatch({ type: 'addOrder', order })
    dispatch({ type: 'clearCart' })
    setDone(order)
    setCheckout(false)
    setStep(1)
    document.body.style.overflow = 'hidden'
  }

  const closeSuccess = () => {
    setDone(null)
    document.body.style.overflow = ''
    nav('/account/orders')
  }

  /* ---------------- empty ---------------- */
  if (!cart.lines.length && !done) {
    return (
      <div className="shell cart-page">
        <p className="eyebrow">
          <span className="dot" /> Your bag
        </p>
        <h1>Your bag is empty.</h1>
        <div className="cart-empty">
          <div>
            <p className="lede" style={{ marginTop: 16 }}>
              Nothing here yet — which means the whole studio is still waiting for you. Most people start with a
              vessel or a throw.
            </p>
            <div className="row gap-8 wrap" style={{ marginTop: 24 }}>
              <Link to="/shop" className="btn">
                Shop everything <IconArrowRight size={16} />
              </Link>
              <Link to="/chat" className="btn btn--ghost">
                <IconChat size={15} /> Ask the studio
              </Link>
            </div>
            <div className="row gap-16 wrap" style={{ marginTop: 32, fontSize: 12, color: 'var(--ink-soft)' }}>
              <span className="row gap-8">
                <IconTruck size={15} /> Free over TZS 500,000
              </span>
              <span className="row gap-8">
                <IconLeaf size={15} /> Handmade
              </span>
              <span className="row gap-8">
                <IconShield size={15} /> Secure
              </span>
            </div>
          </div>
          <div className="cart-empty__visual">
            <img src="/images/vase-sona.jpg" alt="Sona vessel" />
          </div>
        </div>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">
                <span className="dot" /> Start here
              </p>
              <h2 className="sec-head__title">Studio favourites</h2>
            </div>
          </div>
          <div className="plp-grid">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="shell cart-page">
      <div className="row between wrap gap-16">
        <div>
          <p className="eyebrow">
            <span className="dot" /> Your bag
          </p>
          <h1>{cart.count} {cart.count === 1 ? 'piece' : 'pieces'}, set aside.</h1>
        </div>
        <Link to="/shop" className="link-arrow" style={{ marginBottom: 6 }}>
          Keep shopping <IconArrowRight size={15} />
        </Link>
      </div>

      <div className="cart-grid">
        <div>
          <div className="cart-lines">
            {cart.lines.map((l) => (
              <div className="cline" key={l.key}>
                <Link to={`/product/${l.slug}`} className="cline__img">
                  <img src={l.product.images[0]} alt={l.product.name} />
                </Link>
                <div className="cline__main">
                  <Link to={`/product/${l.slug}`} className="cline__name">
                    {l.product.name}
                  </Link>
                  <div className="cline__opts">
                    {l.color && (
                      <span className="row gap-4">
                        <i style={{ background: l.product.colors?.find((c) => c.name === l.color)?.hex ?? '#ccc' }} />
                        {l.color}
                      </span>
                    )}
                    {l.color && l.size && <span>·</span>}
                    {l.size && <span>{l.size}</span>}
                    <span>·</span>
                    <span>{l.product.studio}</span>
                  </div>
                  <span className="cline__stock">
                    <IconCheck size={11} /> In stock
                  </span>
                  <div className="cline__controls">
                    <Qty small value={l.qty} onChange={(q) => dispatch({ type: 'setQty', key: l.key, qty: q })} />
                    <button className="cline__remove" onClick={() => {
                      dispatch({ type: 'remove', key: l.key })
                      toast(`${l.product.name} removed`, { duration: 2500 })
                    }}>
                      Remove
                    </button>
                    <button
                      className="cline__remove"
                      onClick={() => {
                        dispatch({ type: 'toggleSave', slug: l.slug })
                        toast('Moved to saved pieces', { action: { label: 'View saved', to: '/account/saved' } })
                      }}
                    >
                      Save for later
                    </button>
                  </div>
                </div>
                <div className="cline__price mono">
                  {formatTZS(l.total)}
                  {l.qty > 1 && <small>{formatTZS(l.unit)} each</small>}
                </div>
              </div>
            ))}
          </div>

          <div className="row between wrap gap-12" style={{ marginTop: 22 }}>
            <Link to="/chat" className="btn btn--ghost btn--sm">
              <IconChat size={14} /> Question about your order?
            </Link>
            <span className="tiny-meta">Prices include VAT</span>
          </div>
        </div>

        {/* ---------------- summary ---------------- */}
        <aside className="summary">
          <h2>Order summary</h2>

          {remaining > 0 ? (
            <div className="ship-meter">
              <p>
                <IconTruck size={14} /> Add <b>{formatTZS(remaining)}</b> for free delivery
              </p>
              <div className="ship-meter__bar">
                <div className="ship-meter__fill" style={{ width: `${Math.min(100, (cart.subtotal / FREE_OVER) * 100)}%` }} />
              </div>
            </div>
          ) : (
            <div className="ship-meter">
              <p>
                <IconCheck size={14} /> You’ve unlocked <b>free standard delivery</b>
              </p>
              <div className="ship-meter__bar">
                <div className="ship-meter__fill" style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {state.promo ? (
            <div className="promo-applied">
              <span className="row gap-8">
                <IconCheck size={14} /> {state.promo.code} — {state.promo.label}
              </span>
              <button onClick={() => dispatch({ type: 'promo', promo: null })} aria-label="Remove promo">
                <IconClose size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="summary__promo">
                <input
                  className="input"
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  aria-label="Promo code"
                />
                <button className="btn btn--sm" onClick={applyPromo}>
                  Apply
                </button>
              </div>
              <p className="summary__note">Try KARIBU10 for 10% off your first order.</p>
            </>
          )}

          <div style={{ marginTop: 14 }}>
            <TotalRow label="Subtotal" value={cart.subtotal} />
            {cart.discount > 0 && <TotalRow label="Discount" value={-cart.discount} muted />}
            <TotalRow label={`Delivery · ${delivery.name}`} value={shipping} free={shipping === 0} />
            <TotalRow label="Total" value={total} strong />
          </div>

          <button className="btn btn--block" style={{ marginTop: 18 }} onClick={() => setCheckout(true)}>
            <IconLock size={14} /> Checkout
          </button>

          <div className="summary__perks">
            <div>
              <IconShield size={13} /> Secure checkout · cards & mobile money
            </div>
            <div>
              <IconTruck size={13} /> Same-day in Dar before 12:00
            </div>
            <div>
              <IconLeaf size={13} /> Plastic-free packaging
            </div>
          </div>
        </aside>
      </div>

      {!cart.lines.length && done && null}

      {/* ---------------- checkout sheet ---------------- */}
      <Sheet open={checkout} onClose={() => setCheckout(false)} title="Checkout" width={520} labelledBy="checkout-title">
        <div style={{ padding: '20px 22px 120px' }}>
          <div className="steps" style={{ marginBottom: 24 }}>
            {['Details', 'Delivery', 'Payment'].map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <span className="steps__sep" />}
                <span className={`step ${step === i + 1 ? 'is-on' : ''} ${step > i + 1 ? 'is-done' : ''}`}>
                  <span className="step__n">{step > i + 1 ? <IconCheck size={11} /> : i + 1}</span>
                  {s}
                </span>
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <div className="stack gap-16">
              <div className="field">
                <label>Contact</label>
                <input className="input" defaultValue={state.user.email} aria-label="Email" />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>First name</label>
                  <input className="input" defaultValue={state.user.firstName} />
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input className="input" defaultValue="Hassan" />
                </div>
              </div>
              <div>
                <p className="field-label" style={{ marginBottom: 9 }}>Deliver to</p>
                <div className="stack gap-8">
                  {state.addresses.map((a) => (
                    <label
                      key={a.id}
                      className={`size-opt ${a.default ? 'is-on' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => dispatch({ type: 'setDefaultAddress', id: a.id })}
                    >
                      <span>
                        <b style={{ fontWeight: 600 }}>{a.label}</b> · {a.line1}, {a.city}
                      </span>
                      {a.default && <IconCheck size={15} />}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn--block" onClick={() => setStep(2)} style={{ marginTop: 6 }}>
                Continue to delivery <IconArrowRight size={15} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="stack gap-16">
              <div className="stack gap-8">
                {deliveryOptions.map((d) => (
                  <button
                    key={d.id}
                    className={`size-opt ${state.delivery === d.id ? 'is-on' : ''}`}
                    onClick={() => dispatch({ type: 'delivery', id: d.id })}
                  >
                    <span>
                      <b style={{ fontWeight: 600 }}>{d.name}</b>
                      <br />
                      <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{d.detail}</span>
                    </span>
                    <span className="size-opt__price">
                      {d.price === 0 ? 'Free' : formatTZS(d.price)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="field">
                <label>Delivery note (optional)</label>
                <textarea className="textarea" placeholder="Gate code, landmark, or a note for the courier" />
              </div>
              <div className="row gap-8">
                <button className="btn btn--ghost" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="btn" style={{ flex: 1 }} onClick={() => setStep(3)}>
                  Continue to payment <IconArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="stack gap-16">
              <div className="stack gap-8">
                {state.cards.map((c) => (
                  <button
                    key={c.id}
                    className={`size-opt ${c.default ? 'is-on' : ''}`}
                    onClick={() => dispatch({ type: 'setDefaultCard', id: c.id })}
                  >
                    <span className="row gap-8">
                      <IconCard size={18} /> {c.brand} ···· {c.last4}
                    </span>
                    <span className="size-opt__price">exp {c.exp}</span>
                  </button>
                ))}
                <button className="size-opt">
                  <span className="row gap-8">
                    <IconCard size={18} /> Mobile money (M-Pesa, Airtel)
                  </span>
                </button>
              </div>
              <div className="form-grid">
                <div className="field col-2">
                  <label>Card number</label>
                  <input className="input" placeholder="4242 4242 4242 4242" inputMode="numeric" />
                </div>
                <div className="field">
                  <label>Expiry</label>
                  <input className="input" placeholder="MM / YY" inputMode="numeric" />
                </div>
                <div className="field">
                  <label>CVC</label>
                  <input className="input" placeholder="123" inputMode="numeric" />
                </div>
              </div>
              <div className="panel" style={{ padding: 16 }}>
                <TotalRow label="Subtotal" value={cart.subtotal} />
                {cart.discount > 0 && <TotalRow label="Discount" value={-cart.discount} muted />}
                <TotalRow label="Delivery" value={shipping} free={shipping === 0} />
                <TotalRow label="Total" value={total} strong />
              </div>
              <div className="row gap-8">
                <button className="btn btn--ghost" onClick={() => setStep(2)}>
                  Back
                </button>
                <button className="btn" style={{ flex: 1 }} onClick={placeOrder}>
                  <IconLock size={14} /> Pay {formatTZS(total)}
                </button>
              </div>
              <p className="tiny-meta center" style={{ textTransform: 'none', letterSpacing: 0 }}>
                Demo checkout — no card is charged.
              </p>
            </div>
          )}
        </div>
      </Sheet>

      {/* ---------------- success ---------------- */}
      {done && (
        <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="ok-title">
          <div className="modal-scrim" onClick={closeSuccess} />
          <div className="modal">
            <button className="icon-btn modal__x" onClick={closeSuccess} aria-label="Close">
              <IconClose size={18} />
            </button>
            <div className="success">
              <div className="success__ring">
                <IconCheck size={30} />
              </div>
              <p className="eyebrow" style={{ justifyContent: 'center' }}>
                <span className="dot" /> Order confirmed
              </p>
              <h2 id="ok-title" style={{ marginTop: 10 }}>
                Asante sana, {state.user.firstName}.
              </h2>
              <p className="sub" style={{ marginTop: 8 }}>
                Your order is with the studio. We’ll send a note when it’s packed — usually the same day.
              </p>
              <p className="success__id mono">{done.id}</p>
              <div className="panel" style={{ textAlign: 'left', marginTop: 18, padding: 16 }}>
                <div className="kv">
                  <span className="kv__k">Delivery</span>
                  <span className="kv__v">{done.delivery}</span>
                </div>
                <div className="kv">
                  <span className="kv__k">To</span>
                  <span className="kv__v">{done.address}</span>
                </div>
                <div className="kv">
                  <span className="kv__k">Total</span>
                  <span className="kv__v mono">{formatTZS(done.total)}</span>
                </div>
                <div className="kv">
                  <span className="kv__k">Tracking</span>
                  <span className="kv__v mono">{done.tracking}</span>
                </div>
              </div>
              <button className="btn btn--block" style={{ marginTop: 16 }} onClick={closeSuccess}>
                Track this order <IconArrowRight size={15} />
              </button>
              <Link to="/shop" className="btn btn--ghost btn--block" style={{ marginTop: 8 }} onClick={() => { setDone(null); document.body.style.overflow = '' }}>
                Keep shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
