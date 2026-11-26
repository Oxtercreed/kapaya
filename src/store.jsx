import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { products, seedOrders, seedNotifications, addresses as seedAddresses, getProduct } from './data/catalog'

const KEY = 'kapaya.store.v1'
const AUTH_KEY = 'kapaya.authed.v1'

const now = () => Date.now()

const initialMessages = [
  {
    id: 'm1',
    from: 'owner',
    text: 'Hi Amani — Zawadi here from the VOLTA studio. Anything you want a closer look at?',
    ts: now() - 1000 * 60 * 62,
    read: true,
  },
  {
    id: 'm2',
    from: 'me',
    text: 'Hi Zawadi! I’m deciding between the Aurora Buds Pro and the Vertex H9 for the office.',
    ts: now() - 1000 * 60 * 58,
    read: true,
  },
  {
    id: 'm3',
    from: 'owner',
    text: 'Two very different jobs. For a shared office the H9 is the better pick — no ear fatigue at hour six. Aurora wins on a commute.', 
    ts: now() - 1000 * 60 * 56,
    read: true,
  },
  {
    id: 'm4',
    from: 'owner',
    text: 'Here’s the Aurora in the studio this morning — the case is softer than it looks.',
    ts: now() - 1000 * 60 * 55,
    read: true,
    attachments: [{ slug: 'sona-vessel' }],
  },
  {
    id: 'm5',
    from: 'me',
    text: 'That settles it. Do you have the H9 in Carbon, or is it backordered?',
    ts: now() - 1000 * 60 * 12,
    read: true,
  },
]

const freshState = () => ({
  user: {
    name: 'Amani Hassan',
    firstName: 'Amani',
    email: 'amani.hassan@gmail.com',
    phone: '+255 754 118 902',
    since: 'March 2024',
    tier: 'VOLTA Circle',
    points: 1840,
  },
  cart: [
    { key: 'aurora-buds-pro|||Cloud White', slug: 'aurora-buds-pro', qty: 1, size: null, color: 'Cloud White' },
  ],
  saved: ['vertex-h9-headphones', 'pulse-watch-s2'],
  orders: seedOrders,
  addresses: seedAddresses,
  cards: [
    { id: 'card-1', brand: 'Visa', last4: '4412', exp: '09/28', name: 'A. Hassan', default: true },
  ],
  messages: initialMessages,
  notifications: seedNotifications,
  recentSearches: ['wireless earbuds', 'desk mat'],
  promo: null,
  delivery: 'standard',
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return freshState()
    return { ...freshState(), ...JSON.parse(raw) }
  } catch {
    return freshState()
  }
}

const StoreCtx = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { slug, size = null, color = null, qty = 1 } = action
      const key = `${slug}|${size ?? ''}|${color ?? ''}`
      const found = state.cart.find((l) => l.key === key)
      const cart = found
        ? state.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 12) } : l))
        : [...state.cart, { key, slug, qty, size, color }]
      return { ...state, cart }
    }
    case 'setQty':
      return {
        ...state,
        cart: state.cart.flatMap((l) =>
          l.key === action.key
            ? action.qty <= 0
              ? []
              : [{ ...l, qty: Math.min(action.qty, 12) }]
            : [l],
        ),
      }
    case 'remove':
      return { ...state, cart: state.cart.filter((l) => l.key !== action.key) }
    case 'clearCart':
      return { ...state, cart: [], promo: null }
    case 'promo':
      return { ...state, promo: action.promo }
    case 'delivery':
      return { ...state, delivery: action.id }
    case 'toggleSave': {
      const has = state.saved.includes(action.slug)
      return { ...state, saved: has ? state.saved.filter((s) => s !== action.slug) : [action.slug, ...state.saved] }
    }
    case 'send': {
      const msg = { id: `m${now()}`, from: 'me', text: action.text, ts: now(), read: true, attachments: action.attachments }
      return { ...state, messages: [...state.messages, msg] }
    }
    case 'receive': {
      const msg = { id: `m${now()}`, from: 'owner', text: action.text, ts: now(), read: true, attachments: action.attachments }
      return { ...state, messages: [...state.messages, msg] }
    }
    case 'readThread': {
      return { ...state, notifications: state.notifications.map((n) => (n.type === 'chat' ? { ...n, read: true } : n)) }
    }
    case 'readNotif':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      }
    case 'readAllNotifs':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) }
    case 'updateUser':
      return { ...state, user: { ...state.user, ...action.patch } }
    case 'addOrder':
      return { ...state, orders: [action.order, ...state.orders] }
    case 'reorder': {
      const order = state.orders.find((o) => o.id === action.id)
      if (!order) return state
      let cart = state.cart
      for (const it of order.items) {
        const key = `${it.slug}|${it.size ?? ''}|${it.color ?? ''}`
        const found = cart.find((l) => l.key === key)
        cart = found
          ? cart.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + it.qty, 12) } : l))
          : [...cart, { key, slug: it.slug, qty: it.qty, size: it.size, color: it.color }]
      }
      return { ...state, cart }
    }
    case 'saveAddress': {
      const { addr } = action
      const exists = state.addresses.some((a) => a.id === addr.id)
      let list = exists ? state.addresses.map((a) => (a.id === addr.id ? addr : a)) : [...state.addresses, addr]
      if (addr.default) list = list.map((a) => ({ ...a, default: a.id === addr.id }))
      return { ...state, addresses: list }
    }
    case 'setDefaultAddress':
      return { ...state, addresses: state.addresses.map((a) => ({ ...a, default: a.id === action.id })) }
    case 'deleteAddress':
      return { ...state, addresses: state.addresses.filter((a) => a.id !== action.id) }
    case 'addCard': {
      const cards = action.card.default
        ? state.cards.map((c) => ({ ...c, default: false }))
        : state.cards
      return { ...state, cards: [...cards, action.card] }
    }
    case 'setDefaultCard':
      return { ...state, cards: state.cards.map((c) => ({ ...c, default: c.id === action.id })) }
    case 'deleteCard':
      return { ...state, cards: state.cards.filter((c) => c.id !== action.id) }
    case 'search':
      return {
        ...state,
        recentSearches: [action.q, ...state.recentSearches.filter((s) => s !== action.q)].slice(0, 5),
      }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === '1')
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state))
      } catch {
        /* ignore quota */
      }
    }, 120)
    return () => clearTimeout(t)
  }, [state])

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, authed ? '1' : '0')
  }, [authed])

  const toast = (message, opts = {}) => {
    const id = `t${now()}${Math.random().toString(16).slice(2, 6)}`
    setToasts((prev) => [...prev.slice(-2), { id, message, tone: opts.tone ?? 'ink', action: opts.action }])
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      delete timers.current[id]
    }, opts.duration ?? 3800)
  }

  const dismissToast = (id) => {
    clearTimeout(timers.current[id])
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const value = useMemo(() => {
    const lines = state.cart.map((l) => {
      const p = getProduct(l.slug)
      if (!p) return null
      const sizeDelta = l.size ? p.sizes?.find((s) => s.label === l.size)?.delta ?? 0 : 0
      const unit = p.price + sizeDelta
      return { ...l, product: p, unit, total: unit * l.qty }
    }).filter(Boolean)

    const subtotal = lines.reduce((sum, l) => sum + l.total, 0)
    const count = state.cart.reduce((n, l) => n + l.qty, 0)
    let discount = 0
    if (state.promo) {
      discount = state.promo.type === 'percent' ? Math.round(subtotal * (state.promo.value / 100)) : state.promo.value
      discount = Math.min(discount, subtotal)
    }
    return {
      state,
      dispatch,
      authed,
      setAuthed,
      toasts,
      toast,
      dismissToast,
      cart: { lines, subtotal, count, discount, total: Math.max(subtotal - discount, 0) },
      product: (slug) => products.find((p) => p.slug === slug),
    }
  }, [state, authed, toasts])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

/* ---------- helpers ---------- */

export const formatUSD = (n) => {
  const v = Math.round(n * 100) / 100
  return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/* Historical alias — the rest of the tree still imports this name. */
export const formatTZS = formatUSD

export const shortPrice = (n) => `${(n / 1000).toFixed(0)}k`

export const useCartCount = () => {
  const { cart } = useStore()
  return cart.count
}

/* ---------- scroll reveal (global singleton) ---------- */
let revealObserver = null
let revealScanner = null

function ensureReveal() {
  if (typeof window === 'undefined' || revealObserver) return
  const reveal = (el) => el.classList.add('is-in')

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(reveal)
    revealObserver = { disconnect() {} }
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target)
          revealObserver.unobserve(e.target)
        }
      })
    },
    { rootMargin: '0px 0px -5% 0px', threshold: 0.04 },
  )

  const scan = () => {
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => revealObserver.observe(el))
  }
  scan()

  // catch elements mounted later (filtered grids, route swaps, rails)
  revealScanner = new MutationObserver(() => scan())
  revealScanner.observe(document.body, { childList: true, subtree: true })

  // safety net: never leave content invisible if the observer misses
  const sweep = () => {
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.98 && r.bottom > -120) reveal(el)
    })
  }
  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      sweep()
      ticking = false
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => {
    scan()
    sweep()
  })
  setTimeout(sweep, 400)
}

export const useReveal = () => {
  useEffect(() => {
    ensureReveal()
  })
}

export { products, getProduct }
