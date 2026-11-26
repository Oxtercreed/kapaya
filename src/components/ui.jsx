import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, formatTZS } from '../store'
import { IconHeart, IconMinus, IconPlus, IconStar, IconCheck, IconClose, IconSearch } from './Icons'

/* ---------- Price ---------- */
export function Price({ value, compare, className = '', size }) {
  return (
    <span className={`mono ${className}`} style={size ? { fontSize: size } : undefined}>
      {compare ? <s>{formatTZS(compare)}</s> : null}
      {formatTZS(value)}
    </span>
  )
}

/* ---------- Stars ---------- */
export function Stars({ value = 5, reviews, size = 12, showValue = false }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} size={size} filled={i <= Math.round(value)} style={{ opacity: i <= Math.round(value) ? 1 : 0.28 }} />
      ))}
      {showValue && <b className="stars__val">{value.toFixed(1)}</b>}
      {reviews != null && <span className="stars__count">({reviews})</span>}
    </span>
  )
}

/* ---------- Product card ---------- */
export function ProductCard({ product, index = 0, compact = false }) {
  const { state, dispatch, toast } = useStore()
  const saved = state.saved.includes(product.slug)
  const [adding, setAdding] = useState(false)

  const quickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    dispatch({ type: 'add', slug: product.slug, size: product.sizes?.[1]?.label ?? product.sizes?.[0]?.label ?? null, color: product.colors?.[0]?.name ?? null })
    toast(`${product.name} added to your bag`, { action: { label: 'View bag', to: '/cart' } })
    setTimeout(() => setAdding(false), 1100)
  }

  const toggleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'toggleSave', slug: product.slug })
    toast(saved ? `Removed from saved` : `${product.name} saved`, { duration: 2000 })
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`pcard ${compact ? 'pcard--compact' : ''}`}
      data-reveal
      style={{ '--d': `${(index % 4) * 45}ms` }}
    >
      <div className="pcard__media">
        {product.badge && <span className="pcard__badge">{product.badge}</span>}
        <button
          className={`pcard__save ${saved ? 'is-on' : ''}`}
          onClick={toggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save for later'}
          aria-pressed={saved}
        >
          <IconHeart size={16} filled={saved} />
        </button>
        <img className="pcard__img" src={product.images[0]} alt={product.name} loading={index < 4 ? 'eager' : 'lazy'} />
        {product.images[1] && (
          <img className="pcard__img pcard__img--alt" src={product.images[1]} alt="" aria-hidden="true" loading="lazy" />
        )}
        <div className="pcard__quick">
          <button className="btn btn--sm" onClick={quickAdd}>
            {adding ? (
              <>
                <IconCheck size={14} /> Added
              </>
            ) : (
              'Quick add'
            )}
          </button>
        </div>
      </div>
      <div className="pcard__body">
        <div className="pcard__row">
          <h3 className="pcard__name">{product.name}</h3>
          <Price className="pcard__price" value={product.price} compare={product.compareAt} />
        </div>
        <div className="pcard__meta">
          <span>{product.studio}</span>
          <span className="sep" />
          <Stars value={product.rating} size={10} />
        </div>
      </div>
    </Link>
  )
}

/* ---------- Quantity stepper ---------- */
export function Qty({ value, onChange, min = 1, max = 12, small = false }) {
  return (
    <div className={`qty ${small ? 'qty--sm' : ''}`}>
      <button onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <IconMinus size={small ? 13 : 15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <IconPlus size={small ? 13 : 15} />
      </button>
    </div>
  )
}

/* ---------- Drawer / sheet ---------- */
export function Sheet({ open, onClose, title, children, side = 'right', width = 440, labelledBy }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className={`sheet-root ${side === 'left' ? 'is-left' : ''}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet" style={{ '--sheet-w': `${width}px` }}>
        <div className="sheet__head">
          <h2 id={labelledBy} className="sheet__title">
            {title}
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <IconClose size={20} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}

/* ---------- Toast host ---------- */
export function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="toast-host" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <IconCheck size={15} />
          <div className="toast__body">
            <span>{t.message}</span>
            {t.action && (
              <Link to={t.action.to} className="toast__action" onClick={() => dismissToast(t.id)}>
                {t.action.label}
              </Link>
            )}
          </div>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="toast__x">
            <IconClose size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ---------- Empty state ---------- */
export function Empty({ icon, title, body, action }) {
  return (
    <div className="empty">
      {icon && <div className="empty__icon">{icon}</div>}
      <h3 className="empty__title">{title}</h3>
      {body && <p className="empty__body">{body}</p>}
      {action}
    </div>
  )
}

/* ---------- Section heading ---------- */
export function SectionHead({ kicker, title, action, children }) {
  return (
    <div className="sec-head" data-reveal>
      <div>
        {kicker && (
          <p className="eyebrow">
            <span className="dot" />
            {kicker}
          </p>
        )}
        <h2 className="sec-head__title">{title}</h2>
        {children}
      </div>
      {action}
    </div>
  )
}

/* ---------- Accordion ---------- */
export function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div className={`acc__item ${open === i ? 'is-open' : ''}`} key={it.q}>
          <button className="acc__btn" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{it.q}</span>
            <span className="acc__sign">{open === i ? <IconMinus size={15} /> : <IconPlus size={15} />}</span>
          </button>
          <div className="acc__panel">
            <div className="acc__inner">
              <p>{it.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Scroll lock helper ---------- */
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

/* ---------- Drag scroller (for category slider) ---------- */
export function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false
    let startX = 0
    let startLeft = 0
    let moved = false
    const onDown = (e) => {
      if (e.pointerType === 'touch') return
      down = true
      moved = false
      startX = e.clientX
      startLeft = el.scrollLeft
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 3) {
        moved = true
        el.classList.add('is-dragging')
      }
      el.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      down = false
      el.classList.remove('is-dragging')
    }
    const onClick = (e) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [ref])
}

/* ---------- Search input ---------- */
export function SearchBox({ value, onChange, onSubmit, autoFocus, placeholder = 'Search the studio…', size = 'md' }) {
  return (
    <form
      className={`searchbox searchbox--${size}`}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(value)
      }}
      role="search"
    >
      <IconSearch size={17} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        autoFocus={autoFocus}
        autoComplete="off"
      />
      {value ? (
        <button type="button" className="searchbox__clear" onClick={() => onChange('')} aria-label="Clear search">
          <IconClose size={14} />
        </button>
      ) : null}
    </form>
  )
}

/* ---------- money total row ---------- */
export function TotalRow({ label, value, strong, muted, free }) {
  return (
    <div className={`total-row ${strong ? 'is-strong' : ''} ${muted ? 'is-muted' : ''}`}>
      <span>{label}</span>
      <span className="mono">{free ? 'Free' : formatTZS(value)}</span>
    </div>
  )
}
