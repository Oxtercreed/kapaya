import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, formatUSD } from '../store'
import { PROMOS, deliveryOptions, getProduct } from '../data/catalog'
import {
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconLock,
  IconTruck,
  IconShield,
  IconCard,
  IconPin,
  IconBag,
  IconChat,
  IconPlus,
} from '../components/Icons'

const FREE_OVER = 100

/* The three steps of a VOLTA checkout: details → payment. Delivery lives in
   the summary on the right so the shopper never loses sight of the cost. */
const STEPS = ['Details', 'Delivery', 'Payment']

export default function Checkout() {
  const { state, dispatch, cart, toast } = useStore()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [promoInput, setPromoInput] = useState('')
  const [note, setNote] = useState('')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [payMethod, setPayMethod] = useState(
    () => (state.cards.find((c) => c.default) ?? state.cards[0] ?? { id: 'mobile' }).id,
  )
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    document.title = 'Checkout · VOLTA'
    window.scrollTo(0, 0)
  }, [])

  const delivery = deliveryOptions.find((d) => d.id === state.delivery) ?? deliveryOptions[1]
  const shipping = delivery.price === 0 || cart.subtotal - cart.discount >= FREE_OVER ? 0 : delivery.price
  const total = cart.total + shipping
  const address = state.addresses.find((a) => a.default) ?? state.addresses[0]

  const lines = useMemo(
    () => cart.lines.map((l) => ({ ...l, product: getProduct(l.slug) })).filter((l) => l.product),
    [cart.lines],
  )

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    const promo = PROMOS[code]
    if (!promo) {
      toast('That code isn’t recognised — try VOLTA10', { tone: 'warn' })
      return
    }
    dispatch({ type: 'promo', promo })
    setPromoInput('')
    toast(`${promo.label} applied`)
  }

  const placeOrder = () => {
    if (placing) return
    setPlacing(true)
    const order = {
      id: `VT-${Math.floor(45000 + Math.random() * 9000)}`,
      placed: new Date().toISOString().slice(0, 10),
      status: 'Processing',
      items: cart.lines.map((l) => ({ slug: l.slug, qty: l.qty, size: l.size, color: l.color })),
      delivery: delivery.name,
      address: `${address.label} — ${address.line1}, ${address.city}`,
      total,
      tracking: `VTX-${Math.floor(1000000 + Math.random() * 8999999)}`,
      eta: delivery.id === 'pickup' ? 'Ready for pickup in 2 hours' : 'Arriving in 2–4 working days',
    }
    dispatch({ type: 'addOrder', order })
    dispatch({ type: 'clearCart' })
    setTimeout(() => nav(`/order/${order.id}`, { replace: true, state: { fresh: true, order } }), 480)
  }

  /* ---------------- empty ---------------- */
  if (!lines.length && !placing) {
    return (
      <div className="shell cart-page">
        <p className="eyebrow">
          <span className="dot" /> Checkout
        </p>
        <h1>Nothing to check out.</h1>
        <p className="lede" style={{ maxWidth: 520, marginTop: 14 }}>
          Your bag is empty, so there’s nothing to pay for yet. The whole shop is a click away.
        </p>
        <div className="row gap-8 wrap" style={{ marginTop: 26 }}>
          <Link to="/shop" className="btn">
            Shop everything <IconArrowRight size={16} />
          </Link>
          <Link to="/cart" className="btn btn--ghost">
            <IconBag size={15} /> View bag
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="shell checkout-page">
      <header className="checkout-head">
        <div>
          <p className="eyebrow">
            <span className="dot" /> Secure checkout
          </p>
          <h1 className="checkout-head__title">Almost yours.</h1>
        </div>
        <nav className="checkout-steps" aria-label="Checkout progress">
          {STEPS.map((s, i) => {
            const n = i + 1
            return (
              <React.Fragment key={s}>
                {i > 0 && <span className="checkout-steps__sep" aria-hidden="true" />}
                <button
                  type="button"
                  className={`checkout-step ${step === n ? 'is-on' : ''} ${step > n ? 'is-done' : ''}`}
                  onClick={() => (step > n ? setStep(n) : null)}
                  aria-current={step === n ? 'step' : undefined}
                >
                  <span className="checkout-step__n">{step > n ? <IconCheck size={12} /> : n}</span>
                  {s}
                </button>
              </React.Fragment>
            )
          })}
        </nav>
      </header>

      <div className="checkout-grid">
        {/* ------------------------------ main column ------------------------------ */}
        <div className="checkout-main">
          {step === 1 && (
            <section className="co-card">
              <div className="co-card__head">
                <h2>Contact &amp; delivery</h2>
                <Link to="/account/details" className="co-link">
                  Use saved details <IconArrowRight size={13} />
                </Link>
              </div>

              <div className="co-fields">
                <label className="co-field co-field--wide">
                  <span>Email</span>
                  <input className="co-input" defaultValue={state.user.email} autoComplete="email" />
                  <em>Your receipt and tracking link go here.</em>
                </label>
                <label className="co-field">
                  <span>First name</span>
                  <input className="co-input" defaultValue={state.user.firstName} autoComplete="given-name" />
                </label>
                <label className="co-field">
                  <span>Last name</span>
                  <input className="co-input" defaultValue="Hassan" autoComplete="family-name" />
                </label>
                <label className="co-field co-field--wide">
                  <span>Phone</span>
                  <input className="co-input" defaultValue={state.user.phone} autoComplete="tel" inputMode="tel" />
                </label>
              </div>

              <div className="co-sub">
                <div className="co-sub__head">
                  <h3>
                    <IconPin size={15} /> Deliver to
                  </h3>
                  <Link to="/account/addresses" className="co-link">
                    Add an address <IconPlus size={13} />
                  </Link>
                </div>
                <div className="co-options">
                  {state.addresses.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      className={`co-option ${a.default ? 'is-on' : ''}`}
                      onClick={() => dispatch({ type: 'setDefaultAddress', id: a.id })}
                    >
                      <span className="co-option__dot" aria-hidden="true" />
                      <span className="co-option__body">
                        <b>{a.label}</b>
                        <em>
                          {a.line1}
                          {a.line2 ? `, ${a.line2}` : ''} · {a.city}
                        </em>
                      </span>
                      {a.default && <IconCheck size={16} className="co-option__tick" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="co-actions">
                <Link to="/cart" className="btn btn--ghost">
                  <IconArrowLeft size={15} /> Back to bag
                </Link>
                <button className="btn co-next" onClick={() => setStep(2)}>
                  Continue to delivery <IconArrowRight size={15} />
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="co-card">
              <div className="co-card__head">
                <h2>Delivery method</h2>
                <span className="co-badge">
                  <IconTruck size={13} /> Free over $100
                </span>
              </div>

              <div className="co-options">
                {deliveryOptions.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    className={`co-option ${state.delivery === d.id ? 'is-on' : ''}`}
                    onClick={() => dispatch({ type: 'delivery', id: d.id })}
                  >
                    <span className="co-option__dot" aria-hidden="true" />
                    <span className="co-option__body">
                      <b>{d.name}</b>
                      <em>{d.detail}</em>
                    </span>
                    <span className="co-option__price">
                      {d.price === 0 || cart.subtotal - cart.discount >= FREE_OVER ? 'Free' : formatUSD(d.price)}
                    </span>
                  </button>
                ))}
              </div>

              <label className="co-field co-field--wide" style={{ marginTop: 20 }}>
                <span>Delivery note (optional)</span>
                <textarea
                  className="co-input co-textarea"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Gate code, landmark, or a note for the courier"
                />
              </label>

              <div className="co-assure">
                <IconShield size={16} />
                <p>
                  Packed in recycled card and delivered by a local courier. If the box arrives damaged, we
                  replace it — no photographs, no forms.
                </p>
              </div>

              <div className="co-actions">
                <button className="btn btn--ghost" onClick={() => setStep(1)}>
                  <IconArrowLeft size={15} /> Back
                </button>
                <button className="btn co-next" onClick={() => setStep(3)}>
                  Continue to payment <IconArrowRight size={15} />
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="co-card">
              <div className="co-card__head">
                <h2>Payment</h2>
                <span className="co-badge co-badge--quiet">
                  <IconLock size={12} /> Encrypted
                </span>
              </div>

              <div className="co-options">
                {state.cards.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`co-option ${payMethod === c.id ? 'is-on' : ''}`}
                    onClick={() => setPayMethod(c.id)}
                  >
                    <span className="co-option__dot" aria-hidden="true" />
                    <span className="co-option__body">
                      <b className="row gap-8">
                        <IconCard size={16} /> {c.brand} ···· {c.last4}
                      </b>
                      <em>expires {c.exp}</em>
                    </span>
                    {c.default && <span className="co-option__tag">Default</span>}
                  </button>
                ))}
                <button
                  type="button"
                  className={`co-option ${payMethod === 'mobile' ? 'is-on' : ''}`}
                  onClick={() => setPayMethod('mobile')}
                >
                  <span className="co-option__dot" aria-hidden="true" />
                  <span className="co-option__body">
                    <b>Mobile money</b>
                    <em>M-Pesa, Airtel Money, Tigo Pesa — pay from your phone</em>
                  </span>
                </button>
              </div>

              {payMethod === 'mobile' ? (
                <label className="co-field co-field--wide" style={{ marginTop: 20 }}>
                  <span>Mobile number</span>
                  <input className="co-input" defaultValue={state.user.phone} inputMode="tel" />
                  <em>We send a prompt to approve the payment. Nothing is charged until you confirm.</em>
                </label>
              ) : (
                <div className="co-fields" style={{ marginTop: 20 }}>
                  <label className="co-field co-field--wide">
                    <span>Card number</span>
                    <input className="co-input" placeholder="4242 4242 4242 4242" inputMode="numeric" />
                  </label>
                  <label className="co-field">
                    <span>Expiry</span>
                    <input className="co-input" placeholder="MM / YY" inputMode="numeric" />
                  </label>
                  <label className="co-field">
                    <span>CVC</span>
                    <input className="co-input" placeholder="123" inputMode="numeric" />
                  </label>
                </div>
              )}

              <div className="co-checkline">
                <label className="checkline">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                  />
                  <span>Billing address is the same as delivery</span>
                </label>
              </div>

              <div className="co-actions">
                <button className="btn btn--ghost" onClick={() => setStep(2)}>
                  <IconArrowLeft size={15} /> Back
                </button>
                <button className="btn co-next co-pay" onClick={placeOrder} disabled={placing}>
                  {placing ? 'Placing order…' : (
                    <>
                      <IconLock size={14} /> Place order · {formatUSD(total)}
                    </>
                  )}
                </button>
              </div>

              <p className="co-fine">
                Demo store — no card is charged. By ordering you agree to our{' '}
                <a href="#/pages/terms">Terms</a> and <a href="#/pages/privacy">Privacy Policy</a>.
              </p>
            </section>
          )}

          <div className="co-help">
            <IconChat size={16} />
            <p>
              Stuck on something? <Link to="/chat">Message the studio</Link> — a person answers, usually
              within the hour.
            </p>
          </div>
        </div>

        {/* ------------------------------ summary ------------------------------ */}
        <aside className="checkout-side">
          <div className="co-summary">
            <div className="co-summary__head">
              <h2>Your bag</h2>
              <Link to="/cart" className="co-link">
                Edit
              </Link>
            </div>

            <ul className="co-lines">
              {lines.map((l) => (
                <li key={`${l.slug}-${l.color ?? ''}-${l.size ?? ''}-${l.key ?? ''}`} className="co-line">
                  <div className="co-line__img">
                    <img src={l.product.images[0]} alt="" />
                    <span className="co-line__qty">{l.qty}</span>
                  </div>
                  <div className="co-line__body">
                    <b>{l.product.name}</b>
                    <em>
                      {[l.color, l.size].filter(Boolean).join(' · ') || l.product.categoryName}
                    </em>
                  </div>
                  <span className="co-line__price">{formatUSD(l.product.price * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="co-promo">
              <input
                className="co-input"
                placeholder="Promo code — try VOLTA10"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                aria-label="Promo code"
              />
              <button type="button" className="btn btn--ghost" onClick={applyPromo}>
                Apply
              </button>
            </div>

            <dl className="co-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatUSD(cart.subtotal)}</dd>
              </div>
              {cart.discount > 0 && (
                <div className="is-discount">
                  <dt>Discount {state.promo ? `· ${state.promo.code}` : ''}</dt>
                  <dd>−{formatUSD(cart.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Delivery</dt>
                <dd>{shipping === 0 ? 'Free' : formatUSD(shipping)}</dd>
              </div>
              <div className="is-total">
                <dt>Total</dt>
                <dd>{formatUSD(total)}</dd>
              </div>
            </dl>

            <div className="co-summary__foot">
              <span>
                <IconShield size={14} /> 2-year warranty
              </span>
              <span>
                <IconTruck size={14} /> 30-day returns
              </span>
            </div>
          </div>

          <div className="co-reassure">
            <p className="co-reassure__q">
              “The buds arrived a day early, in a box I could actually recycle.”
            </p>
            <p className="co-reassure__by">Neema K. · verified buyer</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
