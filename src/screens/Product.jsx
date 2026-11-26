import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, products, categoryName, REVIEW_POOL } from '../data/catalog'
import { useStore, formatTZS } from '../store'
import { Price, Qty, Stars, ProductCard, SectionHead, Accordion, Empty } from '../components/ui'
import {
  IconHeart,
  IconArrowRight,
  IconTruck,
  IconReturn,
  IconShield,
  IconCheck,
  IconChevronRight,
  IconLeaf,
  IconChat,
  IconSparkle,
} from '../components/Icons'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const nav = useNavigate()
  const { state, dispatch, toast } = useStore()
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  const [img, setImg] = useState(0)
  const [sizeErr, setSizeErr] = useState(false)

  useEffect(() => {
    if (!product) return
    setColor(product.colors?.[0]?.name ?? null)
    setSize(product.sizes ? product.sizes[Math.min(1, product.sizes.length - 1)].label : null)
    setImg(0)
    setQty(1)
    setSizeErr(false)
    document.title = `${product.name} · KAPAYA`
    document.body.classList.add('has-buybar')
    return () => document.body.classList.remove('has-buybar')
  }, [product?.slug])

  useEffect(() => {
    if (!product) return
    setColor(product.colors?.[0]?.name ?? null)
    setSize(product.sizes ? product.sizes[Math.min(1, product.sizes.length - 1)].label : null)
    setImg(0)
    setQty(1)
  }, [product])

  const reviews = useMemo(() => {
    if (!product) return []
    return REVIEW_POOL.slice(0, 4).map((r, i) => ({
      ...r,
      rating: i === 2 ? 4 : 5,
      title: [r.title, 'Quietly perfect', 'Happy with it', 'A forever piece'][i],
    }))
  }, [product])

  if (!product) {
    return (
      <div className="shell" style={{ paddingBlock: 80 }}>
        <Empty
          title="We can’t find that piece"
          body="It may have sold out or moved. Have a look at what’s in the studio right now."
          action={
            <Link to="/shop" className="btn" style={{ marginTop: 10 }}>
              Back to the shop
            </Link>
          }
        />
      </div>
    )
  }

  const saved = state.saved.includes(product.slug)
  const sizeDelta = size ? product.sizes?.find((s) => s.label === size)?.delta ?? 0 : 0
  const unit = product.price + sizeDelta

  const add = (goCart = false) => {
    dispatch({ type: 'add', slug: product.slug, size, color, qty })
    if (goCart) {
      nav('/cart')
      return
    }
    toast(`${product.name} added to your bag`, { action: { label: 'View bag', to: '/cart' } })
  }

  const related = products.filter((p) => p.slug !== product.slug && (p.category === product.category || p.studio === product.studio)).slice(0, 4)
  const fallbackRelated = products.filter((p) => p.slug !== product.slug).slice(0, 4)
  const relatedList = related.length >= 3 ? related : fallbackRelated

  const imgList = product.images

  return (
    <div>
      <div className="shell">
        <nav className="pdp__crumb" aria-label="Breadcrumb" style={{ paddingTop: 18 }}>
          <Link to="/">Home</Link>
          <IconChevronRight size={11} />
          <Link to={`/shop?category=${product.category}`}>{categoryName(product.category)}</Link>
          <IconChevronRight size={11} />
          <span style={{ color: 'var(--ink)' }}>{product.name}</span>
        </nav>

        <div className="pdp">
          {/* -------- media -------- */}
          <div className="pdp__media">
            <div className="pdp__stage">
              <div className="pdp__float">
                {product.badge && <span className="pcard__badge" style={{ position: 'static' }}>{product.badge}</span>}
                {product.compareAt && (
                  <span className="pcard__badge" style={{ position: 'static', background: 'var(--clay)', color: '#fff8f2' }}>
                    −{Math.round(100 - (product.price / product.compareAt) * 100)}%
                  </span>
                )}
              </div>
              <img key={imgList[img]} src={imgList[img]} alt={`${product.name} — view ${img + 1}`} />
            </div>
            <div className="pdp__thumbs" role="tablist" aria-label="Product images">
              {imgList.map((src, i) => (
                <button
                  key={src + i}
                  className={`pdp__thumb ${i === img ? 'is-on' : ''}`}
                  onClick={() => setImg(i)}
                  role="tab"
                  aria-selected={i === img}
                  aria-label={`View ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
              <div className="mob-only" style={{ display: imgList.length > 2 ? 'none' : 'flex' }} />
            </div>
          </div>

          {/* -------- info -------- */}
          <div className="pdp__info">
            <div className="row between gap-12 wrap">
              <p className="eyebrow" style={{ margin: 0 }}>
                <span className="dot" /> In stock · ships in 1–2 days
              </p>
              <button
                className="icon-btn"
                onClick={() => {
                  dispatch({ type: 'toggleSave', slug: product.slug })
                  toast(saved ? 'Removed from saved' : `${product.name} saved`, { duration: 2000 })
                }}
                aria-label={saved ? 'Remove from saved' : 'Save this piece'}
                style={{ width: 36, height: 36, border: '1px solid var(--line)' }}
              >
                <IconHeart size={17} filled={saved} />
              </button>
            </div>

            <h1>{product.name}</h1>
            <div className="pdp__rating">
              <Stars value={product.rating} size={13} showValue />
              <span>·</span>
              <a href="#reviews" className="underline-link">
                {product.reviews} reviews
              </a>
            </div>

            <div className="pdp__price">
              <b className="mono">{formatTZS(unit)}</b>
              {product.compareAt && <s className="mono">{formatTZS(product.compareAt)}</s>}
              {product.compareAt && <span className="pdp__save-pill">Save {formatTZS(product.compareAt - product.price)}</span>}
            </div>

            <p className="pdp__blurb">{product.blurb}</p>

            <Link to="/makers" className="pdp__madeby">
              <span className="monogram">{product.maker.split(' ').map((n) => n[0]).join('')}</span>
              <span>
                <b>Made by {product.maker}</b>
                <span>
                  {product.studio} · {product.origin}
                </span>
              </span>
              <IconArrowRight size={15} style={{ marginLeft: 'auto', color: 'var(--ink-faint)' }} />
            </Link>

            {product.colors && (
              <div className="opt-group">
                <div className="opt-head">
                  <span className="field-label">Colour</span>
                  <span className="val">{color}</span>
                </div>
                <div className="swatches">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      className={`swatch ${color === c.name ? 'is-on' : ''}`}
                      onClick={() => setColor(c.name)}
                      aria-pressed={color === c.name}
                    >
                      <i style={{ background: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="opt-group">
                <div className="opt-head">
                  <span className="field-label">Size</span>
                  <button
                    className="val underline-link"
                    onClick={() => toast('Full dimensions are listed under “Details” below.')}
                    type="button"
                  >
                    Size guide
                  </button>
                </div>
                <div className="size-opts">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      className={`size-opt ${size === s.label ? 'is-on' : ''}`}
                      onClick={() => {
                        setSize(s.label)
                        setSizeErr(false)
                      }}
                      aria-pressed={size === s.label}
                    >
                      <span>{s.label}</span>
                      <span className="size-opt__price">{formatTZS(product.price + s.delta)}</span>
                    </button>
                  ))}
                </div>
                {sizeErr && <p className="field-error" style={{ marginTop: 8 }}>Please choose a size</p>}
              </div>
            )}

            <div className="pdp__buy">
              <Qty value={qty} onChange={setQty} max={Math.min(12, product.stock)} />
              <button className="btn btn--lg" onClick={() => add(false)}>
                Add to bag — {formatTZS(unit * qty)}
              </button>
            </div>
            <button className="btn btn--ghost btn--block" style={{ marginTop: 9 }} onClick={() => add(true)}>
              Buy it now
            </button>

            <div className="pdp__meta">
              <div className="pdp__meta-row">
                <IconTruck size={16} />
                <span>
                  <b style={{ color: 'var(--ink)' }}>Delivery:</b> Free standard over TZS 500,000 · same-day in Dar before
                  12:00
                </span>
              </div>
              <div className="pdp__meta-row">
                <IconReturn size={16} />
                <span>
                  <b style={{ color: 'var(--ink)' }}>Returns:</b> 14 days, in original condition
                </span>
              </div>
              <div className="pdp__meta-row">
                <IconShield size={16} />
                <span>
                  <b style={{ color: 'var(--ink)' }}>Made to last:</b> repairable by the studio that made it
                </span>
              </div>
            </div>

            <div className="pdp__accordion">
              <Accordion
                defaultOpen={0}
                items={[
                  {
                    q: 'Details & dimensions',
                    a: (
                      <span>
                        {product.dimensions}
                        <br />
                        Materials: {product.materials}
                      </span>
                    ),
                  },
                  {
                    q: 'Care',
                    a: product.care,
                  },
                  {
                    q: 'What makes it special',
                    a: product.features.join(' · '),
                  },
                  {
                    q: 'Ask the studio',
                    a: (
                      <span>
                        Not sure it suits the room?{' '}
                        <Link to="/chat" className="underline-link">
                          Message Zawadi
                        </Link>{' '}
                        — she answers within the hour on weekdays.
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            <div className="pdp__service">
              <div>
                <IconLeaf size={17} /> Natural materials
              </div>
              <div>
                <IconSparkle size={17} /> Signed by maker
              </div>
              <div>
                <IconCheck size={17} /> Secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* -------- story -------- */}
        <section className="pdp-story">
          <div className="pdp-story__img">
            <img src={product.images[1] ?? product.images[0]} alt="" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow">
              <span className="dot" /> Made by hand
            </p>
            <h2>{product.studio}</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              {product.story}
            </p>
            <blockquote>“{product.features[0]}. That’s the whole idea.”</blockquote>
            <Link to="/makers" className="link-arrow" style={{ alignSelf: 'flex-start', marginTop: 22 }}>
              Meet the maker <IconArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* -------- reviews -------- */}
        <section id="reviews" style={{ paddingBottom: 40 }}>
          <div className="reviews-head">
            <div>
              <p className="eyebrow">
                <span className="dot" /> Reviews
              </p>
              <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', marginTop: 10 }}>What people are saying</h2>
            </div>
            <div className="review-summary">
              <div className="review-summary__big">{product.rating.toFixed(1)}</div>
              <div>
                <Stars value={product.rating} size={14} />
                <div className="tiny-meta" style={{ marginTop: 4 }}>
                  {product.reviews} verified reviews
                </div>
              </div>
            </div>
          </div>
          <div className="review-grid">
            {reviews.map((r) => (
              <article className="review" key={r.name}>
                <div className="review__top">
                  <div>
                    <div className="review__name">{r.name}</div>
                    <div className="review__city">{r.city}</div>
                  </div>
                  <Stars value={r.rating} size={12} />
                </div>
                <h4>{r.title}</h4>
                <p>{r.body}</p>
                <span className="review__verified">
                  <IconCheck size={12} /> Verified purchase
                </span>
              </article>
            ))}
          </div>
          <div className="row gap-8" style={{ marginTop: 22, alignItems: 'center' }}>
            <Link to="/chat" className="btn btn--ghost btn--sm">
              <IconChat size={14} /> Ask about this piece
            </Link>
            <span className="tiny-meta">Replies usually within the hour</span>
          </div>
        </section>

        {/* -------- related -------- */}
        <section className="section" style={{ paddingTop: 20 }}>
          <SectionHead
            kicker="Wears well together"
            title="You may also like"
            action={
              <Link to="/shop" className="link-arrow">
                Shop all <IconArrowRight size={15} />
              </Link>
            }
          />
          <div className="plp-grid">
            {relatedList.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>

      {/* sticky mobile buy */}
      <div className="buybar">
        <div className="buybar__price">
          <b className="mono">{formatTZS(unit)}</b>
          <span>{color ?? product.colors?.[0]?.name}</span>
        </div>
        <button className="btn" onClick={() => add(false)}>
          Add to bag
        </button>
      </div>
    </div>
  )
}
